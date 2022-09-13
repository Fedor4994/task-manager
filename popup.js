let addMessage = document.querySelector(".message"),
  addButton = document.querySelector(".add"),
  toDo = document.querySelector(".todo");

let toDoList = [];

if (localStorage.getItem("todo")) {
  toDoList = JSON.parse(localStorage.getItem("todo"));
  displayMessages();
}

addButton.addEventListener("click", onAddButtonClick);

function onAddButtonClick() {
  let newToDo = {
    todo: addMessage.value,
    checked: false,
    important: false,
  };

  toDoList.push(newToDo);
  displayMessages();

  localStorage.setItem("todo", JSON.stringify(toDoList));
  addMessage.value = "";
}

function displayMessages() {
  let displayMessage = "";
  toDoList.forEach((item, i) => {
    displayMessage += `
        <li>
          <input type="checkbox" id="item_${i}" ${
      item.checked ? "checked" : ""
    } />
          <label for="item_${i}">${item.todo}</label>
        </li>
        `;
    toDo.innerHTML = displayMessage;
  });
}

toDo.addEventListener("change", onListChange);

function onListChange(event) {
  let idInput = event.target.getAttribute("id");
  let forLable = toDo.querySelector("[for = " + idInput + "]");
  let valueLable = forLable.textContent;
  toDoList.forEach((item) => {
    if (item.todo === valueLable) {
      item.checked = !item.checked;
      localStorage.setItem("todo", JSON.stringify(toDoList));
    }
  });
}
