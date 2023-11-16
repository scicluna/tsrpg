import { Player } from "@/types/types";

type InventoryTabProps = {
    player: Player;
    updatePlayer: (player: Player) => void;
};

export default function InventoryTab({player, updatePlayer}: InventoryTabProps){
    return (
        <button>Inventory</button>
    )
}