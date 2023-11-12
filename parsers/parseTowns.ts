import fs from 'fs/promises';
import { Town, WorldEvent } from "@/types/types";

export async function parseTowns(tier: number, eventDict: { [key: string]: WorldEvent } = {}) {
    const townDict: { [key: string]: Town } = {};

    const townFiles = await fs.readdir(`./vault/t${tier}/towns`);
    const filteredFiles = townFiles.filter(file => file.endsWith(".md"));

    for (const file of filteredFiles){
        const townName = file.split(".")[0].replace(/-/g, " "); 
        const townContent = await fs.readFile(`./vault/t${tier}/towns/${file}`, "utf-8");
        const townDescription = townContent.split("## Description:")[1].split("##")[0].trim();

        const townLocationSection = townContent.split("## Locations:")[1].split("\n")
        const townEvents: WorldEvent[] = [];
        for (let location of townLocationSection){
            location = location.trim().replace("[[", "").replace("]]", "")
            if (eventDict[location]){
                townEvents.push(eventDict[location])
            }
        }

        const town: Town = {
            name: townName,
            description: townDescription,
            visitLocations: townEvents,
        };

        townDict[townName] = town;
    }

    return townDict;
}