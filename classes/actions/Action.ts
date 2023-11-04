class Action {
    public name: string;
    public execute: Function;
    public constructor(name: string, execute: Function) {
        this.name = name;
        this.execute = execute;
    }

    public executeAction(currentCharacter: Character, target: Character) {
        this.execute(currentCharacter, target);
    }
}