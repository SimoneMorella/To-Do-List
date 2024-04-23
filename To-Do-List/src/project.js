
export class Project {

    constructor(name) {
        this.id = Date.now().toString();
        this.name = name;
        this.toDo = [];
    }

    addToDo(toDoElement) {
        this.toDo.push(toDoElement);
    }

    removeToDo(toDoElementID) {
        this.toDo.splice(this.toDo.findIndex(todo => todo.id === toDoElementID), 1);
    }
}