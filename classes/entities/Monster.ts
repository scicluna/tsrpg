class Monster extends Character {
    loot: Item[];
    exp: number;
    attacks: Attack[];

    constructor(name: string, hp: number, mp: number, dmg: number, defense: number, gold: number, inventory: Item[], loot: Item[], exp: number) {
        super(name, hp, mp, dmg, defense, gold, inventory);
        this.loot = loot;
        this.exp = exp;
        this.attacks = [new Attack("Attack", this.attack)]
    }

    //Drop Loot
    dropLoot() {
        return this.loot;
    }

    //Rewards Gold
    rewardGold() {
        return this.gold;
    }

    //Rewards Experience
    rewardExp() {
        return this.exp;
    }

    //Pick Attack
    pickAttack() {
        const randomAttack = Math.floor(Math.random() * this.attacks.length);
        return this.attacks[randomAttack];
    }
}