import { Attack, Encounter, Monster, Player, Special, Spell, WorldNode } from "@/types/types";
import { useState } from "react";
import { Button } from "./ui/button";

type EncounterProps = {
    node: WorldNode;
    player: Player;
    updatePlayer: (any:any) => void;
    updateNode: (any:any) => void;
}

export default function Encounter({node, player, updatePlayer, updateNode}: EncounterProps){
    const location = node.location as Encounter
    const [monsters, setMonsters] = useState<Monster[]>(location.enemies);
    const [target, setTarget] = useState<number>(0)
    
    function selectTarget(i: number){
        setTarget(i)
    }

    //handle player attack
    //seperate logic for multitarget attacks
    //account for special effects
    function attackTarget(attack: Attack){
        const newMonsters = [...monsters]
        const newPlayer = {...player}
        const targetMonster = newMonsters[target]
        const damage = (attack.details.damageBonus + newPlayer.stats.damage - targetMonster.stats.defense) * (attack.details.damageMult)
        targetMonster.stats.hp = Math.max(targetMonster.stats.hp - damage, 0)
        
        if (attack.attackType !== "basic"){
            const ability = attack.details as Spell | Special
            if (ability.mpCost){
                newPlayer.stats.mp = Math.max(newPlayer.stats.mp - ability.mpCost, 0)
            }
        }
        
        if (targetMonster.stats.hp <= 0){
            newMonsters.splice(target, 1)
            if (target >= newMonsters.length-1){
                setTarget(0)
            }
        }
        
        setMonsters(newMonsters)
        updatePlayer(newPlayer)

        if (newMonsters.length === 0){
            console.log("Encounter Complete")
            node.complete = true
            updateNode(node)
        }
        
        monsterAttack()
    }

    //monster counter attacks
    function monsterAttack(){
        const newPlayer = {...player}
        
    }

    return (
        <main className="h-screen w-full flex items-center justify-center gap-40">
            <div className="grid grid-cols-1 gap-6">
                {player.stats.attacks.map(attack => (
                    <Button onClick={()=>attackTarget(attack)} key={attack.name}>{attack.name}</Button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
                {monsters.map((monster, i) => (
                    <Button onClick={()=>selectTarget(i)} variant={i === target ? "destructive" : "default"} key={`${i}-${monster.name}`}>{monster.name} - {monster.stats.hp}/{monster.stats.maxhp}</Button>
                ))}
            </div>
        </main>
    )
}