import { type } from "os";

type World = {
    nodes: WorldNode[];
}

type WorldNode = {
    name: string;
    location: Town | WorldEvent | Encounter | null;
    connectedNodes: {distance: number, nodeName: string}[] | string[];
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
    effect: WorldEventEffect;
}

type WorldEventEffect = {
    args: any[];
}

type Monster = {
    name: string;
    description: string;
    stats: {
        hp: number;
        damage: number;
        defense: number;
        loot: Item[];
        gold: number;
        exp: number;
        attacks: Attack[];
    }
}

type Player = {
    name: string;
    stats: {
        hp: number;
        maxhp: number;
        mp: number;
        maxmp: number;
        damage: number;
        defense: number;
        inventory: Item[];
        gold: number;
        exp: number;
        level: number;
        attacks: Attack[];
        spells: Spell[];
    }
}

type Item = {
    name: string;
    description: string;
    type: ItemType;
    stats: {
        args: any[];
    }
}

type ItemType = "weapon" | "armor" | "consumable" | "misc";

type Attack = {
    name: string;
    description: string;
    details: Basic | Spell | Special;
}

type Basic = {
    damageBonus: number;
    damageMult: number;
}

type Spell = {
    damageBonus: number;
    damageMult: number;
    mpCost: number;
    multiTarget: boolean;
    status: {
        [key: string] : string;
    }
}

type Special = {
    damageBonus: number;
    damageMult: number;
    mpCost: number;
    multiTarget: boolean;
    status: {
        [key: string] : string;
    }
}

// Path: types/types.d.ts



