const BASE_URL = '';
const addForm = document.forms.addForm;
const buttonForm = document.querySelector('.submit-task');
const inputTask = document.querySelector('.input-task');
const listTasks = document.querySelector('.tasks-list');
let taskId = '';
let taskCompleted = '';

renderTasks();

addForm.addEventListener ('submit', (event) => {
  event.preventDefault();
  if (!!taskId){
    editTasks(taskId,inputTask.value,taskCompleted).then(() => renderTasks());
    taskId = '';
    taskCompleted = '';
    buttonForm.textContent = "Добавить";
  }
  else{
    createTasks(inputTask.value, false).then(() => renderTasks());
  } 
  inputTask.value = '';
})

async function createTasks(title, completed) {
  const task = {
    title,
    completed
  }
  return fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(task)
  })
}

async function deleteTask(id) {
  return fetch(`${BASE_URL}${id}`, {
    method: "DELETE",
  })
}

async function editTasks(id,title, completed) {
  const task = {
    title,
    completed
  }
  return fetch(`${BASE_URL}${id}`, {
    method: "PUT",
    body: JSON.stringify(task)
  })
}

async function renderTasks() {
  listTasks.textContent = '';
  const response = await fetch(BASE_URL);
  const tasks = await response.json();

  tasks.forEach((task) => {
    console.log(task.title);
    const newString = document.createElement('div');
    const newTask = document.createElement('div');
    const newDelete = document.createElement('div');
    const newEdit = document.createElement('div');
    newTask.textContent = task.title;
    newString.className = 'string';
    newTask.className = 'task';
    newEdit.className = 'edit';
    newDelete.className = 'delete';
    if (!!task.completed) {
      newTask.classList.add('task-do');
      listTasks.append(newString); 
    } else {
      listTasks.prepend(newString)
    }
    newString.prepend(newTask,newEdit,newDelete);

    newDelete.addEventListener('click', () => {
      deleteTask(task.id).then(() => renderTasks());
    })

    newTask.addEventListener('click', () => {
      if (!task.completed) {
        editTasks(task.id,task.title,true).then(() => renderTasks());
      } 
      else {
        editTasks(task.id,task.title,false).then(() => renderTasks());
      }
    })

    newEdit.addEventListener('click', () => {
      taskId = task.id;
      taskCompleted = task.completed;
      inputTask.value = task.title;
      buttonForm.textContent = "Редактировать";

    })
  });
}