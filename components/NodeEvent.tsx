"use client"

import { EffectTypes, Encounter, Player, WorldEvent, WorldEventChoice, WorldNode } from "@/types/types"
import { Button } from "./ui/button";

type NodeEventProps = {
    node: WorldNode;
    player: Player;
    updatePlayer: (any:any) => void;
    updateNode: (any:any) => void;
}

export default function NodeEvent({node, player, updatePlayer, updateNode}: NodeEventProps){
    const location = node.location as WorldEvent

    function chooseOption(choice: WorldEventChoice){
        const newPlayer = {...player}
        const effectArray = choice.outcome
        const effects = Object.keys(effectArray.effects) as EffectTypes[]
        effects.forEach((effect : EffectTypes ) => {
            if (effect === "items" || effect === "attacks"){
                newPlayer.stats.inventory.push(effectArray.effects[effect])
            } 
            else if (effect === "monsters"){
                // Transform the current node into an Encounter
                const encounter: Encounter = {
                    name: "Event Encounter",
                    description: "A sudden challenge appears!",
                    enemies: effectArray.effects[effect] // Assuming this is an array of monsters
                };
                node.location = encounter;
                node.locationType = "Encounter";
            }
            else {
                newPlayer.stats[effect] += effectArray.effects[effect]
            }
        })
        updatePlayer(newPlayer)
        if (!effects.includes("monsters")){
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