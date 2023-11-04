class Character {
    name: string;
    hp: number;
    mp: number;
    dmg: number;
    defense: number;
    gold: number;
    inventory: Item[];

    constructor(name: string, hp: number, mp: number, dmg: number, defense: number, gold: number, inventory: Item[]) {
        this.name = name;
        this.hp = hp;
        this.mp = mp;
        this.dmg = dmg;
        this.defense = defense;
        this.gold = gold;
        this.inventory = inventory;
    }

    //Handle Taking Damage
    takeDamage(dmg: number) {
        const netDamage = Math.max(dmg - this.defense, 0)
        this.hp -= netDamage;
        return netDamage;
    }

    //Handle Generic Attack
    attack(currentCharacter: Character, target: Character) {
        return target.takeDamage(currentCharacter.dmg);
    }

    //Checks if Character is Alive
    isAlive() {
        return this.hp > 0;
    }

    //Adds Item to Inventory
    addItem(item: Item) {
        this.inventory.push(item);
        return item;
    }

    //Removes Item from Inventory
    removeItem(item: Item) {
        this.inventory = this.inventory.filter((i) => i.name !== item.name);
        return item;
    }




}