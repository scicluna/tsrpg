import fs from 'fs/promises'
import { Encounter, Town, WorldEvent, WorldNode } from "@/types/types";

export async function parseNodes(
    tier: number, eventDict: { [key: string]: WorldEvent } = {},
    encounterDict: { [key: string]: Encounter } = {},
    townDict: { [key: string]: Town } = {}
    ) {

    const nodesDict: { [key: string]: WorldNode } = {};

    const nodeFiles = await fs.readdir(`./vault/t${tier}/nodes`);
    const filteredFiles = nodeFiles.filter(file => file.endsWith(".md"));

    for (const file of filteredFiles){
        const nodeName = file.split(".")[1].replace(/-/g, " ").trim();
        const nodeContent = await fs.readFile(`./vault/t${tier}/nodes/${file}`, "utf-8");

        const locationType = nodeContent.split("\n")[0].replace("## ","").replace(":","").trim();
        const locationEvent = nodeContent.split("\n")[1].replace("[[", "").replace("]]", "").trim();    
        let location = null;
        switch (locationType){
            case "Encounter":{
                location = encounterDict[locationEvent];
                break;
            }
            case "Town":{
                location = townDict[locationEvent];
                break;
            }
            case "Event":{
                location = eventDict[locationEvent];
                break;
            }
            case "Empty":{
                location = null;
                break;
            }
        }
        const connectedNodes = nodeContent.split("## Connected Nodes:")[1].split("\n").filter(node => node.trim() != "").map(node => node.trim().replace("[[", "").replace("]]", ""))
        nodesDict[nodeName] = {
            name: nodeName,
            location: location,
            connectedNodes: connectedNodes,
        }
    }

    return nodesDict;
}
