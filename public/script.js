"use strict";
var addMessage = document.querySelector('.todo__message');
var addButton = document.querySelector('.todo__add');
var tasksList = document.querySelector('.todo__list');
var deleteButton = document.querySelector('.todo__taks-delete');
var deleteAllButton = document.querySelector('.delete-all-btn');
var saveBtn = document.querySelector('.save__btn');
var tasks = [];
// Если мы открываем расширение и хотим там увидеть ранее записаные задачи
// то в этом куске кода я достаю из хранилища массив обьектов(твоих задач)
// и отрисовую их в разметке + записываю сразу в массив, потому что он при каждом открытии будет опусташаться
var localStorageTodos = localStorage.getItem('todo');
if (localStorageTodos) {
    tasksRender(JSON.parse(localStorageTodos));
    tasks = JSON.parse(localStorageTodos).slice(0);
}
// добавляю слушатель на кнопку добавления задачи
addButton === null || addButton === void 0 ? void 0 : addButton.addEventListener('click', onAddButtonClick);
// Функционал кнопки удаления всех задач
deleteAllButton &&
    deleteAllButton.addEventListener('click', function () {
        localStorage.setItem('todo', '');
        tasks = [];
        tasksList.innerHTML = '';
        // deleteAllButton.style.display = 'none';
    });
//Делегирование событий, для удаления\изменения статуса задач
tasksList.addEventListener('click', function (event) {
    // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
    // по чекбоксу - тогда выясняем выполнина ли задача(меняем статус отовсюду, и хранилище, и массив, и разметка)
    var target = event.target;
    var task = target.parentElement;
    console.log(target.parentElement);
    var taskId = Number(task === null || task === void 0 ? void 0 : task.id);
    var todoFromLocalStorage = localStorage.getItem('todo');
    if (target && target.tagName === 'INPUT') {
        var isComplete = target.checked;
        changeTaskStatus(taskId, isComplete);
        localStorage.setItem('todo', JSON.stringify(tasks));
        todoFromLocalStorage && tasksRender(JSON.parse(todoFromLocalStorage));
    }
    // Реализовываем деелгирование событий. Вешаем слушатель клика на на весь список дел, но только когда клик приходится
    // по кнопке удаления - тогда удаляем задачу(отовсюду, и хранилище, и массив, и разметка)
    if (target.classList.contains('todo__taks-delete')) {
        var taskId_1 = Number(task === null || task === void 0 ? void 0 : task.id);
        deleteTaks(taskId_1);
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
    var newTaskText = addMessage.value;
    if (newTaskText) {
        // добавляю новую задачу в массив + в хранилище
        addTask(newTaskText);
        addMessage.value = '';
        // рендерю раметку по данным из хранилища
        tasksRender(JSON.parse(localStorage.getItem('todo') || ''));
    }
}
// Функция добавления задач
function addTask(text) {
    // Создание обьекта одной добавляемой задачи
    var task = {
        id: Date.now(),
        text: text,
        isComplete: false,
    };
    // Добавление созданной задачи в массив задач и в хранилище
    tasks.push(task);
    localStorage.setItem('todo', JSON.stringify(tasks));
}
// Функция отрисовки задач на странице(из массива обьектов задач)
function tasksRender(list) {
    var html = list
        .map(function (task) {
        // деструктуризация обьекта task
        var id = task.id, text = task.text, isComplete = task.isComplete;
        // добавление класса выполненой задачи, если она выполнена
        var cls = isComplete ? 'todo__task todo__task-complete' : 'todo__task';
        // добавление атрибута поставленного чекбокса, если его поставили
        var checked = isComplete ? 'checked' : '';
        return "<li id=\"".concat(id, "\" class=\"").concat(cls, "\">\n          <label class=\"todo__checkbox\">\n            <input type=\"checkbox\" ").concat(checked, " />\n            <div></div>\n          </label>\n          <input type=\"text\" class=\"todo__task-text\" value=\"").concat(text, "\" readonly>\n          <img class=\"todo__task-edit\" src=\"./image/edit_pencil.svg\" alt=\"edit-btn\" />\n          <img class=\"todo__taks-delete\" src=\"./image/Vector.svg\" alt=\"delete-btn\" />\n        </li>");
    })
        .join('');
    // суть отрисовки страницы, при добавлении каждой задачи, или изменении статуса задачи, они перерисовуются
    tasksList.innerHTML = html;
    // отображает кнопку удаления всего, если есть какая то задача в списке
    if (localStorage.getItem('todo') !== '[]') {
        deleteAllButton.style.display = 'block';
    }
    else {
        deleteAllButton.style.display = 'none';
    }
}
// мееняем статус задачи в массиве
function changeTaskStatus(id, status) {
    tasks.forEach(function (task) {
        if (task.id == id) {
            task.isComplete = status;
        }
    });
}
// удаляем задачу из массива
function deleteTaks(id) {
    tasks.forEach(function (task, index) {
        console.log(task.id);
        console.log(id);
        if (task.id == id) {
            console.log('delete');
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
        tasks.forEach(function (task) {
            if (task.id == id) {
                var editMessage_1 = function () {
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
                window.addEventListener('keydown', function (event) {
                    if (addButton.textContent === '-' && event.code === 'Enter') {
                        editMessage_1();
                    }
                });
                // Вкидываем в инпут текст выбранной для редактируемой задачи и фокусируемся на нем
                addMessage.value = task.text;
                addMessage.focus();
                // Когда нажимвем по кнопке сохранения, перерисовуем наш массив, с отредактировной таской
                saveBtn.addEventListener('click', editMessage_1);
            }
        });
    }
}
// Если у нас есть кнопка добавления(мы находимся не в режиме редактирования), то
// при нажатии Enter происходит добавление заметки
window.addEventListener('keydown', function (event) {
    if (addButton.textContent === '+' && event.code === 'Enter') {
        onAddButtonClick();
    }
});
