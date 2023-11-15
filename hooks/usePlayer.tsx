import { Player } from "@/types/types";
import { useState } from "react";

export default function usePlayer(player: Player){
    const [playerState, setPlayerState] = useState(player)

    function updatePlayer(player: Player){
        setPlayerState(player)
    }

    return {
        playerState,
        updatePlayer
    }
}