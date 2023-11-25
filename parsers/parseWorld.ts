import { parseEncounters } from "./parseEncounters";
import { parseEvents } from "./parseEvents";
import { parseItems } from "./parseItems";
import { parseMonsters } from "./parseMonsters";
import { parseNodes } from "./parseNodes";
import { parseTowns } from "./parseTowns";
import { parseAttacks } from "./parseAttacks";
import { parseMonsterImages } from "./parseMonsterImages";

export async function parseWorld(tier: number) {
    //will take MD from vault files and convert them into a series of TS objects under the struct "World"
    //TS objects will then interact with the front-end in an intuitive way
    //is it good now? idk. it's better than it was before, but it's still not great.

    const attackDict = await parseAttacks(tier);
    const itemDict = await parseItems(tier);
    const monsterImageDict = parseMonsterImages();
    const monsterDict = await parseMonsters(tier, itemDict, attackDict, monsterImageDict);
    const encounterDict = await parseEncounters(tier, monsterDict);
    const eventDict = await parseEvents(tier, itemDict, monsterDict);
    const townDict = await parseTowns(tier, eventDict);
    const nodeDict = await parseNodes(tier, eventDict, encounterDict, townDict);
    
    return {nodeDict, attackDict, itemDict, eventDict, monsterDict};
}