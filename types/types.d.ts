import { type } from "os";

type World = {
    nodes: WorldNode[];
}

type WorldNode = {
    name: string;
    description: string;
    connection: WorldNode[];
    location: Town | WorldEvent | Encounter
}

type Town = {
    name: string;
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
    name: string;
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
    action: Function;
}

type Spell = {
    name: string;
    action: Function;
    mpCost: number;
}


// Path: types/types.d.ts


