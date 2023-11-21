import { Attack, Item, Player, WorldNode } from "@/types/types";

export async function loadUser(attackDict: { [key: string]: Attack}, itemDict: { [key: string]: Item}, nodeDict: { [key: string]: WorldNode }){
    //will eventually load a user from mongoDB using a clerk userId
    //for now, just returns a dummy user

    const newPlayer: Player = {
        name: "Hero",
        location:  nodeDict[Object.keys(nodeDict)[0]].name,
        stats: {
            hp: 20,
            maxhp: 20,
            mp: 10,
            maxmp: 10,
            damage: 2,
            defense: 0,
            exp: 0,
            level: 1,
            gold: 0,
            inventory: [{quantity: 1, details: itemDict["potion"]}],
            attacks: [attackDict["basic"]],
            equipped: {
                weapon: null,
                armor: null,
                accessory: null,
            }
        }
    }

    return newPlayer;
}