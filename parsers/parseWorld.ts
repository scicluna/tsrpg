import { Player } from "@/types/types";
import { parseEncounters } from "./parseEncounters";
import { parseEvents } from "./parseEvents";
import { parseItems } from "./parseItems";
import { parseMonsters } from "./parseMonsters";
import { parseNodes } from "./parseNodes";
import { parseTowns } from "./parseTowns";
import { parseAttacks } from "./parseAttacks";

export async function parseWorld(tier: number, player: Player) {
    //will take MD from vault files and convert them into a series of TS objects under the struct "World"
    //TS objects will then interact with the front-end in an intuitive way

    const attackDict = await parseAttacks(tier);
    const itemDict = await parseItems(tier);
    const monsterDict = await parseMonsters(tier, itemDict, attackDict);
    const encounterDict = await parseEncounters(tier, monsterDict, player);
    const eventDict = await parseEvents(tier, itemDict, monsterDict, player);
    const townDict = await parseTowns(tier, eventDict);
    const nodeDict = await parseNodes(tier, eventDict, encounterDict, townDict);
    
    return {nodeDict, attackDict, itemDict};
}