import fs from 'fs/promises';
import { Attack, Basic, Spell, Special, AttackType, StatusEffect, StatusEffectTypes } from '@/types/types';

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
                case "Spell":
                    // Common parsing logic for Special and Spell
                    const damageBonus = parseInt(attackContent.split("## Damage Bonus:")[1].split("##")[0].trim());
                    const damageMult = parseFloat(attackContent.split("## Damage Multiplier:")[1].split("##")[0].trim());
                    const multiTarget = attackContent.split("## Multi-Target:")[1].split("##")[0].trim().toLowerCase() === "true";
                    const mpCost = parseInt(attackContent.split("## MP Cost:")[1].split("##")[0].trim());
                
                    // New status effect parsing
                    const statusSection = attackContent.split("## Status:")[1].split("\n");
                    let statusEffect: StatusEffect = { type: 'poison', intensity: 0, duration: 0 };

                    for (const line of statusSection) {
                        const trimmedLine = line.trim();
                        if (trimmedLine) {
                            if (trimmedLine.includes("=")) {
                                const [key, value] = trimmedLine.split("=").map(part => part.trim());
                                if (key === 'intensity' || key === 'duration') {
                                    statusEffect[key] = parseInt(value);
                                }
                            } else {
                                statusEffect.type = trimmedLine as StatusEffectTypes; // aka, no = means its the type
                            }
                        }
                    }
                    attackDetails = {
                        damageBonus,
                        damageMult,
                        mpCost,
                        multiTarget,
                        status: statusEffect, // Add the parsed status effect
                    }  as Spell|Special;
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