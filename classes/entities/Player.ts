

class Player extends Character {
    exp: number;
    level: number;
    attacks: Attack[];
    spells: Spell[];
    totalDaysPassed: number;
    equippedWeapon: Item | null;
    equippedArmor: Item | null;

    constructor(name: string, hp: number, mp: number, dmg: number, defense: number, gold: number, inventory: Item[], exp: number, level: number) {
        super(name, hp, mp, dmg, defense, gold, inventory);
        this.exp = exp;
        this.level = level;
        this.attacks = [new Attack("Attack", this.attack)];
        this.spells = [];
        this.totalDaysPassed = 0;
        this.equippedWeapon = null;
        this.equippedArmor = null;
    }

    //Gain Experience
    gainExp(exp: number) {
        this.exp += exp
        const nextLevel = 10 + this.level * 5

        if (this.exp >= nextLevel) {
            this.level += 1
            this.exp -= nextLevel
        }

        return this.level
    }

    //Add Attack to Player
    addAttack(attack: Attack) {
        this.attacks.push(attack);
        return attack;
    }

    //Add Spell to Player
    addSpell(spell: Spell) {
        this.spells.push(spell);
        return spell;
    }

    //Equip Weapon
    equipWeapon(item: Item | null) {
        if (this.equippedWeapon) {
            this.dmg -= this.equippedWeapon.dmg;
        }
        if (!item) {
            return null;
        }
        this.equippedWeapon = item;
        this.dmg += item.dmg;

        return this.equippedWeapon;
    }

    //Equip Armor
    equipArmor(item: Item | null) {
        if (this.equippedArmor) {
            this.defense -= this.equippedArmor.defense;
        }
        if (!item) {
            return null;
        }
        this.equippedArmor = item;
        this.defense += item.defense;

        return this.equippedArmor;
    }

}