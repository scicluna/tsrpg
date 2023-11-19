"use client"
import useNode from "@/hooks/useNode";
import usePlayer from "@/hooks/usePlayer";
import { Attack, Item, WorldNode, WorldEvent, Player, Monster } from "@/types/types";
import ChooseLocation from "./ChooseLocation";
import Encounter from "./Encounter";
import Town from "./Town";
import NodeEvent from "./NodeEvent";
import InventoryTab from "./InventoryTab";
import StatusTab from "./StatusTab";


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
    
    function locationTypeSwitch(){
        if (!currentNode.complete){
            switch(currentNode.locationType){
                case "Event":
                    return (
                        <NodeEvent node={currentNode} player={playerState} 
                        updatePlayer={updatePlayer} updateNode={updateNode}
                        eventDict={eventDict} monsterDict={monsterDict}/>
                    )
                case "Encounter":
                    return (
                        <Encounter node={currentNode} player={playerState} 
                        updatePlayer={updatePlayer} updateNode={updateNode}/>
                    )
                case "Town":
                    return (
                        <Town node={currentNode} player={playerState} 
                        updatePlayer={updatePlayer} moveToNode={moveToNode}/>
                    )
            }
        } else {
            return (
                <ChooseLocation node={currentNode} player={playerState} 
                updatePlayer={updatePlayer} moveToNode={moveToNode}/>
            )
        }
    }

    return (
        <main>
            {locationTypeSwitch()}
            <StatusTab player={playerState} updatePlayer={updatePlayer}/>
            <InventoryTab player={playerState} updatePlayer={updatePlayer}/>
        </main>
    )
}