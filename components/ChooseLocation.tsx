import { ConnectedNode, Player, WorldNode } from "@/types/types";
import { Button } from "./ui/button";

type ChooseLocationProps = {
    node: WorldNode;
    player: Player;
    updatePlayer: (player:Player) => void;
    moveToNode: (nodeName:string) => void;
}

export default function ChooseLocation({node, player, moveToNode, updatePlayer}: ChooseLocationProps){
    
    //optional, possible i want more logic here
    function chooseLocation(nodeName: string){
        moveToNode(nodeName)
        updatePlayer({...player , location: nodeName})
    }

    return (
        <main className="h-screen w-full flex flex-col items-center justify-center">
        <div className="p-6">
            <p>Where to next?</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
            {node.connectedNodes.map((connectedNode) => {
                const nodeConnections = connectedNode as ConnectedNode
                return (
                    <Button key={nodeConnections.nodeName} onClick={()=>chooseLocation(nodeConnections.nodeName)}>{nodeConnections.nodeName}</Button>
                )
            })}
        </div>
    </main>
    )
}