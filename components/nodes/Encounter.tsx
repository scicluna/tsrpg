import { Attack, Encounter, Monster, Player, Special, Spell, WorldNode } from "@/types/types";
import { useState } from "react";
import { Button } from "../ui/button";
import MonsterCard from "../gameplay/MonsterCard";

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
    const [scrollingEffect, setScrollingEffect] = useState<{color: string, text: string}>({color: "", text: ""});
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
    //handle status effects somehow
    async function monsterAttack() {
        setWaiting(true);
        const newPlayer = {...player};
    
        for (let i = 0; i < monsters.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    const monster = monsters[i];
                    const attack = monster.stats.attacks[Math.floor(Math.random() * monster.stats.attacks.length)];
                    const damage = (attack.details.damageBonus + monster.stats.damage - newPlayer.stats.defense) * (attack.details.damageMult);
                    newPlayer.stats.hp = Math.max(newPlayer.stats.hp - damage, 0);
    
                    scrollText("red", `${monster.name} attacked ${newPlayer.name} for ${damage} damage!`)
                    // Update the player after each attack
                    updatePlayer({...newPlayer});
    
                    // Resolve the promise after the attack is done
                    resolve("done");
                }, 1000);
            });
        }
    
        setWaiting(false);
    }

    function scrollText(color: string, text: string){
        setScrollingEffect({color: color, text: text})
        setTimeout(() => {
            setScrollingEffect({color: "", text: ""})
        }, 600)
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
                    <button onClick={()=>selectTarget(i)} className={`${target === i && 'outline-dashed'}`} key={monster.id}>
                        <MonsterCard monster={monster}/>    
                    </button>
                ))}
                <div className={`-translate-x-1/2 translate-y-full transition-all absolute top-1/2 left-1/2 z-20`}>
                    <p className="text-2xl font-mono animate-bounce" style={{color: scrollingEffect.color}}>{scrollingEffect.text}</p>
                </div>
            </div>
        </main>
    )
}