import fs from "fs/promises";
import { Encounter, Monster, Player } from "@/types/types";
import { parseSection } from "@/utils/parseSection";

export async function parseEncounters(tier: number, monsterDict: { [key: string]: Monster } = {}, player: Player) {
    const encounterDict: { [key: string]: Encounter } = {};

    const encounterFiles = await fs.readdir(`./vault/t${tier}/encounters`);
    const filteredFiles = encounterFiles.filter(file => file.endsWith(".md"));

    for (const file of filteredFiles) {
        const encounterContent = await fs.readFile(`./vault/t${tier}/encounters/${file}`, "utf-8");
        const encounterName = file.split(".")[0].replace(/-/g, " ");
        const encounterDescription = parseSection(encounterContent, "Description")??"";

        const monsterSection = parseSection(encounterContent, "Monsters");
        const monsterNames = monsterSection.split("[[").slice(1).map(s => s.split("]]")[0]);
        const monsters = monsterNames.map(monsterName => monsterDict[monsterName]);

        const encounter: Encounter = {
            name: encounterName,
            description: encounterDescription, // Assuming there's no description section in the file
            enemies: monsters,
        };

        encounterDict[encounterName] = encounter;
    }
    return encounterDict;
}