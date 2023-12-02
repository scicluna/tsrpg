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

    //handle player attack
    //seperate logic for multitarget attacks
    //account for special effects
    function attackTarget(attack: Attack){
        const newMonsters = [...monsters]
        const newPlayer = {...player}
        processStatusEffects(newPlayer, updateScrollingText);
        const targetMonster = newMonsters[target]
        const damage = (attack.details.damageBonus + newPlayer.stats.damage - targetMonster.stats.defense) * (attack.details.damageMult)
        targetMonster.stats.hp = Math.max(targetMonster.stats.hp - damage, 0)
        updateScrollingText("white", `${newPlayer.name} attacked ${targetMonster.name} for ${damage} damage!`)
        
        if (attack.name !== "basic"){
            const ability = attack.details as Spell | Special
            if (ability.mpCost){
                newPlayer.stats.mp = Math.max(newPlayer.stats.mp - ability.mpCost, 0)
            }
            if (ability.status) {
                applyStatus(targetMonster, ability.status);
            }
        }
        
        if (targetMonster.stats.hp <= 0){
            updateScrollingText("red", `${targetMonster.name} was defeated!`)
            const nextTargetIndex = findNextTarget(target);
            if (nextTargetIndex !== -1) {
                setTarget(nextTargetIndex)
            } else {
                setTarget(0)
            }
        }
        
        setMonsters(newMonsters)
        updatePlayer(newPlayer)

        if (findNextTarget(target) === -1){
            console.log("Encounter Complete")
            
            monsters.forEach(monster => {
                const drops = monster.stats.loot
                drops.forEach(drop => {
                    const existingItem = newPlayer.stats.inventory.find(i => i.details.name === drop.name);
                    if (existingItem) {
                        // Item exists, update quantity
                        existingItem.quantity += 1;
                    } else {
                        // New item, add to inventory
                        newPlayer.stats.inventory.push({ details: drop, quantity: 1 });
                    }
                })
            })
            updatePlayer(newPlayer)
            node.complete = true
            updateNode(node)
        }
        
        monsterAttack()
    }

    function findNextTarget(currentIndex: number): number {
        let nextIndex = currentIndex;
        do {
            nextIndex = (nextIndex + 1) % monsters.length; // Loop back to the start if we reach the end
            if (monsters[nextIndex].stats.hp > 0) {
                return nextIndex; // Return the index of the next living monster
            }
        } while (nextIndex !== currentIndex); // Continue until we loop back to the original target
    
        return -1; // Return -1 if all monsters are dead
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
            if (monsters[i].stats.hp <= 0) continue;
            await new Promise(resolve => {
                setTimeout(() => {
                    const monster = monsters[i];
                    const attack = monster.stats.attacks[Math.floor(Math.random() * monster.stats.attacks.length)];
                    const damage = (attack.details.damageBonus + monster.stats.damage - newPlayer.stats.defense) * (attack.details.damageMult);
                    newPlayer.stats.hp = Math.max(newPlayer.stats.hp - damage, 0);

                    if (attack.name !== "basic"){
                        const ability = attack.details as Spell | Special
                        if (ability.status) {
                            applyStatus(newPlayer, ability.status);
                        }
                    }
    
                    updateScrollingText("red", `${monster.name} attacked ${newPlayer.name} for ${damage} damage!`)
                    // Update the player after each attack
                    updatePlayer({...newPlayer});
    
                    // Resolve the promise after the attack is done
                    resolve("done");
                }, 1000);
            });
        }
    
        setWaiting(false);
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