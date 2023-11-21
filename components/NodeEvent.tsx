"use client"

import { EffectTypes, Encounter, Item, Monster, Player, SimpleEffectTypes, WorldEvent, WorldEventChoice, WorldNode } from "@/types/types"
import { Button } from "./ui/button";

type NodeEventProps = {
    node: WorldNode;
    player: Player;
    updatePlayer: (any:any) => void;
    updateNode: (any:any) => void;
    eventDict: {[key: string]: WorldEvent};
    monsterDict: {[key: string]: Monster};
}

type EffectValue = number | string | Monster[] | Item[]

type Effects = {
    [key in EffectTypes]: EffectValue;
};

export default function NodeEvent({node, player, updatePlayer, updateNode, eventDict, monsterDict}: NodeEventProps){
    const location = node.location as WorldEvent

    function chooseOption(choice: WorldEventChoice){
        const newPlayer = {...player}
        const effects = choice.outcome.effects as Effects[];
        let stayFlag = false;
        effects.forEach((effect) => {
            const [effectKey, effectValue] = Object.entries(effect).flat(1)
            if (effectKey === "items" || effectKey === "attacks"){
                const itemList = effectValue as Item[];
                itemList.forEach(item => {
                    newPlayer.stats.inventory.push({details: item, quantity: 1})
                })
            } 
            else if (effectKey === "monsters"){
                const monsters = effectValue as Monster[]
                // Transform the current node into an Encounter
                const encounter: Encounter = {
                    name: "Event Encounter",
                    description: "A sudden challenge appears!",
                    enemies: monsters// Assuming this is an array of monsters
                };
                node.location = encounter;
                node.locationType = "Encounter";
                stayFlag = true;
            } 
            else if (effectKey === "event"){
                console.log(effectValue)
                const eventName = effectValue as string;
                // Transform current node event into new node event
                const event: WorldEvent = eventDict[eventName];
                node.location = event;
                stayFlag = true;
            }
            else {
                //ewww
                newPlayer.stats[effectKey as SimpleEffectTypes] += parseInt(effectValue as string)
            }
        })
        updatePlayer(newPlayer)
        if (!stayFlag){
            node.complete = true
        }
        updateNode(node)
    }

    return (
        <main className="h-screen w-full flex flex-col items-center justify-center">
            <div className="p-6">
                <p>{location.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {location.choices.map((choice) => (
                    <Button key={choice.description} onClick={()=>chooseOption(choice)}>{choice.description}</Button>
                ))}
            </div>
        </main>
    )
}