import { WorldNode } from "@/types/types";

export function connectNodes(nodesDict: { [key: string]: WorldNode }) {
    const keys = Object.keys(nodesDict);
    for (const key of keys){
        const node = nodesDict[key];
        const connectedNodes = node.connectedNodes;
        const connectedNodeObjects = [];
        
        for (const connectedNode of connectedNodes){
            if (typeof connectedNode == "string"){
            const nodeName = connectedNode.split(". ")[1].split(":")[0].trim()
            const nodeDistance = parseInt(connectedNode.split(":")[1].trim())
            connectedNodeObjects.push({nodeName: nodeName, distance: nodeDistance})  
            }
        }
        node.connectedNodes = connectedNodeObjects;
    }
}