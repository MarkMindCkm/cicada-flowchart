class Command {
    constructor(name) {
        this.name = name;
    }
    execute() { }
    undo() { }
    redo() {
        this.execute();
    }
}

export default Command;

