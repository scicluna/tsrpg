"use client"

import { WorldNode } from "@/types/types"

type NodeEventProps = {
    node: WorldNode;
    player: any;
    updatePlayer: (any:any) => void;
}

export default function NodeEvent({node, player, updatePlayer}: NodeEventProps){
    return (
        <h1>EVENT</h1>
    )
}