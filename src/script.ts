interface Todo {
  id: number;
  text: string;
  isComplete: boolean;
}

const addMessage = document.querySelector('.todo__message') as HTMLInputElement;
const addButton: HTMLElement = document.querySelector('.todo__add') as HTMLElement;
const tasksList: HTMLElement = document.querySelector('.todo__list') as HTMLElement;
const deleteButton = document.querySelector('.todo__taks-delete');
const deleteAllButton: HTMLElement = document.querySelector('.delete-all-btn') as HTMLElement;
const saveBtn: HTMLElement = document.querySelector('.save__btn') as HTMLElement;

let tasks: Todo[] = [];

// Если мы открываем расширение и хотим там увидеть ранее записаные задачи
// то в этом куске кода я достаю из хранилища массив обьектов(твоих задач)
// и отрисовую их в разметке + записываю сразу в массив, потому что он при каждом открытии будет опусташаться
const localStorageTodos = localStorage.getItem('todo');
if (localStorageTodos) {
  tasksRender(JSON.parse(localStorageTodos));
  tasks = JSON.parse(localStorageTodos).slice(0);
}

// добавляю слушатель на кнопку добавления задачи
addButton?.addEventListener('click', onAddButtonClick);

// Функционал кнопки удаления всех задач
deleteAllButton &&
  deleteAllButton.addEventListener('click', () => {
    localStorage.setItem('todo', '');
    tasks = [];
    tasksList.innerHTML = '';
    // deleteAllButton.style.display = 'none';
  });

//Делегирование событий, для удаления\изменения статуса задач
tasksList.addEventListener('click', event => {
  // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
  // по чекбоксу - тогда выясняем выполнина ли задача(меняем статус отовсюду, и хранилище, и массив, и разметка)
  const target = event.target as HTMLInputElement;
  const task = target.parentElement;
  console.log(target.parentElement);
  const taskId = Number(task?.id);
  const todoFromLocalStorage = localStorage.getItem('todo');

  if (target && target.tagName === 'INPUT') {
    const isComplete = target.checked;
    changeTaskStatus(taskId, isComplete);
    localStorage.setItem('todo', JSON.stringify(tasks));
    todoFromLocalStorage && tasksRender(JSON.parse(todoFromLocalStorage));
  }

  // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
  // по кнопке удаления - тогда удаляем задачу(отовсюду, и хранилище, и массив, и разметка)
  if (target.classList.contains('todo__taks-delete')) {
    const taskId = Number(task?.id);
    deleteTaks(taskId);
    localStorage.setItem('todo', JSON.stringify(tasks));
    todoFromLocalStorage && tasksRender(JSON.parse(todoFromLocalStorage));
  }

  // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
  // по кнопке редактирования - тогда редактируем задачу(отовсюду, и хранилище, и массив, и разметка)
  if (target.classList.contains('todo__task-edit')) {
    editTask(taskId);
  }
});

// Выполняется когда нажимаем по кнопке
function onAddButtonClick() {
  const newTaskText = addMessage.value;
  if (newTaskText) {
    // добавляю новую задачу в массив + в хранилище
    addTask(newTaskText);
    addMessage.value = '';
    // рендерю раметку по данным из хранилища
    tasksRender(JSON.parse(localStorage.getItem('todo') || ''));
  }
}

// Функция добавления задач
function addTask(text: string) {
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
function tasksRender(list: Todo[]) {
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

// мееняем статус задачи в массиве
function changeTaskStatus(id: number, status: boolean) {
  tasks.forEach(task => {
    if (task.id == id) {
      task.isComplete = status;
    }
  });
}

// удаляем задачу из массива
function deleteTaks(id: number) {
  tasks.forEach((task, index) => {
    console.log(task.id);
    console.log(id);
    if (task.id == id) {
      console.log('delete');
      tasks.splice(index, 1);
    }
  });
}

// редактируем задачу
function editTask(id: number) {
  if (addMessage.value === '') {
    // кнопочке сохранения и добавляения удалять и добавлять дисплей ноне, в зависимисти от ситуации
    addButton.style.display = 'none';
    addButton.textContent = '-';
    saveBtn.style.display = 'block';

    tasks.forEach(task => {
      if (task.id == id) {
        const editMessage = function () {
          task.text = addMessage.value;

          addMessage.value = '';
          localStorage.setItem('todo', JSON.stringify(tasks));
          tasksRender(JSON.parse(localStorage.getItem('todo') || ''));
          task = '';
          saveBtn.style.display = 'none';
          addButton.style.display = 'block';
          addButton.textContent = '+';
        };
        // Если мы находимся в режиме редактирования, то по нажатию Enter у нас происходит то же самое что
        // и при нажатии saveBtn

        window.addEventListener('keydown', event => {
          if (addButton.textContent === '-' && event.code === 'Enter') {
            editMessage();
          }
        });

        // Вкидываем в инпут текст выбранной для редактируемой задачи и фокусируемся на нем
        addMessage.value = task.text;
        addMessage.focus();

        // Когда нажимвем по кнопке сохранения, перерисовуем наш массив, с отредактировной таской
        saveBtn.addEventListener('click', editMessage);
      }
    });
  }
}

// Если у нас есть кнопка добавления(мы находимся не в режиме редактирования), то
// при нажатии Enter происходит добавление заметки
window.addEventListener('keydown', event => {
  if (addButton.textContent === '+' && event.code === 'Enter') {
    onAddButtonClick();
  }
});
