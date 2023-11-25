import { WorldNode } from "@/types/types";

type TownProps = {
    node: WorldNode;
    player: any;
    updatePlayer: (any:any) => void;
    moveToNode: (any:any) => void;
}

export default function Town({node, player, updatePlayer, moveToNode}: TownProps){
    return (
        <h1>TOWN</h1>
    )
}