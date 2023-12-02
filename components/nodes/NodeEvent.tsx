"use client"

import { EffectTypes, Encounter, Item, Monster, Player, SimpleEffectTypes, WorldEvent, WorldEventChoice, WorldNode } from "@/types/types"
import { Button } from "../ui/button";
import { useScrollingText } from "@/hooks/useScrollingText";

type NodeEventProps = {
    node: WorldNode;
    player: Player;
    updatePlayer: (any:any) => void;
    updateNode: (any:any) => void;
    eventDict: {[key: string]: WorldEvent};
    monsterDict: {[key: string]: Monster};
    setLeavingTown: (any:any) => void;
    updateScrollingText: (color: string, text: string) => void;
}

type EffectValue = number | string | Monster[] | Item[]

type Effects = {
    [key in EffectTypes]: EffectValue;
};

export default function NodeEvent({node, player, updatePlayer, updateNode, eventDict, monsterDict, setLeavingTown, updateScrollingText}: NodeEventProps){
    const location = node.location as WorldEvent

    function chooseOption(choice: WorldEventChoice){
        const newPlayer = {...player}
        const effects = choice.outcome.effects as Effects[];
        let complete = true;
        effects.forEach((effect) => {
            const [effectKey, effectValue] = Object.entries(effect).flat(1)
            if (effectKey === "items" || effectKey === "attacks"){
                const itemList = effectValue as Item[];
                itemList.forEach(item => {
                    // Check if the item already exists in the inventory
                    const existingItem = newPlayer.stats.inventory.find(i => i.details.name === item.name);
                    if (existingItem) {
                        // Item exists, update quantity
                        existingItem.quantity += 1;
                    } else {
                        // New item, add to inventory
                        newPlayer.stats.inventory.push({ details: item, quantity: 1 });
                    }
                });
                updateScrollingText('white', `Obtained Items: ${itemList.map(item => item.name).join(", ")}`)
            } 
            else if (effectKey === "monsters"){
                const monsters = effectValue as Monster[]
                const encounter: Encounter = {
                    name: "Event Encounter",
                    description: "A sudden challenge appears!",
                    enemies: monsters
                };
                node.location = encounter;
                node.locationType = "Encounter";
                complete = false;
            } 
            else if (effectKey === "event"){
                const eventName = effectValue as string;
                const event: WorldEvent = eventDict[eventName];
                node.location = event;
                complete = false;
            } else if (effectKey === "exit"){
                setLeavingTown(true)
                complete = false;
            }
            else {
                //ewww
                newPlayer.stats[effectKey as SimpleEffectTypes] += parseInt(effectValue as string)
                let effectColor = 'white'
                if (effectKey === "hp"){
                    effectColor = 'red'
                } else if (effectKey === "mp"){
                    effectColor = 'blue'
                } else if (effectKey === "xp"){
                    effectColor = 'green'
                } else if (effectKey === "gold"){
                    effectColor = 'yellow'
                }
                updateScrollingText(effectColor, `Obtained ${effectKey as string}: ${effectValue as string}`)
            }
        })
        
        updatePlayer(newPlayer)
        if (complete){
            node.complete = true
        }
        updateNode(node)
    }

    return (
        <main className="h-screen w-full flex flex-col items-center justify-center">
            <div className="p-6">
                <p>{location.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-12 relative">
                {location.choices.map((choice) => (
                    <Button key={choice.description} onClick={()=>chooseOption(choice)}>{choice.description}</Button>
                ))}
            </div>
        </main>
    )
}