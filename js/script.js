const addMessage = document.querySelector('.todo__message');
const addButton = document.querySelector('.todo__add');
const tasksList = document.querySelector('.todo__list');
const deleteButton = document.querySelector('.todo__taks-delete');

const tasks = [];

addButton.addEventListener('click', onAddButtonClick);

function onAddButtonClick() {
  const newTaskText = addMessage.value;
  if (newTaskText) {
    addTask(newTaskText);
    addMessage.value = '';
    tasksRender(tasks);
  }
}
// Выполняется когда нажимаем по кнопке

function addTask(text) {
  const task = {
    id: Date.now(),
    text,
    isComplete: false,
  };
  // Создание обьекта одной добавляемой задачи

  tasks.push(task);
  // Добавление созданной задачи в массив задач
}
// Функция добавления задач

function tasksRender(list) {
  const html = list
    .map(task => {
      let cls = task.isComplete ? 'todo__task todo__task-complete' : 'todo__task';
      // добавление класса выполненой задачи, если она выполнена
      const checked = task.isComplete ? 'checked' : '';
      // добавление атрибута поставленного чекбокса, если его поставили
      return `<li id="${task.id}" class="${cls}">
          <label class="todo__checkbox">
            <input type="checkbox" ${checked} />
            <div></div>
          </label>
          <span class="todo__task-text">${task.text}</span>
          <img class="todo__taks-delete" src="./image/Vector.svg" alt="delete-btn" />
        </li>`;
    })
    .join('');

  tasksList.innerHTML = html;
}

tasksList.addEventListener('click', event => {
  if (event.target.tagName === 'INPUT') {
    const isComplete = event.target.checked;
    const task = event.target.parentElement.parentElement;
    const taskId = task.id;
    changeTaskStatus(taskId, isComplete);
    tasksRender(tasks);
  }
  // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
  // по чекбоксу - тогда выяняем выполнина ли задача

  if (event.target.tagName === 'IMG') {
    const task = event.target.parentElement;
    const taskId = task.id;
    deleteTaks(taskId);
    tasksRender(tasks);
  }
});
//Функция вывода списка задач

function changeTaskStatus(id, status) {
  tasks.forEach(task => {
    if (task.id == id) {
      task.isComplete = status;
    }
  });
}
// мееняем статус задачи

function deleteTaks(id) {
  tasks.forEach((task, index) => {
    if (task.id == id) {
      tasks.splice(index, 1);
    }
  });
}

// let addMessage = document.querySelector(".message"),
//   addButton = document.querySelector(".add"),
//   toDo = document.querySelector(".todo");

// let toDoList = [];

// if (localStorage.getItem("todo")) {
//   toDoList = JSON.parse(localStorage.getItem("todo"));
//   displayMessages();
// }

// addButton.addEventListener("click", onAddButtonClick);

// function onAddButtonClick() {
//   let newToDo = {
//     todo: addMessage.value,
//     checked: false,
//     important: false,
//   };

//   toDoList.push(newToDo);
//   displayMessages();

//   localStorage.setItem("todo", JSON.stringify(toDoList));
//   addMessage.value = "";
// }

// function displayMessages() {
//   let displayMessage = "";
//   toDoList.forEach((item, i) => {
//     displayMessage += `
//         <li>
//           <input type="checkbox" id="item_${i}" ${
//       item.checked ? "checked" : ""
//     } />
//           <label for="item_${i}">${item.todo}</label>
//         </li>
//         `;
//     toDo.innerHTML = displayMessage;
//   });
// }

// toDo.addEventListener("change", onListChange);

// function onListChange(event) {
//   let idInput = event.target.getAttribute("id");
//   let forLable = toDo.querySelector("[for = " + idInput + "]");
//   let valueLable = forLable.textContent;
//   toDoList.forEach((item) => {
//     if (item.todo === valueLable) {
//       item.checked = !item.checked;
//       localStorage.setItem("todo", JSON.stringify(toDoList));
//     }
//   });
// }
