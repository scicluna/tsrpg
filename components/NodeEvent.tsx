"use client"

import { EffectTypes, Encounter, Item, Monster, Player, SimpleEffectTypes, WorldEvent, WorldEventChoice, WorldNode } from "@/types/types"
import { Button } from "./ui/button";
import { useState } from "react";

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
    const [scrollingEffect, setScrollingEffect] = useState<{color: string, text: string}>({color: "", text: ""});

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
                stayFlag = true;
            } 
            else if (effectKey === "event"){
                const eventName = effectValue as string;
                const event: WorldEvent = eventDict[eventName];
                node.location = event;
                stayFlag = true;
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
        if (!stayFlag){
            node.complete = true
        }
        updateNode(node)
    }

    function updateScrollingText(color: string, text: string){
        setScrollingEffect({color: color, text: text})
        setTimeout(() => {
            setScrollingEffect({color: "", text: ""})
        }, 600)
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
                <div className={`-translate-x-1/2 -translate-y-1/2 transition-all absolute top-1/2 left-1/2 z-20`}>
                    <p className="text-2xl font-mono animate-bounce" style={{color: scrollingEffect.color}}>{scrollingEffect.text}</p>
                </div>
            </div>
        </main>
    )
}