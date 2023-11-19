import fs from 'fs/promises';
import { Attack, Basic, Spell, Special, AttackType } from '@/types/types';

export async function parseAttacks(tier: number){
    const attackDict: { [key: string]: Attack } = {};

    const attackFiles = await fs.readdir(`./vault/t${tier}/attacks`);
    const filteredFiles = attackFiles.filter(file => file.endsWith(".md"));

    for (const file of filteredFiles) {
        const attackContent = await fs.readFile(`./vault/t${tier}/attacks/${file}`, "utf-8");
        const attackName = file.split(".")[0].replace(/-/g, " ");
        const attackDescription = attackContent.split("## Description:")[1].split("##")[0].trim();
        const attackType = attackContent.split("## Type:")[1].split("##")[0].trim() as "Basic" | "Special" | "Spell";

        let attackDetails: Basic | Special | Spell;
        switch (attackType) {
            case "Basic":
                const basicDamageBonus = parseInt(attackContent.split("## Damage Bonus:")[1].split("##")[0].trim());
                const basicDamageMult = parseFloat(attackContent.split("## Damage Multiplier:")[1].split("##")[0].trim());
                attackDetails = {
                    damageBonus : basicDamageBonus,
                    damageMult : basicDamageMult,
                };
                break;
            case "Special":
                const specialDamageBonus = parseInt(attackContent.split("## Damage Bonus:")[1].split("##")[0].trim());
                const specialDamageMult = parseFloat(attackContent.split("## Damage Multiplier:")[1].split("##")[0].trim());
                const specialMultiTarget = attackContent.split("## Multi-Target:")[1].split("##")[0].trim().toLowerCase() === "true"
                const specialCost = parseInt(attackContent.split("## MP Cost:")[1].split("##")[0].trim());

                const statusDict: { [key: string]: string } = {};
                const specialStatusSection = attackContent.split("## Status:")[1].split("\n");
                for (const statusLine of specialStatusSection) {
                    const [statusName, statusValue] = statusLine.split("=").map(part => part.trim());
                    if (statusName && statusValue) {
                        statusDict[statusName] = statusValue;
                    }
                }

                attackDetails = {
                    damageBonus : specialDamageBonus,
                    damageMult : specialDamageMult,
                    mpCost: specialCost,
                    multiTarget : specialMultiTarget,
                    status : statusDict,
                };
                break;
            case "Spell":
                const spellDamageBonus = parseInt(attackContent.split("## Damage Bonus:")[1].split("##")[0].trim());
                const spellDamageMult = parseFloat(attackContent.split("## Damage Multiplier:")[1].split("##")[0].trim());
                const spellMultiTarget = attackContent.split("## Multi-Target:")[1].split("##")[0].trim().toLowerCase() === "true"
                const spellCost = parseInt(attackContent.split("## MP Cost:")[1].split("##")[0].trim());

                const spellStatusDict: { [key: string]: string } = {};
                const spellStatusSection = attackContent.split("## Status:")[1].split("\n");
                for (const statusLine of spellStatusSection) {
                    const [statusName, statusValue] = statusLine.split("=").map(part => part.trim());
                    if (statusName && statusValue) {
                        spellStatusDict[statusName] = statusValue;
                    }
                }
                
                attackDetails = {
                    damageBonus : spellDamageBonus,
                    damageMult : spellDamageMult,
                    mpCost: spellCost,
                    multiTarget : spellMultiTarget,
                    status : spellStatusDict,
                };
                break;
            }
        const attack: Attack = {
            name: attackName,
            attackType: attackType.toLowerCase() as AttackType,
            description: attackDescription,
            details: attackDetails
        };

        attackDict[attackName] = attack;
    }
    return attackDict;
}