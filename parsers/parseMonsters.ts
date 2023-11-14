import { Attack, Item, Monster } from "@/types/types";
import { parseSection } from "@/utils/parseSection";
import fs from "fs/promises";

export async function parseMonsters(tier: number, itemDict: { [key: string]: Item }, attackDict: { [key: string]: Attack }) {
    const monsterDict: { [key: string]: Monster } = {};

    const monsterFiles = await fs.readdir(`./vault/t${tier}/monsters`);
    const filteredFiles = monsterFiles.filter(file => file.endsWith(".md"));

    for (const file of filteredFiles) {
        const monsterContent = await fs.readFile(`./vault/t${tier}/monsters/${file}`, "utf-8");

        const monsterName = file.split(".")[0].replace(/-/g, " ");
        // Parsing individual stats
        const hp = parseInt(parseSection(monsterContent, "HP"));
        const damage = parseInt(parseSection(monsterContent, "Damage"));
        const defense = parseInt(parseSection(monsterContent, "Defense"));
        const gold = parseInt(parseSection(monsterContent, "Gold"));
        const exp = parseInt(parseSection(monsterContent, "Exp"));

        // Parsing Attacks
        const monsterAttacksSection = parseSection(monsterContent, "Attacks");
        const monsterAttacks = monsterAttacksSection.split("[[").slice(1).map(s => s.split("]]")[0]).map(attackName => attackDict[attackName]);

        // Parsing loot
        const lootSection = parseSection(monsterContent, "Loot");
        const lootItems = lootSection.split("[[").slice(1).map(s => s.split("]]")[0]).map(itemName => itemDict[itemName]);

        // Constructing the monster
        const monster: Monster = {
            name: monsterName,
            description: "", // Assuming there's no description section in the file
            stats: {
                hp,
                damage,
                defense,
                attacks: monsterAttacks,
                loot: lootItems,
                gold,
                exp,
            }
        };

        monsterDict[monsterName] = monster;
    }

    return monsterDict;
}