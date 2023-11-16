import { WorldNode } from "@/types/types";

type ChooseLocationProps = {
    node: WorldNode;
    player: any;
    updatePlayer: (any:any) => void;
    moveToNode: (any:any) => void;
}

export default function ChooseLocation({node, moveToNode}: ChooseLocationProps){
    return (
        <h1>CHOOSE LOCATION</h1>
    )
}