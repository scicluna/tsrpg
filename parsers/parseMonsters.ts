import { Attack, Item, Monster } from "@/types/types";
import { parseSection } from "@/utils/parseSection";
import { randomUUID } from "crypto";
import fs from "fs/promises";

export async function parseMonsters(tier: number, itemDict: { [key: string]: Item }, attackDict: { [key: string]: Attack }, monsterImageDict: { [key: string]: string }) {
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

        const monsterImage = monsterImageDict[monsterName.toLowerCase()];
        // Constructing the monster
        const monster: Monster = {
            name: monsterName,
            description: "", // Assuming there's no description section in the file
            stats: {
                hp,
                maxhp : hp,
                damage,
                defense,
                attacks: monsterAttacks,
                loot: lootItems,
                gold,
                exp,
                status: [],
            },
            image: monsterImage,
            id: ''
        };

        monsterDict[monsterName] = monster;
    }

    return monsterDict;
}