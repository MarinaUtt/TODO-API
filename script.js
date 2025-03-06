const BASE_URL = 'https://ca4b3cec7af0096f5da8.free.beeceptor.com/api/users/' ;
const addForm = document.forms.addForm;
const buttonForm = document.querySelector('.submit-task');
const inputTask = document.querySelector('.input-task');
const listTasks = document.querySelector('.tasks-list');
const dayTimer = document.querySelector('.day-input');
const hourTimer = document.querySelector('.hour-input');
const minuteTimer = document.querySelector('.minute-input');
let taskId = '';
const responsePromise = fetch(BASE_URL);

const timerStart  = function(dayElem, hourElem, minuteElem, secondElem, day, hour, minute, second) { 
  let minuteValue; 
  let hourValue;
  let secondValue;
  return async function f() {
    for (let j = day; j >= 0; j--) {
      dayElem.textContent = j;
      if (j < day){
        hourValue = 23;
      } else {
        hourValue = hour;
      }
      for (let x = hourValue; x >= 0; x--) {
        hourElem.textContent = x;
        if (x == hour & j == day) {
          minuteValue = minute;
        } else minuteValue = 59;
        for (let y = minuteValue; y >= 0; y--) {
          minuteElem.textContent = y;
          if (x == hour & j == day & y == minute) {
            secondValue = second;
          } else secondValue = 59;
          for (let i = secondValue; i >= 0; i--) {
            await new Promise(resolve => setTimeout(resolve,100));
            secondElem.textContent = i; 
          }
        } 
      }
    }
  } 
}

renderTasks();

addForm.addEventListener ('submit', (event) => {
  event.preventDefault();
  if (!!taskId){
    editTasks(taskId,inputTask.value).then(() => renderTasks());
    taskId = '';
    buttonForm.textContent = "Добавить";
  }
  else{
    createTasks(inputTask.value, false, dayTimer.value, hourTimer.value, minuteTimer.value, 0, true).then(() => renderTasks());
  } 
  inputTask.value = '';
  dayTimer.value = 0;
  hourTimer.value = 0;
  minuteTimer.value = 0;
})

async function createTasks(title, completed, day, hour, minute, second,statusTimer) {
  const task = {
    title,
    completed,
    timer: {
      day,
      hour,
      minute,
      second,
      statusTimer
    }
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

async function editTimerTasks(id, day, hour, minute, second, statusTimer) {
  const task = {
    timer: {
      day,
      hour,
      minute,
      second,
      statusTimer
    } 
  }
  return fetch(`${BASE_URL}${id}`, {
    method: "PATCH",
    body: JSON.stringify(task)
  })
}

async function editTasks(id, title) {
  const task = {
    title
     
  }

  return fetch(`${BASE_URL}${id}`, {
    method: "PATCH",
    body: JSON.stringify(task)
  })
}

async function editTasksCompleted(id, title, completed) {
  const task = {
    title,
    completed,
    } 

  return fetch(`${BASE_URL}${id}`, {
    method: "PATCH",
    body: JSON.stringify(task)
  })
}

async function renderTasks() {
  const response =  await fetch(BASE_URL);
  const tasks = await response.json();
  listTasks.textContent = '';
  
  tasks.forEach((task) => { 
    const newString = document.createElement('div');
    const newTask = document.createElement('div');
    const newDelete = document.createElement('div');
    const newEdit = document.createElement('div');
    const newTimer = document.createElement('div');
    const newDay = document.createElement('div');
    const newHour = document.createElement('div');
    const newMinute = document.createElement('div');
    const newSecond = document.createElement('div');
    const newStart = document.createElement('div');
    const newPause = document.createElement('div');
    newTask.textContent = task.title;
    newString.className = 'string';
    newTask.className = 'task';
    newEdit.className = 'edit';
    newDelete.className = 'delete';
    if (!!task.completed) {
      newTask.classList.add('task-do');
      listTasks.append(newString); 
      newString.prepend(newTask, newEdit,newDelete);
    } else {
      listTasks.prepend(newString);
      newDay.textContent = task.timer.day;
      newHour.textContent = task.timer.hour;
      newMinute.textContent = task.timer.minute;
      newSecond.textContent = task.timer.second;
      newTimer.className = 'timer';
      newDay.className ='timer-item day-timer';
      newHour.className ='timer-item hour-timer';
      newMinute.className ='timer-item minute-timer';
      newSecond.className ='timer-item second-timer';
      newStart.className = 'timer-start';
      newPause.classList = 'timer-pause';
      newTimer.prepend(newDay,newHour,newMinute, newSecond, newPause, newStart);
      newString.prepend(newTask,newTimer,newEdit,newDelete);
    
    if(!!task.timer.statusTimer) {
      let newTimerStart = timerStart(newDay, newHour, newMinute, newSecond, task.timer.day, task.timer.hour, task.timer.minute, task.timer.second);
      newTimerStart();
    }

    newPause.addEventListener('click', () => {
      editTimerTasks(task.id, newDay.textContent, newHour.textContent, newMinute.textContent, newSecond.textContent).then(() => renderTasks());
    })

    newStart.addEventListener('click', () => {
      let newTimerStart = timerStart(newDay, newHour, newMinute, newSecond, task.timer.day, task.timer.hour, task.timer.minute, task.timer.second);
      newTimerStart();
    })
  }

    newDelete.addEventListener('click', () => {
      deleteTask(task.id).then(() => renderTasks());
    })

    newTask.addEventListener('click', () => {
      if (!task.completed) {
        editTasksCompleted(task.id, task.title, true).then(() => renderTasks());
      } 
      else {
        editTasksCompleted(task.id, task.title, false).then(() => renderTasks());
      }
    })

    newEdit.addEventListener('click', () => {
      taskId = task.id;
      inputTask.value = task.title;
      buttonForm.textContent = "Редактировать";
    })

  });
}

