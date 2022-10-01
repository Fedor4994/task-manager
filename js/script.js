const addMessage = document.querySelector('.todo__message');
const addButton = document.querySelector('.todo__add');
const tasksList = document.querySelector('.todo__list');
const deleteButton = document.querySelector('.todo__taks-delete');
const deleteAllButton = document.querySelector('.delete-all-btn');
const saveBtn = document.querySelector('.save__btn');

// Если у нас есть кнопка добавления(мы находимся не в режиме редактирования), то
// при нажатии Enter происходит добавление заметки
window.addEventListener('keydown', sendAddMessage);
function sendAddMessage(event) {
  if (addButton.textContent === '+' && event.code === 'Enter') {
    onAddButtonClick();
  }
}

let tasks = [];

// Если мы открываем расширение и хотим там увидеть ранее записаные задачи
// то в этом куске кода я достаю из хранилища массив обьектов(твоих задач)
// и отрисовую их в разметке + записываю сразу в массив, потому что он при каждом открытии будет опусташаться
if (localStorage.getItem('todo')) {
  tasksRender(JSON.parse(localStorage.getItem('todo')));
  tasks = JSON.parse(localStorage.getItem('todo')).slice(0);
}

// добавляю слушатель на кнопку добавления задачи
addButton.addEventListener('click', onAddButtonClick);

// Функционал кнопки удаления всех задач
deleteAllButton.addEventListener('click', () => {
  localStorage.setItem('todo', '');
  tasks = [];
  tasksList.innerHTML = '';
  deleteAllButton.style.display = 'none';
});

// Выполняется когда нажимаем по кнопке
function onAddButtonClick() {
  const newTaskText = addMessage.value;
  if (newTaskText) {
    // добавляю новую задачу в массив + в хранилище
    addTask(newTaskText);
    addMessage.value = '';
    // рендерю раметку по данным из хранилища
    tasksRender(JSON.parse(localStorage.getItem('todo')));
  }
}

// Функция добавления задач
function addTask(text) {
  // Создание обьекта одной добавляемой задачи
  const task = {
    id: Date.now(),
    text,
    isComplete: false,
  };

  // Добавление созданной задачи в массив задач и в хранилище
  tasks.push(task);
  localStorage.setItem('todo', JSON.stringify(tasks));
}

// Функция отрисовки задач на странице(из массива обьектов задач)
function tasksRender(list) {
  const html = list
    .map(task => {
      // деструктуризация обьекта task
      const { id, text, isComplete } = task;
      // добавление класса выполненой задачи, если она выполнена
      let cls = isComplete ? 'todo__task todo__task-complete' : 'todo__task';
      // добавление атрибута поставленного чекбокса, если его поставили
      const checked = isComplete ? 'checked' : '';

      return `<li id="${id}" class="${cls}">
          <label class="todo__checkbox">
            <input type="checkbox" ${checked} />
            <div></div>
          </label>
          <input type="text" class="todo__task-text" value="${text}" readonly>
          <img class="todo__task-edit" src="./image/edit_pencil.svg" alt="edit-btn" />
          <img class="todo__taks-delete" src="./image/Vector.svg" alt="delete-btn" />
        </li>`;
    })
    .join('');

  // суть отрисовки страницы, при добавлении каждой задачи, или изменении статуса задачи, они перерисовуются
  tasksList.innerHTML = html;

  // отображает кнопку удаления всего, если есть какая то задача в списке
  if (localStorage.getItem('todo') !== '[]') {
    deleteAllButton.style.display = 'block';
  } else {
    deleteAllButton.style.display = 'none';
  }
}

//Делегирование событий, для удаления\изменения статуса задач
tasksList.addEventListener('click', event => {
  // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
  // по чекбоксу - тогда выясняем выполнина ли задача(меняем статус отовсюду, и хранилище, и массив, и разметка)
  if (event.target.tagName === 'INPUT') {
    const isComplete = event.target.checked;
    const task = event.target.parentElement.parentElement;
    const taskId = task.id;
    changeTaskStatus(taskId, isComplete);
    localStorage.setItem('todo', JSON.stringify(tasks));
    tasksRender(JSON.parse(localStorage.getItem('todo')));
  }

  // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
  // по кнопке удаления - тогда удаляем задачу(отовсюду, и хранилище, и массив, и разметка)
  if (event.target.classList.contains('todo__taks-delete')) {
    const task = event.target.parentElement;
    const taskId = task.id;
    deleteTaks(taskId);
    localStorage.setItem('todo', JSON.stringify(tasks));
    tasksRender(JSON.parse(localStorage.getItem('todo')));
  }

  // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
  // по кнопке редактирования - тогда редактируем задачу(отовсюду, и хранилище, и массив, и разметка)
  if (event.target.classList.contains('todo__task-edit')) {
    const task = event.target.parentElement;
    const taskId = task.id;
    editTask(taskId);
  }
});

// мееняем статус задачи в массиве
function changeTaskStatus(id, status) {
  tasks.forEach(task => {
    if (task.id == id) {
      task.isComplete = status;
    }
  });
}

// удаляем задачу из массива
function deleteTaks(id) {
  tasks.forEach((task, index) => {
    if (task.id == id) {
      tasks.splice(index, 1);
    }
  });
}

// редактируем задачу
function editTask(id) {
  if (addMessage.value === '') {
    // кнопочке сохранения и добавляения удалять и добавлять дисплей ноне, в зависимисти от ситуации
    addButton.style.display = 'none';
    addButton.textContent = '-';
    saveBtn.style.display = 'block';

    tasks.forEach(task => {
      if (task.id == id) {
        // Если мы находимся в режиме редактирования, то по нажатию Enter у нас происходит то же самое что
        // и при нажатии saveBtn
        window.addEventListener('keydown', saveEditMessage);
        function saveEditMessage(event) {
          if (addButton.textContent === '-' && event.code === 'Enter') {
            editMessage();
          }
        }

        // Вкидываем в инпут текст выбранной для редактируемой задачи и фокусируемся на нем
        addMessage.value = task.text;
        addMessage.focus();

        // Когда нажимвем по кнопке сохранения, перерисовуем наш массив, с отредактировной таской
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
      }
    });
  }
}
