import { Player } from "@/types/types";
import { parseEncounters } from "./parseEncounters";
import { parseEvents } from "./parseEvents";
import { parseItems } from "./parseItems";
import { parseMonsters } from "./parseMonsters";
import { parseNodes } from "./parseNodes";
import { parseTowns } from "./parseTowns";
import { connectNodes } from "./connectNodes";

export async function parseWorld(tier: number, player: Player) {
    //will take MD from vault files and convert them into a series of TS objects under the struct "World"
    //TS objects will then interact with the front-end in an intuitive way

    const itemDict = await parseItems(tier);
    const monsterDict = await parseMonsters(tier, itemDict); //one day allow for special attacks to be parsed here
    const encounterDict = await parseEncounters(tier, monsterDict, player);
    const eventDict = await parseEvents(tier, itemDict, monsterDict, player);
    const townDict = await parseTowns(tier, eventDict);
    const nodesDict = await parseNodes(tier, eventDict, encounterDict, townDict);
    connectNodes(nodesDict);

    return nodesDict;
}