type ItemType = "WEAPON" | "ARMOR" | "CONSUMABLE" | "SPECIAL"

class Item {
    name: string;
    description: string;
    quantity: number;
    type: ItemType;
    dmg: number;
    defense: number;
    healing: number;
    special: string;

    constructor(name: string, description: string, quantity: number, type: ItemType, dmg: number, defense: number, healing: number, special: string) {
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.type = type;
        this.dmg = dmg;
        this.defense = defense;
        this.healing = healing;
        this.special = special;
    }

    useItem(target: Player) {
        if (this.type === "WEAPON") {
            target.equipWeapon(this);
        } else if (this.type === "ARMOR") {
            target.equipArmor(this);
        } else if (this.type === "CONSUMABLE") {
            //implement later
            this.quantity -= 1;
            if (this.quantity <= 0) {
                target.removeItem(this);
            }
        } else if (this.type === "SPECIAL") {
            //implement later
        }
    }

    //When referencing an item, it will return the name of the item
    toString() {
        return `${this.name} (x${this.quantity}): ${this.description}`;
    }
}