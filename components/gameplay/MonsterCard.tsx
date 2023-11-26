import { Monster } from "@/types/types"
import Image from "next/image"

type MonsterProps = {
    monster: Monster
}

export default function MonsterCard({monster}: MonsterProps){
    

    return (
        <div className="relative w-32 h-32 flex flex-col justify-center items-center" >
            <h2>{monster.name}</h2>
            <div className="h-24 w-24 relative">
                {monster.image && <Image src={monster.image} alt="monster image" fill/>}
            </div>
            <div className="h-4 w-full">
                <div className="bg-red-600 h-3 transition-all duration-300 origin-left" style={{width : `${(monster.stats.hp/monster.stats.maxhp) * 100}%`}}/>
            </div>
        </div>
    )
}