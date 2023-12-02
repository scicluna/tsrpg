import { ConnectedNode, Player, WorldNode } from "@/types/types";
import { Button } from "../ui/button";

type ChooseLocationProps = {
    node: WorldNode;
    player: Player;
    updatePlayer: (player:Player) => void;
    moveToNode: (nodeName:string) => void;
    setLeavingtown: (any:any) => void;
}

export default function ChooseLocation({node, player, moveToNode, updatePlayer, setLeavingtown}: ChooseLocationProps){
    
    //optional, possible i want more logic here
    function chooseLocation(nodeToConnect: ConnectedNode){
        setLeavingtown(false)
        moveToNode(nodeToConnect.nodeName)
        updatePlayer({...player , location: nodeToConnect.nodeName, stats: {...player.stats, days: player.stats.days+nodeToConnect.distance}})
    }

    return (
        <main className="h-screen w-full flex flex-col items-center justify-center">
        <div className="p-6">
            <p>Where to next?</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
            {node.connectedNodes.map((connectedNode) => {
                const nodeConnection = connectedNode as ConnectedNode
                return (
                    <Button key={nodeConnection.nodeName} onClick={()=>chooseLocation(nodeConnection)}>{`${nodeConnection.nodeName} - ${nodeConnection.distance} Days`}</Button>
                )
            })}
        </div>
    </main>
    )
}