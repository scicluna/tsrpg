import { Player } from "@/types/types";

type ProgressProps = {
    player: Player;
}

export default function Progress({player}: ProgressProps){
    return (
        <div className="flex gap-8 absolute left-1/2 top-6 -translate-x-1/2">
            <p>{player.location}</p>
            <p>Day {player.stats.days}</p>
        </div>
    )
}