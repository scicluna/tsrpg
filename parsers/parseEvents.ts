import fs from 'fs/promises';
import { Player, WorldEvent, WorldEventChoice, WorldEventOutcome, Item, Monster } from "@/types/types";

export async function parseEvents(tier: number, itemDict: { [key: string]: Item }, monsterDict: { [key: string]: Monster }) {
    const eventDict: { [key: string]: WorldEvent } = {};

    const eventFiles = await fs.readdir(`./vault/t${tier}/events`);
    const filteredFiles = eventFiles.filter(file => file.endsWith(".md"));
 
    for (const file of filteredFiles) {
        const eventContent = await fs.readFile(`./vault/t${tier}/events/${file}`, "utf-8");
        const eventName = file.split(".")[0].replace(/-/g, " ");
        const eventDescription = eventContent.split("## Description:")[1].split("##")[0].trim();

        const choicesSection = eventContent.split("## Choices:")[1].split("##")[0].trim();
        const worldChoices: WorldEventChoice[] = [];
        const choices = choicesSection.split("\n\n");

        for (let choice of choices) {
            const choiceDescription = choice.split("\n")[0].split(":")[1].trim();
            const outcomeSection = choice.split("\n").slice(1);

            const outcomeDescription = outcomeSection[0].split("-")[1].split(":")[1].trim();
            const effects = parseEffects(outcomeSection.slice(1), itemDict, monsterDict);

            const worldChoice: WorldEventChoice = {
                description: choiceDescription,
                outcome: {
                    description: outcomeDescription,
                    effects: effects,
                }
            };

            worldChoices.push(worldChoice);
        }

        const worldEvent: WorldEvent = {
            name: eventName,
            description: eventDescription,
            choices: worldChoices,
        };

        eventDict[eventName] = worldEvent;
    }

    return eventDict;
}

function parseEffects(effectLines: string[], itemDict: { [key: string]: Item }, monsterDict: { [key: string]: Monster }): any[] {
    let effects: any[] = [];
    let monsters = [];
    let items = [];

    for (let line of effectLines) {
        line = line.trim();
        if (!line) continue;

        if (line.includes("=")) {
            const [key, value] = line.split("=").map(s => s.trim().replace("- ", ""));
            if (key.startsWith('items') || key.startsWith('monsters')){
                const refs = value.split("[[").slice(1).map(s => s.split("]]")[0]);
                for (let ref of refs) {
                    ref = ref.replace('[',"")
                    if (itemDict[ref]) {
                        items.push(itemDict[ref]);
                    } else if (monsterDict[ref]) {
                        monsters.push(structuredClone(monsterDict[ref]));
                    }
                }
            } else if (key.startsWith('event')) {
                effects.push({ [key.replace('- ', '')]: value.replace('[[', '').replace(']]', '') });
            } else {
                effects.push({ [key.replace('- ', '')]: value });
            }
        }
    }
    if (monsters.length) effects.push({ monsters: monsters });
    if (items.length) effects.push({ items: items });

    return effects;
}