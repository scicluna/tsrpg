import { type } from "os";

type World = {
    nodes: WorldNode[];
}

type WorldNode = {
    name: string;
    location: Town | WorldEvent | Encounter | null;
    locationType: "Town" | "Event" | "Encounter"
    connectedNodes: ConnectedNode[] | string[];
    complete: boolean
}

type ConnectedNode = {
    distance: number;
    nodeName: string;
}

type Town = {
    name: string;
    description: string;
    visitLocations: WorldEvent[];
}

type WorldEvent = {
    name: string;
    description: string;
    choices: WorldEventChoice[];
}

type Encounter = {
    name: string;
    description: string;
    enemies: Monster[];
}

type WorldEventChoice = {
    description: string;
    outcome: WorldEventOutcome;
}

type WorldEventOutcome = {
    description: string;
    effects: {
        [key: string] : any;
    };
}

type Monster = {
    name: string;
    description: string;
    stats: {
        hp: number;
        maxhp: number;
        damage: number;
        defense: number;
        loot: Item[];
        gold: number;
        exp: number;
        attacks: Attack[];
        status: StatusEffect[]; // Array of status effects
    }
    image: string;
    id: string;
}

type Player = {
    name: string;
    location: string;
    stats: {
        hp: number;
        maxhp: number;
        mp: number;
        maxmp: number;
        damage: number;
        defense: number;
        inventory: {quantity: number, details: Item}[];
        gold: number;
        exp: number;
        level: number;
        attacks: Attack[];
        equipped: {
            weapon: Item | null;
            armor: Item | null;
            accessory: Item | null;
        }
        days: number;
        status: StatusEffect[]; // Array of status effects
    }
}

type EffectTypes = "hp" | "maxhp" | "mp" | "maxmp" | "damage" | "defense" | "gold" | "exp" | "items" | "attacks" | "monsters" | "event";
type SimpleEffectTypes = "hp" | "maxhp" | "mp" | "maxmp" | "damage" | "defense" | "gold" | "exp";

type Item = {
    name: string;
    description: string;
    type: ItemType;
    stats: {
        [key: string] : number;
    }
}

type ItemType = "weapon" | "armor" | "consumable" | "misc";

type StatusEffect = {
    type: StatusEffectTypes;
    duration: number;
    intensity?: number;
    originalValue?: number; // Store the original value of the stat here
}

type StatusEffectTypes = 'poison' | 'burn' | 'cursed' | 'regen';

type Attack = {
    name: string;
    description: string;
    attackType: AttackType;
    details: Basic | Spell | Special;
}

type AttackType = "basic" | "spell" | "special";

type Basic = {
    damageBonus: number;
    damageMult: number;
}

type Spell = {
    damageBonus: number;
    damageMult: number;
    mpCost: number;
    multiTarget: boolean;
    status?: StatusEffect
}

type Special = {
    damageBonus: number;
    damageMult: number;
    mpCost: number;
    multiTarget: boolean;
    status?: StatusEffect
}

// Path: types/types.d.ts



