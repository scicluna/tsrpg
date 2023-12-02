"use client"
import useNode from "@/hooks/useNode";
import usePlayer from "@/hooks/usePlayer";
import { Attack, Item, WorldNode, WorldEvent, Player, Monster } from "@/types/types";
import ChooseLocation from "./nodes/ChooseLocation";
import Encounter from "./nodes/Encounter";
import NodeEvent from "./nodes/NodeEvent";
import InventoryTab from "./staticUI/InventoryTab";
import StatusTab from "./staticUI/StatusTab";
import GameOver from "./nodes/GameOver";
import Progress from "./staticUI/Progress";
import { useState } from "react";
import { useScrollingText } from "@/hooks/useScrollingText";


type GameProps = {
    nodeDict:  {[key: string]: WorldNode};
    attackDict: {[key: string]: Attack};
    itemDict: {[key: string]: Item};
    eventDict: {[key: string]: WorldEvent};
    monsterDict: {[key: string]: Monster};
    playerData: Player;
};

export default function Game({ nodeDict, attackDict, itemDict, eventDict, monsterDict, playerData }: GameProps) {
    const { currentNode, moveToNode, updateNode} = useNode(nodeDict);
    const { playerState, updatePlayer} = usePlayer(playerData)
    const [leavingTown, setLeavingTown] = useState(false)
    const [FloatingText, updateScrollingText] = useScrollingText();

    if (playerState.stats.hp <= 0){
        return (
            <GameOver/>
        )
    }

    if (!currentNode){
        return (
            <GameOver/>
        )
    }

    function locationTypeSwitch(){
        if (!currentNode.complete && !leavingTown){
            switch(currentNode.locationType){
                case "Event":
                    return (
                        <NodeEvent node={currentNode} player={playerState} 
                        updatePlayer={updatePlayer} updateNode={updateNode}
                        eventDict={eventDict} monsterDict={monsterDict} setLeavingTown={setLeavingTown}
                        updateScrollingText={updateScrollingText}/>
                    )
                case "Encounter":
                    return (
                        <Encounter node={currentNode} player={playerState} 
                        updatePlayer={updatePlayer} updateNode={updateNode}
                        updateScrollingText={updateScrollingText}/>
                    )
            }
        } else {
            return (
                <ChooseLocation node={currentNode} player={playerState} 
                updatePlayer={updatePlayer} moveToNode={moveToNode} setLeavingtown={setLeavingTown}/>
            )
        }
    }

    return (
        <main>
            <Progress player={playerState}/>
            {locationTypeSwitch()}
            <StatusTab player={playerState} updatePlayer={updatePlayer}/>
            <InventoryTab player={playerState} updatePlayer={updatePlayer}/>
            <FloatingText/>
        </main>
    )
}