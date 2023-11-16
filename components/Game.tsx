"use client"
import useNode from "@/hooks/useNode";
import usePlayer from "@/hooks/usePlayer";
import { Attack, Item, WorldNode, WorldEvent, Player } from "@/types/types";
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
    playerData: Player;
};

export default function Game({ nodeDict, attackDict, itemDict, playerData }: GameProps) {
    const { currentNode, moveToNode} = useNode(nodeDict);
    const { playerState, updatePlayer} = usePlayer(playerData)
    
    function locationTypeSwitch(){
        if (!currentNode.complete){
            switch(currentNode.locationType){
                case "Event":
                    return (
                        <NodeEvent node={currentNode} player={playerState} 
                        updatePlayer={updatePlayer} />
                    )
                case "Encounter":
                    return (
                        <Encounter node={currentNode} player={playerState} 
                        updatePlayer={updatePlayer} />
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