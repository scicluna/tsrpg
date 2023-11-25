import { Item, Player } from "@/types/types";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

type InventoryTabProps = {
    player: Player;
    updatePlayer: (player: Player) => void;
};

export default function InventoryTab({player, updatePlayer}: InventoryTabProps){

    function useItem(item: Item){
        const newPlayer = {...player}
        if (item.type === "consumable"){
            if (item.stats["hp"]){
                newPlayer.stats.hp = Math.min(newPlayer.stats.hp + item.stats["hp"], newPlayer.stats.maxhp)
            }
            if (item.stats["mp"]){
                newPlayer.stats.mp = Math.min(newPlayer.stats.mp + item.stats["mp"], newPlayer.stats.maxmp)
            }
            newPlayer.stats.inventory = newPlayer.stats.inventory.map((invItem => {
                if (invItem.details.name === item.name){
                    invItem.quantity -= 1
                }
                return invItem
            })).filter((invItem) => invItem.quantity > 0)
            updatePlayer(newPlayer)
        }
        if (item.type === "weapon"){
            newPlayer.stats.equipped.weapon = item
            newPlayer.stats.damage = item.stats.damage + 1
            updatePlayer(newPlayer)    
        }
        if (item.type === "armor"){
            newPlayer.stats.equipped.armor = item
            newPlayer.stats.defense = item.stats.defense
            updatePlayer(newPlayer)    
        }
    }

    return (
    <Sheet>
        <SheetTrigger className="absolute top-6 right-6 text-lg font-semibold text-stone-950 dark:text-stone-50 hover:animate-pulse">Inventory</SheetTrigger>
        <SheetContent>
            <SheetHeader>
            <SheetTitle>Inventory</SheetTitle>
                {player.stats.inventory.map((item, i) => (
                    <SheetDescription key={i} className="hover:animate-pulse cursor-pointer" onClick={()=>{useItem(item.details)}}>{item.details.name}</SheetDescription>
                ))}
            </SheetHeader>
        </SheetContent>
    </Sheet>
    )
}