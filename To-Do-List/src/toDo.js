// here fare la classe dei toDo
import { format } from 'date-fns';

export class ToDo {
    constructor(name) {
        this.id = Date.now().toString();
        this.name = name;
        this.priority = null;
        this.complete = false;
        this.description = null;
        this.dueDate = null;
    }

    setPriority(priorityValue) {
        this.priority = priorityValue;
    }

    setDescription(descriptionText) {
        this.description = descriptionText;
    }

    setDueDate(dateValue) {
        this.dueDate = format(new Date(dateValue), 'dd MMMM yyyy');
    }

    setToComplete() {
        this.complete = true;
    }

    setToOnGoing() {
        this.complete = false;
    }

}