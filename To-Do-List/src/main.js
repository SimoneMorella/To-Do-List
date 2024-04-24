import './index.css';
import { Project } from './project';
import { ToDo } from "./toDo";
import { asideManipulation, displayStartingPage, displayDueTodayToDo, 
    displayCompletedTasks, getNoTaskMessage, createInsertBtn, populateToDoBox, 
    resetEditBox, editTask } from './dom';

const projectBox = document.querySelector('[data-value="projects"]');
const projectInputName = document.querySelector('[data-name-input]');
const projectForm = document.querySelector('[data-project-form]'); 

const toDoContainer = document.querySelector('[data-todo-container]');
const projectTitleBox = document.querySelector('[data-project-title]');
const projectToDoCount = document.querySelector('[data-todo-count]');
const toDoList = document.querySelector('[data-todo-table]');

const toDoForm = document.querySelector('[data-todo-form]');
const toDoNameInput = document.querySelector('[data-todo-name-input]');
const toDoDescriptionInput = document.querySelector('[data-todo-description-input]');
const toDoPriorityInput = document.querySelector('[data-todo-priority-input]');
const toDoDateInput = document.querySelector('[data-todo-date-input]');

const dialogToDo = document.querySelector('[data-dialog-toDo]');
const dialogClose = document.querySelector('[data-close-dialog]');

const editContainer = document.querySelector('[data-edit-container]');
const editCancelBtn = document.querySelector('[data-cancel-edit]');
const editConfirmBtn =  document.querySelector('[data-confirm-edit]');

const dialogInsertTask = document.querySelector('[data-dialog-insert-todo]');

const allTasks = document.querySelector('.generic1');
const forToday = document.querySelector('.generic2');
const completed = document.querySelector('.generic3');

const STORAGE_PROJECT_KEY = 'projects.list';
const SELECTED_PROJECT_ID_STORED_KEY = 'selected.project';
const SELECTED_GENERAL_CATEGORY_ID_KEY = 'general category'

let selectedProjectID = localStorage.getItem(SELECTED_PROJECT_ID_STORED_KEY) || null;
let selectedGeneralID = localStorage.getItem(SELECTED_GENERAL_CATEGORY_ID_KEY) || null;
let projectsList = JSON.parse(localStorage.getItem(STORAGE_PROJECT_KEY)) || [];

// change the selectedProjectID for when I press one of these three
// in order to not make the project highlights when the general category are considered
allTasks.addEventListener('click', e => {
    selectedGeneralID = 'EveryTasks';
    selectedProjectID = null;
    clearBox(toDoList);
    displayStartingPage(projectsList, createToDoListItem);
    saveAndRender();
})

forToday.addEventListener('click', e => {
    selectedGeneralID = 'DueTodayTasks';
    selectedProjectID = null;
    clearBox(toDoList);
    displayDueTodayToDo(projectsList, createToDoListItem);
    saveAndRender();
})

completed.addEventListener('click', e => {
    selectedGeneralID = 'AlreadyCompletedTasks';
    selectedProjectID = null;
    clearBox(toDoList);
    displayCompletedTasks(projectsList, createToDoListItem);
    saveAndRender();
})


projectBox.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li' || e.target.tagName.toLowerCase() === 'div') {
        selectedGeneralID = null;
        selectedProjectID = e.target.dataset.projectID;
        saveAndRender();
 
    }
})

projectForm.addEventListener('submit', e => {
    e.preventDefault();
    let projectName = projectInputName.value;
    if (projectName === null || projectName === '') return;
    let project = new Project(projectName);
    projectInputName.value = null;
    projectsList.push(project);
    saveAndRender();
})

toDoForm.addEventListener('submit', e => {
    e.preventDefault();
    // here create a function to actually create the ToDoS then return the toDo in createdToDo
    let selectedProject = projectsList.find(project => project.id === selectedProjectID);
    Object.setPrototypeOf(selectedProject, Project.prototype);
    let createdToDo = createToDo(selectedProject.id);
    selectedProject.addToDo(createdToDo);
    dialogInsertTask.close();
    saveAndRender();
})

function createToDo(projectID) {
    let toDoName = toDoNameInput.value;
    let toDoPriority = toDoPriorityInput.value;
    let toDoDescription = toDoDescriptionInput.value;
    let toDoDate = toDoDateInput.value;

    if (toDoName === null || toDoPriority === null || toDoDescription === null || toDoDate == null 
    || toDoName === '' || toDoPriority === '' || toDoDescription === '' || toDoDate === '') return;

    let toDo = new ToDo(toDoName);
    toDo.setDescription(toDoDescription);
    toDo.setPriority(toDoPriority);
    toDo.setDueDate(toDoDate);
    toDo.setProjectID(projectID);

    toDoNameInput.value = null;
    toDoPriorityInput.value = null;
    toDoDescriptionInput.value = null;
    toDoDateInput.value = null;

    return toDo;

}

function createDeleteProjectBtn(selectedProject) {
    let deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "<i class='bx bx-x'></i>";
    deleteBtn.classList.add('flex', 'items-center', 'hover:animate-spin', 'text-xl', 'mr-10');
    selectedProject.append(deleteBtn);
    deleteProject(deleteBtn);
}

function deleteProject(button) {
    button.addEventListener('click', e => {
        e.stopPropagation();
        projectsList = projectsList.filter((project) => project.id !== selectedProjectID);
        // qui cambiare per allTasks?
        selectedProjectID = null;
        saveAndRender();
    })
}


function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(STORAGE_PROJECT_KEY, JSON.stringify(projectsList));
    localStorage.setItem(SELECTED_PROJECT_ID_STORED_KEY, selectedProjectID);
    localStorage.setItem(SELECTED_GENERAL_CATEGORY_ID_KEY, selectedGeneralID);
}

function render() {
    clearBox(projectBox);
    renderProjectList();
    if ((selectedProjectID === null || selectedProjectID === 'null') && (selectedGeneralID === null || selectedGeneralID === 'null')) {
        allTasks.classList.add('font-bold');
        forToday.classList.remove('font-bold');
        completed.classList.remove('font-bold');
        clearBox(toDoList);
        displayStartingPage(projectsList, createToDoListItem);
        return;
    }
    else if (selectedGeneralID === null || selectedGeneralID === 'null') {
        allTasks.classList.remove('font-bold');
        forToday.classList.remove('font-bold');
        completed.classList.remove('font-bold');
        let selectedProject = projectsList.find(project => project.id === selectedProjectID);
        changeProjectTitle(selectedProject);
        clearBox(toDoList);
        renderToDos(selectedProject);
    }

    else if (selectedProjectID === null || selectedProjectID === 'null') {
        if (selectedGeneralID === 'EveryTasks') {
            allTasks.classList.add('font-bold');
            forToday.classList.remove('font-bold');
            completed.classList.remove('font-bold');
            clearBox(toDoList);
            displayStartingPage(projectsList, createToDoListItem);
        }
        if (selectedGeneralID === 'DueTodayTasks') {
            allTasks.classList.remove('font-bold');
            forToday.classList.add('font-bold');
            completed.classList.remove('font-bold');
            clearBox(toDoList);
            displayDueTodayToDo(projectsList, createToDoListItem);
        }
        if (selectedGeneralID === 'AlreadyCompletedTasks') {
            allTasks.classList.remove('font-bold');
            forToday.classList.remove('font-bold');
            completed.classList.add('font-bold');
            clearBox(toDoList);
            displayCompletedTasks(projectsList, createToDoListItem);
        }
    }
}

function renderToDos(selectedProject) {
    getNoTaskMessage(selectedProject.toDo);
    createInsertBtn();
    selectedProject.toDo.forEach(toDoItem => {
        createToDoListItem(toDoItem, selectedProject.toDo);
    })
}

function createToDoListItem(toDo, tasksList) {
    let toDoEle = document.createElement('li');
    let toDoEleBox = document.createElement('div');
    let toDoNameBox = document.createElement('div');
    let priorityCircle = document.createElement('div');
    let toDoDate = document.createElement('div');
    let nameNCompleted = document.createElement('div');
    let completedCheck = document.createElement('div');
    completedCheck.classList.add('rounded-full', 'w-4', 'h-4', 'border', 'border-glass-blue', 'flex', 'justify-center', 'items-center');
    checkComplete(toDo, completedCheck, toDoNameBox);
    // function for changing the complete attribute to the toDo
    completeTask(toDo, completedCheck, toDoNameBox);
    toDoEle.dataset.toDoID = toDo.id;
    toDoEle.classList.add('flex', 'justify-between','bg-[#8ED1DC01]', 'items-center', 'shadow-glass-blue', 'shadow-sm', 'rounded-lg', 'py-1', 'px-3');
    toDoNameBox.textContent = toDo.name;
    nameNCompleted.classList.add('flex', 'items-center', 'gap-2')
    toDoEleBox.classList.add('text-lg', 'flex', 'justify-between', 'capitalize', 'w-11/12');
    toDoDate.textContent = toDo.dueDate;
    toDoDate.classList.add('text-sm', 'flex', 'items-center', 'gap-4')
    priorityCircle.classList.add('rounded-full', 'w-4', 'h-4');
    changePriorityColor(priorityCircle, toDo);
    nameNCompleted.appendChild(completedCheck);
    nameNCompleted.appendChild(toDoNameBox);
    toDoEleBox.appendChild(nameNCompleted);
    openToDoBox(toDoEle, tasksList);
    toDoDate.appendChild(priorityCircle);
    toDoEleBox.appendChild(toDoDate);
    toDoEle.append(toDoEleBox);
    deleteToDo(createToDoDeleteBtn(toDoEle), toDo.id);
    toDoList.append(toDoEle);
}

function completeTask(toDo, checkBtn, taskBox) {
    checkBtn.addEventListener('click', e => {
        e.stopPropagation();
        // da finire
        Object.setPrototypeOf(toDo, ToDo.prototype);
        (toDo.complete === true) ? toDo.setToOnGoing() : toDo.setToComplete();
        saveAndRender();
        checkBtn.classList.toggle('complete');
        if (checkBtn.classList.contains('complete')) {
            checkBtn.innerHTML = "<i class='bx bx-check'></i>";
        }
        else {
            checkBtn.innerHTML = "";
        }
        taskBox.classList.toggle('line-through');

    })
}

function checkComplete(toDo, checkBtn, taskBox) {
    if (toDo.complete === true) {
        checkBtn.classList.add('complete');
        checkBtn.innerHTML = "<i class='bx bx-check'></i>";
        taskBox.classList.add('line-through');
    }
    else {
        checkBtn.classList.remove('complete');
        checkBtn.innerHTML = "";
        taskBox.classList.remove('line-through');
    }
}

function changePriorityColor(priorityCircle, toDo) {
    switch (toDo.priority) {
        case "Low":
            priorityCircle.classList.add('bg-teal-400');
            break;
        case "Medium":
            priorityCircle.classList.add('bg-yellow-400');
            break;
        case "High":
            priorityCircle.classList.add('bg-red-500');
            break;
    }
}

function createToDoDeleteBtn(toDoBox) {
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "<i class='bx bx-x hover:animate-spin'></i>";
    deleteBtn.classList.add('text-black', 'text-xl', 'flex', 'items-center');
    toDoBox.append(deleteBtn);
    return deleteBtn;

}

function deleteToDo(button, toDoID) {
    button.addEventListener('click', e => {
        e.stopPropagation();
        let selectedProject = projectsList.find(project => project.id === selectedProjectID);
        Object.setPrototypeOf(selectedProject, Project.prototype);
        selectedProject.removeToDo(toDoID);
        saveAndRender();
    })
}

function openToDoBox(toDoBox, taskList) {
    // function to open the dialog but another function to put stuff inside
    toDoBox.addEventListener('click', e => {
        e.stopPropagation();
        populateToDoBox(toDoBox.dataset.toDoID, taskList);
        dialogToDo.showModal();
    })
    // to close the dialog
    dialogClose.addEventListener('click', () => {
        resetEditBox();
        dialogToDo.close();
    })

    editCancelBtn.addEventListener('click', () => {
        resetEditBox();
        dialogToDo.close();
    })

}

editContainer.addEventListener('submit', e => {
    e.preventDefault();
    console.log(editContainer);
    let selectedProject = projectsList.find(project => project.id === editContainer.dataset.ProjectID);
    Object.setPrototypeOf(selectedProject, Project.prototype);
    editTask(editContainer.dataset.ToDoID, selectedProject.toDo);
    saveAndRender();
    dialogToDo.close();

})


function changeProjectTitle(selectedProject) {
    if (selectedProject === null || selectedProject === undefined) return;
    projectTitleBox.textContent = selectedProject.name;
}


function renderProjectList() {
    projectsList.forEach(project => {
        let projectEle = document.createElement('li');
        let projectEleBox = document.createElement('div');
        projectEleBox.innerHTML = `<i class='bx bxs-right-arrow-alt flex items-center'></i> ${project.name}`;
        projectEleBox.classList.add('flex', 'gap-2', 'text-xl')
        projectEleBox.dataset.projectID = project.id;
        projectEle.dataset.projectID = project.id;
        projectEle.classList.add('flex', 'justify-between', 'items-center', 'group', 'rounded-lg', 'hover:bg-[#E0E0E0]', 'px-1', 'lg:py-1', 'cursor-pointer');
        projectEle.append(projectEleBox);
        if (project.id === selectedProjectID) {
            projectEle.classList.add('font-bold');
            projectEleBox.innerHTML = `<i class='bx bxs-right-arrow-alt flex items-center animate-floatLeft'></i> ${project.name}`;

            createDeleteProjectBtn(projectEle);
        } 
        projectBox.appendChild(projectEle);
    })
}

function clearBox(box) {
    while (box.firstChild) {
        box.removeChild(box.firstChild);
    }
}

render();
asideManipulation();
// it miss, the edit functionalities: basically in the dialog change all the div in inputs maybe recovering the input methodology as
// idk a template like in html