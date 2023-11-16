import { WorldNode } from "@/types/types";

type EncounterProps = {
    node: WorldNode;
    player: any;
    updatePlayer: (any:any) => void;
}

export default function Encounter({node, player, updatePlayer}: EncounterProps){
    return (
        <h1>ENCOUNTER</h1>
    )
}