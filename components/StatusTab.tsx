import { Player } from "@/types/types";

type StatusTabProps = {
    player: Player;
    updatePlayer: (player: Player) => void;
};

export default function StatusTab({player, updatePlayer}: StatusTabProps){
    return (
        <button>Status</button>
    )
}