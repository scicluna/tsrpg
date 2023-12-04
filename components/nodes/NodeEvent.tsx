"use client"

import { EffectTypes, Encounter, Item, Monster, Player, SimpleEffectTypes, WorldEvent, WorldEventChoice, WorldNode } from "@/types/types"
import { Button } from "../ui/button";

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
    let complete = true;

    function chooseOption(choice: WorldEventChoice){
        const newPlayer = {...player}
        
        //handle effects to be applied to the player
        const effects = choice.outcome.effects as Effects[];

        effects.forEach(effect => {
            //extract the key and value from the effect
            const [effectKey, effectValue] = Object.entries(effect).flat(1)

            switch(effectKey){
                //handle town/dungeon exits
                case "exit":
                    complete = false;
                    setLeavingTown(true)
                    break;

                //handle item events
                case "items":
                    const itemList = effectValue as Item[];
                    handleItems(itemList, newPlayer);
                    updateScrollingText('white', `Obtained Items: ${itemList.map(item => item.name).join(", ")}`);
                    break;
                
                //handle event triggered encounters
                case "monsters":
                    const monsters = effectValue as Monster[];
                    handleEncounter(monsters);
                    break;
            
                //handle event chains
                case "event":
                    const eventName = effectValue as string;
                    handleChainEvent(eventName);
                    break;

                //handle simple effects
                default:
                    const effect = effectKey as SimpleEffectTypes;
                    const effectAmount = parseInt(effectValue as string);
                    handleSimpleEffect(effect, effectAmount, newPlayer);
                    break;
            }
        })
        //update player state
        updatePlayer(newPlayer)

        //check for node completion
        if (complete){
            console.log("node is complete")
            node.complete = true
        }

        //update node state
        updateNode(node)
    }

    function handleItems(items: Item[], player: Player){
        items.forEach(item => {
            // Check if the item already exists in the inventory
            const existingItem = player.stats.inventory.find(i => i.details.name === item.name);
            if (existingItem) {
                // Item exists, update quantity
                existingItem.quantity += 1;
            } else {
                // New item, add to inventory
                player.stats.inventory.push({ details: item, quantity: 1 });
            }
        });
    }

    function handleEncounter(monsters: Monster[]){
        //build a new encounter
        const encounter: Encounter = {
            name: "Event Encounter",
            description: "A sudden challenge appears!",
            enemies: monsters
        };
        //set the encounter as the new location
        node.location = encounter;
        node.locationType = "Encounter";

        updateScrollingText("red", `A sudden challenge appears!`)

        //set the encounter as incomplete as to not trigger the end of the event
        complete = false;
    }

    function handleChainEvent(eventName: string){
        //set the event as the new location using the eventDict
        const event: WorldEvent = eventDict[eventName];
        node.location = event;
        complete = false;
    }
    
    function handleSimpleEffect(effect: SimpleEffectTypes, effectAmount: number, player: Player){
        player.stats[effect] += effectAmount
        let effectColor = 'white'
        switch (effect){
            case "hp":
                effectColor = 'red'
                break;
            case "mp":
                effectColor = 'blue'
                break;
            case "exp":
                effectColor = 'green'
                break;
            case "gold":
                effectColor = 'yellow'
                break;
        }
        updateScrollingText(effectColor, `${effect as string}: ${effectAmount}`)
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