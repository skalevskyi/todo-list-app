// Отримуємо елементи DOM
const todoInput = document.getElementById("new-todo");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter-btn");
const themeToggleBtn = document.getElementById("theme-toggle");

// Список завдань
let todos = [];

// Функція для відображення списку завдань
function displayTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo.completed) {
      todoItem.classList.add("completed");
    }

    todoItem.innerHTML = `
      <span class="todo-text">${todo.text}</span>
      <button class="delete-btn" data-index="${index}">
        <img src="./images/icon-cross.svg" alt="Delete">
      </button>
    `;

    todoList.appendChild(todoItem);
  });

  updateItemsLeft();
}

// Функція для додавання нового завдання
function addTodo(event) {
  if (event.key === "Enter" && todoInput.value.trim() !== "") {
    todos.push({ text: todoInput.value, completed: false });
    todoInput.value = "";
    displayTodos();
  }
}

// Функція для оновлення кількості активних завдань
function updateItemsLeft() {
  const activeTodos = todos.filter((todo) => !todo.completed);
  itemsLeft.textContent = `${activeTodos.length} items left`;
}

// Функція для відмітки завдання як виконаного
function toggleTodoCompletion(event) {
  if (event.target.classList.contains("todo-text")) {
    const index = Array.from(todoList.children).indexOf(
      event.target.parentElement
    );
    todos[index].completed = !todos[index].completed;
    displayTodos();
  }
}

// Функція для видалення завдання
function deleteTodo(event) {
  if (event.target.closest(".delete-btn")) {
    const index = event.target.closest(".delete-btn").dataset.index;
    todos.splice(index, 1);
    displayTodos();
  }
}

// Функція для очищення завершених завдань
function clearCompletedTodos() {
  todos = todos.filter((todo) => !todo.completed);
  displayTodos();
}

// Функція для фільтрації завдань (All, Active, Completed)
function filterTodos(event) {
  const filter = event.target.textContent.toLowerCase();

  filterBtns.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  const todoItems = todoList.querySelectorAll(".todo-item");
  todoItems.forEach((item, index) => {
    const isCompleted = todos[index].completed;
    switch (filter) {
      case "all":
        item.style.display = "flex";
        break;
      case "active":
        item.style.display = isCompleted ? "none" : "flex";
        break;
      case "completed":
        item.style.display = isCompleted ? "flex" : "none";
        break;
    }
  });
}

// Функція для перемикання теми (денна/нічна)
function toggleTheme() {
  document.body.classList.toggle("light-theme");
  const themeIcon = themeToggleBtn.querySelector("img");
  if (document.body.classList.contains("light-theme")) {
    themeIcon.src = "./images/icon-moon.svg";
  } else {
    themeIcon.src = "./images/icon-sun.svg";
  }
}

// Обробники подій
todoInput.addEventListener("keydown", addTodo);
todoList.addEventListener("click", toggleTodoCompletion);
todoList.addEventListener("click", deleteTodo);
clearCompletedBtn.addEventListener("click", clearCompletedTodos);
filterBtns.forEach((btn) => btn.addEventListener("click", filterTodos));
themeToggleBtn.addEventListener("click", toggleTheme);

// Початковий виклик для відображення завдань
displayTodos();
