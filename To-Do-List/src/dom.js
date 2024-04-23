import { add, format, parse } from 'date-fns';
import { ToDo } from './toDo';

const asideMobile = document.querySelector('aside');
const burgerBtn = document.querySelector('#dropMenu');

const toDoContainer = document.querySelector('[data-todo-container]');
const projectTitleBox = document.querySelector('[data-project-title]');
const projectToDoCount = document.querySelector('[data-todo-count]');
const toDoList = document.querySelector('[data-todo-table]');

const dialogClose1 = document.querySelector('[data-close]');

const dialogInsertTask = document.querySelector('[data-dialog-insert-todo]');

const editContainer = document.querySelector('[data-edit-container]');
const editStartBtn = document.querySelector('[data-start-edit]');
const editCancelBtn = document.querySelector('[data-cancel-edit]');
const editConfirmBtn =  document.querySelector('[data-confirm-edit]');
const dialogToDoTitle = document.querySelector('[data-todo-title]');
const dialogToDoDescrip = document.querySelector('[data-todo-description]');
const dialogToDoPriority = document.querySelector('[data-todo-priority]');
const dialogToDoComplete = document.querySelector('[data-todo-complete]');
const dialogToDoDate = document.querySelector('[data-todo-date]');

let dialogInputs = [dialogToDoTitle, dialogToDoDescrip, dialogToDoPriority,
                               dialogToDoComplete, dialogToDoDate];

export function asideManipulation() {
    burgerBtn.addEventListener('click', () => {
        asideMobile.classList.toggle('hidden');
        // asideMobile.classList.toggle('absolute');
    })
}

export function displayStartingPage(projectList, renderTasks) {
    projectTitleBox.textContent = 'All Tasks';
    let allToDos = [];
    projectList.forEach(project => {
        allToDos.push(...project.toDo);
    })
    getNoTaskMessage(allToDos);
    if (allToDos.length !== 0) {
        allToDos.forEach(task => {
            renderTasks(task, allToDos);
        })
    }


}
    export function displayDueTodayToDo(projectList, renderTasks) {
        projectTitleBox.textContent = 'For Today';
        let todayToDo = [];
        projectList.forEach(project => {
            todayToDo.push(...project.toDo.filter(toDo => toDo.dueDate === format(Date.now(), 'dd MMMM yyyy')));
        })
        getNoTaskMessage(todayToDo);
        if (todayToDo.length !== 0) {
            todayToDo.forEach(task => {
                renderTasks(task, todayToDo);
            })
        }
    }

    export function displayCompletedTasks(projectList, renderTasks) {
        projectTitleBox.textContent = 'Completed tasks';
        let completedTasks = [];
        projectList.forEach(project => {
            completedTasks.push(...project.toDo.filter(toDo => toDo.complete === true));
        })
        getNoTaskMessage(completedTasks);
        if (completedTasks.length !== 0) {
            completedTasks.forEach(task => {
                renderTasks(task, completedTasks);
            })
        }
    }

    export function getNoTaskMessage(taskList) {
        if (taskList.length === 0) {
            clearMessages(); 
            const messageBox = document.createElement('div');
            messageBox.classList.add('message');
            let noToDosBox = document.createElement('div');
            noToDosBox.textContent = 'Currently there are no tasks, Nice!';
            noToDosBox.classList.add('px-4', 'text-2xl', 'text-center', 'mt-2')
            let adviseBox = document.createElement('div');
            adviseBox.textContent = "Add new tasks in different projects, but don't stress.";
            adviseBox.classList.add('px-4', 'text-lg', 'text-center')
    
            messageBox.appendChild(noToDosBox);
            messageBox.appendChild(adviseBox);
    
            toDoContainer.appendChild(messageBox);
        }
        else {
            clearMessages();
        }
    }

    function clearMessages() {
        const noTasksMessage = document.querySelector('.message');
        const addBtn = document.querySelector('.btnBox');

        if (noTasksMessage) {
            toDoContainer.removeChild(noTasksMessage);
        }
        
        if (addBtn) {
            toDoContainer.removeChild(addBtn);
        }
    }

    export function createInsertBtn() {
        const btnBox = document.createElement('div');
        btnBox.classList.add('flex', 'justify-center', 'items-center', 'btnBox');
        const insertBtn = document.createElement('button');
        insertBtn.textContent = 'Add Task';
        insertBtn.classList.add('text-xl', 'px-5', 'py-3', 'rounded-xl', 'bg-glass-blue', 'text-alt-text', 'mt-4', 'border-2', 'border-glass-blue', 'transform','transition-all', 'duration-150', 'hover:scale-105');
        insertBtn.addEventListener('click', e => {
            dialogInsertTask.showModal();
        })
        closeInsertToDo();
        btnBox.appendChild(insertBtn);
        toDoContainer.appendChild(btnBox);
    }

    function closeInsertToDo() {
        dialogClose1.addEventListener('click', e => {
            dialogInsertTask.close();
        })
    }

    export function populateToDoBox(toDoItemID, toDoList) {
        let selectedToDo = toDoList.find(toDo => toDo.id === toDoItemID);
        console.log(selectedToDo);
        editContainer.dataset.ToDoID = toDoItemID;
        let dateObject = parse(selectedToDo.dueDate, 'dd MMMM yyyy', new Date());
        dialogToDoTitle.value = selectedToDo.name;
        dialogToDoDescrip.value = selectedToDo.description;
        dialogToDoPriority.value = selectedToDo.priority;
        dialogToDoComplete.value = selectedToDo.complete;
        dialogToDoDate.value = format(dateObject, 'yyyy-MM-dd');
        startEdit();

    }

    function startEdit() {
        editStartBtn.addEventListener('click', e => {
            let disabledInputs = editContainer.querySelectorAll('[disabled]');
            disabledInputs.forEach(ele => {
                ele.removeAttribute('disabled');
            })
            editStartBtn.classList.remove('flex');
            editStartBtn.classList.add('hidden');
            editCancelBtn.classList.add('flex');
            editCancelBtn.classList.remove('hidden');
            editConfirmBtn.classList.add('flex');
            editConfirmBtn.classList.remove('hidden');
        })
    }

    export function resetEditBox() {
        dialogInputs.forEach(ele => {
            ele.disabled = true;
        })
        editCancelBtn.classList.add('hidden');
        editCancelBtn.classList.remove('flex');
        editConfirmBtn.classList.remove('flex');
        editConfirmBtn.classList.add('hidden');
        editStartBtn.classList.add('flex');
        editStartBtn.classList.remove('hidden');
    }

    export function editTask(toDoItemID, toDoList) {
        let selectedToDo = toDoList.find(toDo => toDo.id === toDoItemID);
        Object.setPrototypeOf(selectedToDo, ToDo.prototype);
        console.log(selectedToDo);
        selectedToDo.name = dialogToDoTitle.value;
        selectedToDo.priority = dialogToDoPriority.value;
        dialogToDoComplete.value === 'true' ? selectedToDo.setToComplete() : selectedToDo.setToOnGoing();
        selectedToDo.description = dialogToDoDescrip.value;
        selectedToDo.setDueDate(dialogToDoDate.value);

        resetEditBox();
    }

    // aggiungere altre funzionalità
    // cosa manca?
    // edit function è la cosa principale manca
    // sistemare lo spawn delle altre 2 categorie generiche queste funzioni qua devono essere finite con la population
    // sistemare il dialog box del bottone che aggiunge le cose as todo insert
    // sistemare il front del box con i todo
    // fare responsive design
    // aggiungere footer
    // sistemare l'hover dei bottoni nel aside quando vengono hoverati e focussati voglio l'animazione!



    // update su cosa mi manca
    // edit function FUNZIONA MA DEVO SISTEMARE PER IL SELECTPROJECTID DELLE 3 CATEGORIE GENERALI
    // visualize task frontend and edit da finire con i bottoni e il front-end dell'edit FUNZIONA
    // aggiungere footer
    // fare responsive design
    // sistemare hover bottoni nell'aside per quando li seleziono qui devo mettere i selectprojectID anche ai primi 3 cosi i progetti non si selezionano
    // animazione apertura dialog