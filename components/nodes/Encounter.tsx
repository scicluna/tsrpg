import { Attack, Encounter, Monster, Player, Special, Spell, WorldNode } from "@/types/types";
import { useState } from "react";
import { Button } from "../ui/button";
import MonsterCard from "../gameplay/MonsterCard";
import { processStatusEffects } from "@/utils/processStatusEffects";
import { applyStatus } from "@/utils/applyStatus";

type EncounterProps = {
    node: WorldNode;
    player: Player;
    updatePlayer: (any:any) => void;
    updateNode: (any:any) => void;
    updateScrollingText: (color: string, text: string) => void;
}

export default function Encounter({node, player, updatePlayer, updateNode, updateScrollingText}: EncounterProps){
    const location = node.location as Encounter
    const [monsters, setMonsters] = useState<Monster[]>(location.enemies);
    const [target, setTarget] = useState<number>(0)
    const [waiting, setWaiting] = useState<boolean>(false);
        
    function selectTarget(i: number){
        setTarget(i)
    }

    function attackTarget(attack: Attack){
        //declare cloned variables to avoid mutating state
        const newMonsters = [...monsters]
        const newPlayer = {...player}

        //handle player status effects
        processStatusEffects(newPlayer, updateScrollingText);

        //determine target monster
        const targetMonster = newMonsters[target]

        //calculate damage + apply damage
        dealDamage(attack, targetMonster, newPlayer, "white");
        
        //handle non-basic attacks
        if (attack.name !== "basic"){
            const ability = attack.details as Spell | Special
            //consume mp
            if (ability.mpCost){
                newPlayer.stats.mp = Math.max(newPlayer.stats.mp - ability.mpCost, 0)
            }
            //apply status effects
            if (ability.status) {
                applyStatus(targetMonster, ability.status);
            }
        }

        //handle monster death and set new targets
        if (!isAlive(targetMonster)){
            updateScrollingText("red", `${targetMonster.name} was defeated!`)
            const nextTargetIndex = findNextTarget(target);
            setTarget(nextTargetIndex)

            if (nextTargetIndex === -1){
                endEncounter(newPlayer)
            } 
        }
        //set new state
        setMonsters(newMonsters)
        updatePlayer(newPlayer)
        monsterAttack()
    }

    //monster counter attacks
    //handle status effects somehow
    async function monsterAttack() {
        monsters.forEach(monster => {
            processStatusEffects(monster, updateScrollingText);
        })
        setWaiting(true);
        const newPlayer = {...player};
    
        for (let i = 0; i < monsters.length; i++) {
            const monster = monsters[i]

            //skip over dead monsters
            if (!isAlive(monster)) continue;

            //wait for each attack to finish before moving on
            await new Promise(resolve => {
                setTimeout(() => {
                    // Select a random attack
                    const attack = monster.stats.attacks[Math.floor(Math.random() * monster.stats.attacks.length)];

                    //calculate damage + apply damage
                    dealDamage(attack, newPlayer, monster, "red")

                    //handle non-basic attacks
                    if (attack.name !== "basic"){
                        const ability = attack.details as Spell | Special
                        if (ability.status) {
                            applyStatus(newPlayer, ability.status);
                        }
                    }
                    // Update the player after each attack
                    updatePlayer({...newPlayer});
    
                    // Resolve the promise after the attacks are done
                    resolve("done");
                }, 1000);
            });
        }
        //player's turn
        setWaiting(false);
    }
    

    function findNextTarget(currentIndex: number): number {
        let nextIndex = currentIndex;
        do {
            nextIndex = (nextIndex + 1) % monsters.length; // Loop back to the start if we reach the end
            if (isAlive(monsters[nextIndex])) {
                return nextIndex; // Return the index of the next living monster
            }
        } while (nextIndex !== currentIndex); // Continue until we loop back to the original target
    
        // Return -1 if all monsters are dead
        return -1; 
    }

    function dealDamage(attack: Attack, target: Monster | Player, attacker: Player | Monster, color: string = "red"){
        const damage = (attack.details.damageBonus + attacker.stats.damage - target.stats.defense) * (attack.details.damageMult)
        target.stats.hp = Math.max(target.stats.hp - damage, 0)
        updateScrollingText(color , `${attacker.name} attacked ${target.name} for ${damage} damage!`)
    }

    function isAlive(entity: Monster | Player){
        return entity.stats.hp > 0
    }

    function endEncounter(newPlayer: Player){
        //handles the end of the encounter
        setTarget(0) //reset for next encounter
        console.log("Encounter Complete");
        dropLoot(monsters, newPlayer);
        gainExp(monsters, newPlayer);
        updatePlayer(newPlayer);

        //set node to complete signaling the end of the encounter
        node.complete = true;
        updateNode(node);
    }

    function dropLoot(monsters:Monster[], player:Player){
        monsters.forEach(monster => {
            const drops = monster.stats.loot
            drops.forEach(drop => {
                const existingItem = player.stats.inventory.find(i => i.details.name === drop.name);
                if (existingItem) {
                    // Item exists, update quantity
                    existingItem.quantity += 1;
                } else {
                    // New item, add to inventory
                    player.stats.inventory.push({ details: drop, quantity: 1 });
                }
            });
        });
    }

    function gainExp(monsters:Monster[], player:Player){
        monsters.forEach(monster => {
            player.stats.exp += monster.stats.exp
        });
        if (player.stats.exp >= player.stats.level * 10){
            player.stats.exp -= player.stats.level * 10
            player.stats.level += 1
            //handle level up status changes
        }
    }

    return (
        <main className="h-screen w-full flex items-center justify-center gap-40">
            <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col">
                    <h1>{player.name}</h1>
                    <h1>HP: {player.stats.hp}/{player.stats.maxhp}</h1>
                    <h1>MP: {player.stats.mp}/{player.stats.maxmp}</h1>
                </div>

                {player.stats.attacks.map(attack => (
                    <Button disabled={waiting} onClick={()=>attackTarget(attack)} key={attack.name}>{attack.name}</Button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-12">
                {monsters.map((monster, i) => (
                    <button onClick={()=>{
                        if (monster.stats.hp > 0){
                            selectTarget(i)
                        }
                    }} className={`${target === i && 'outline-dashed'} ${monster.stats.hp === 0 && 'opacity-0'}`} key={monster.id}>
                        <MonsterCard monster={monster}/>    
                    </button>
                ))}
            </div>
        </main>

    )
}