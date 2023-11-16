import { Player } from "@/types/types";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";

type StatusTabProps = {
    player: Player;
    updatePlayer: (player: Player) => void;
};

export default function StatusTab({player, updatePlayer}: StatusTabProps){
    return (
        <Sheet>
        <SheetTrigger className="absolute top-6 left-6 text-lg font-semibold text-stone-950 dark:text-stone-50 hover:animate-pulse">Status</SheetTrigger>
        <SheetContent side={'left'}>
            <SheetHeader>
            <SheetTitle>Status</SheetTitle>
            <SheetDescription>HP: {player.stats.hp}/{player.stats.maxhp}</SheetDescription>
            <SheetDescription>MP: {player.stats.mp}/{player.stats.maxmp}</SheetDescription>
            <SheetDescription>Damage: {player.stats.damage}</SheetDescription>
            <SheetDescription>Defense: {player.stats.defense}</SheetDescription>
            <SheetDescription>Level: {player.stats.level}</SheetDescription>
            <SheetDescription>Experience: {player.stats.exp}/{player.stats.level * 10}</SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>
    )
}