"use client"
import useNode from "@/useNode";
import usePlayer from "@/hooks/usePlayer";
import { Attack, Item, WorldNode, WorldEvent } from "@/types/types";


type GameProps = {
    nodeDict:  {[key: string]: WorldNode};
    attackDict: {[key: string]: Attack};
    itemDict: {[key: string]: Item};
    player: any
};

export default function Game({ nodeDict, attackDict, itemDict, player }: GameProps) {
    /*
    flow: check current node and establish whether or not theres an encounter
    if there is an encounter, trigger combat component
    else
    trigger event component
    after event or combat, update player state and offer connected nodes as options to move onto
    */
    const { currentNode, moveToNode} = useNode(nodeDict, nodeDict[Object.keys(nodeDict)[0]].name);
    const { playerState, updatePlayer} = usePlayer(player)
    
    if (!currentNode.complete){
        switch(currentNode.locationType){
            case "Event":
                return (
                    <Event event={currentNode.location} player={playerState} updatePlayer={updatePlayer} />
                )
            case "Encounter":
                return (
                    <Encounter encounter={currentNode.location} player={playerState} updatePlayer={updatePlayer} />
                )
            case "Town":
                return (
                    <Town town={currentNode.location} player={playerState} updatePlayer={updatePlayer} />
                )
        }
    } else {
        return (
            <ChooseLocation node={currentNode} moveToNode={moveToNode}/>
        )
    }

    //player hook/state
    //node hook/state
    
    //combat component
    //event component
    //status component
    //inventory component
    //movement component
}