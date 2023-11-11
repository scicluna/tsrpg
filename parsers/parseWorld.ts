import { Player } from "@/types/types";
import { parseEncounters } from "./parseEncounters";
import { parseEvents } from "./parseEvents";
import { parseItems } from "./parseItems";
import { parseMonsters } from "./parseMonsters";
import { parseNodes } from "./parseNodes";
import { parseTowns } from "./parseTowns";

export async function parseWorld(tier: number, player: Player) {
    //will take MD from vault files and convert them into a series of TS objects under the struct "World"
    //TS objects will then interact with the front-end in an intuitive way

    const itemDict = await parseItems(tier);
    console.log(itemDict)
    // const monsterDict = await parseMonsters(tier, itemDict);
    // const encounterDict = await parseEncounters(tier, monsterDict, player);
    // const eventDict = await parseEvents(tier, itemDict, monsterDict, player);
    // const townDict = await parseTowns(tier, eventDict);

    // const nodesDict = await parseNodes(tier, eventDict, encounterDict, townDict);
    // const nodesList = Object.values(nodesDict);

    return  ;
}