// Отримуємо елементи DOM
const todoInput = document.getElementById("new-todo");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const addTodoBtn = document.getElementById("add-todo-btn"); 

// Список завдань
let todos = [];

// Функція для збереження завдань у localStorage
function saveTodosToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Функція для завантаження завдань із localStorage
function loadTodosFromLocalStorage() {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
  }
}

// Функція для відображення списку завдань
function displayTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    todoItem.setAttribute('draggable', true);

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

  enableDragAndDrop();
  updateItemsLeft();
}

// Функція для додавання нового завдання через Enter або кнопку
function addTodo(event) {
  if (event.key === "Enter" && todoInput.value.trim() !== "") {
    todos.push({ text: todoInput.value, completed: false });
    todoInput.value = "";
    displayTodos();
    saveTodosToLocalStorage();
  }
}

// Функція для додавання завдання за допомогою кнопки
function addTodoFromButton() {
  if (todoInput.value.trim() !== "") {
    todos.push({ text: todoInput.value, completed: false });
    todoInput.value = ""; 
    displayTodos();
    saveTodosToLocalStorage(); 
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
    saveTodosToLocalStorage();
  }
}

// Функція для видалення завдання
function deleteTodo(event) {
  if (event.target.closest(".delete-btn")) {
    const index = event.target.closest(".delete-btn").dataset.index;
    todos.splice(index, 1);
    displayTodos();
    saveTodosToLocalStorage();
  }
}

// Функція для очищення завершених завдань
function clearCompletedTodos() {
  todos = todos.filter((todo) => !todo.completed);
  displayTodos();
  saveTodosToLocalStorage();
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

// Функція для drag-and-drop
function enableDragAndDrop() {
  const todoItems = document.querySelectorAll('.todo-item');

  let draggingItemIndex = null;

  todoItems.forEach((item, index) => {
    item.addEventListener('dragstart', (event) => {
      draggingItemIndex = index;
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      draggingItemIndex = null;
    });

    item.addEventListener('dragover', (event) => {
      event.preventDefault();
      const draggingItem = document.querySelector('.dragging');
      const bounding = item.getBoundingClientRect();
      const offset = event.clientY - bounding.top;

      if (offset > bounding.height / 2) {
        item.insertAdjacentElement('afterend', draggingItem);
      } else {
        item.insertAdjacentElement('beforebegin', draggingItem);
      }
    });

    item.addEventListener('drop', (event) => {
      const droppedOnIndex = index;
      const draggedItem = todos[draggingItemIndex];
      todos.splice(draggingItemIndex, 1);
      todos.splice(droppedOnIndex, 0, draggedItem);

      displayTodos();
      saveTodosToLocalStorage();
    });
  });
}

// Обробники подій
todoInput.addEventListener("keydown", addTodo); 
addTodoBtn.addEventListener("click", addTodoFromButton); 
todoList.addEventListener("click", toggleTodoCompletion);
todoList.addEventListener("click", deleteTodo);
clearCompletedBtn.addEventListener("click", clearCompletedTodos);
filterBtns.forEach((btn) => btn.addEventListener("click", filterTodos));
themeToggleBtn.addEventListener("click", toggleTheme);

// Завантажуємо завдання з localStorage
loadTodosFromLocalStorage();
displayTodos();
