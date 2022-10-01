const addMessage = document.querySelector('.todo__message');
const addButton = document.querySelector('.todo__add');
const tasksList = document.querySelector('.todo__list');
const deleteButton = document.querySelector('.todo__taks-delete');
const deleteAllButton = document.querySelector('.delete-all-btn');
const saveBtn = document.querySelector('.save__btn');

window.addEventListener('keydown', sendAddMessage);
function sendAddMessage(event) {
  if (addButton.textContent === '+' && event.code === 'Enter') {
    onAddButtonClick();
  }
}

let tasks = [];

if (localStorage.getItem('todo')) {
  tasksRender(JSON.parse(localStorage.getItem('todo')));
  tasks = JSON.parse(localStorage.getItem('todo')).slice(0);
}

// Если мы открываем расширение и хотим там увидеть ранее записаные задачи
// то в этом куске кода я достаю из хранилища массив обьектов(твоих задач)
// и отрисовую их в разметке + записываю сразу в массив, потому что он при каждом открытии будет опусташаться

addButton.addEventListener('click', onAddButtonClick);
// добавляю слушатель на кнопку добавления задачи

deleteAllButton.addEventListener('click', () => {
  localStorage.setItem('todo', '');
  tasks = [];
  tasksList.innerHTML = '';
  deleteAllButton.style.display = 'none';
});
// Функционал кнопки удаления всех задач

function onAddButtonClick() {
  const newTaskText = addMessage.value;
  if (newTaskText) {
    addTask(newTaskText);
    // добавляю новую задачу в массив + в хранилище
    addMessage.value = '';
    tasksRender(JSON.parse(localStorage.getItem('todo')));
    // рендерю раметку по данным из хранилища
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
  localStorage.setItem('todo', JSON.stringify(tasks));
  // Добавление созданной задачи в массив задач и в хранилище
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
          <input type="text" class="todo__task-text" value="${task.text}" readonly>
          <img class="todo__task-edit" src="./image/edit_pencil.svg" alt="edit-btn" />
          <img class="todo__taks-delete" src="./image/Vector.svg" alt="delete-btn" />
        </li>`;
    })
    .join('');

  tasksList.innerHTML = html;
  // суть отрисовки страницы, при добавлении каждой задачи, или изменении статуса задачи, они перерисовуются

  if (localStorage.getItem('todo') !== '[]') {
    deleteAllButton.style.display = 'block';
  } else {
    deleteAllButton.style.display = 'none';
  }
  // отображает кнопку удаления всего, если есть какая то задача в списке
}

tasksList.addEventListener('click', event => {
  if (event.target.tagName === 'INPUT') {
    const isComplete = event.target.checked;
    const task = event.target.parentElement.parentElement;
    const taskId = task.id;
    changeTaskStatus(taskId, isComplete);
    localStorage.setItem('todo', JSON.stringify(tasks));
    tasksRender(JSON.parse(localStorage.getItem('todo')));
  }
  // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
  // по чекбоксу - тогда выясняем выполнина ли задача(меняем статус отовсюду, и хранилище, и массив, и разметка)

  if (event.target.classList.contains('todo__taks-delete')) {
    const task = event.target.parentElement;
    const taskId = task.id;
    deleteTaks(taskId);
    localStorage.setItem('todo', JSON.stringify(tasks));
    tasksRender(JSON.parse(localStorage.getItem('todo')));
  }
  // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
  // по кнопке удаления - тогда удаляем задачу(отовсюду, и хранилище, и массив, и разметка)

  if (event.target.classList.contains('todo__task-edit')) {
    const task = event.target.parentElement;
    const taskId = task.id;
    editTask(taskId);
  }
  // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
  // по кнопке редактирования - тогда редактируем задачу(отовсюду, и хранилище, и массив, и разметка)
});
//Делегирование событий, для удаления\изменения статуса задач

function changeTaskStatus(id, status) {
  tasks.forEach(task => {
    if (task.id == id) {
      task.isComplete = status;
    }
  });
}
// мееняем статус задачи в массиве

function deleteTaks(id) {
  tasks.forEach((task, index) => {
    if (task.id == id) {
      tasks.splice(index, 1);
    }
  });
}
// удаляем задачу из массива

function editTask(id) {
  if (addMessage.value === '') {
    addButton.style.display = 'none';
    addButton.textContent = '-';
    saveBtn.style.display = 'block';
    // кнопочке сохранения и добавляения удалять и добавлять дисплей ноне, в зависимисти от ситуации

    tasks.forEach(task => {
      if (task.id == id) {
        window.addEventListener('keydown', saveEditMessage);
        function saveEditMessage(event) {
          if (addButton.textContent === '-' && event.code === 'Enter') {
            editMessage();
          }
        }
        // Если мы находимся в режиме редактирования, то по нажатию Enter у нас происходит то же самое что
        // и при нажатии saveBtn

        addMessage.value = task.text;
        addMessage.focus();
        // Вкидываем в инпут текст выбранной для редактируемой задачи и фокусируемся на нем

        saveBtn.addEventListener('click', editMessage);
        function editMessage() {
          task.text = addMessage.value;
          addMessage.value = '';
          localStorage.setItem('todo', JSON.stringify(tasks));
          tasksRender(JSON.parse(localStorage.getItem('todo')));
          task = '';
          saveBtn.style.display = 'none';
          addButton.style.display = 'block';
          addButton.textContent = '+';
        }
        // Когда нажимвем по кнопке сохранения, перерисовуем наш массив, с отредактировной таской
      }
    });
  }
}
// редактируем задачу
