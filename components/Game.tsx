"use client"
import { Attack, Item, WorldNode } from "@/types/types";

type GameProps = {
    nodeDict:  {[key: string]: WorldNode};
    attackDict: {[key: string]: Attack};
    itemDict: {[key: string]: Item};
    player: any
};

export default function Game({ nodeDict, attackDict, itemDict, player }: GameProps) {
    //player hook/state
    //node hook/state

    //combat component
    //event component
    
    return (
        <div>hi</div>
    )
}