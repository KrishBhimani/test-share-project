(() => {
  "use strict";

  const STORAGE_KEY = "todos";

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const filters = document.getElementById("filters");
  const footer = document.getElementById("footer");
  const count = document.getElementById("count");
  const clearCompleted = document.getElementById("clear-completed");

  let todos = load();
  let filter = "all";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function addTodo(text) {
    todos.push({ id: Date.now(), text, completed: false });
    save();
    render();
  }

  function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      save();
      render();
    }
  }

  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    save();
    render();
  }

  function visibleTodos() {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }

  function render() {
    list.innerHTML = "";

    const visible = visibleTodos();

    if (visible.length === 0) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = todos.length === 0 ? "No todos yet" : "Nothing here";
      list.appendChild(li);
    }

    for (const todo of visible) {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => toggleTodo(todo.id));

      const span = document.createElement("span");
      span.className = "text";
      span.textContent = todo.text;

      const del = document.createElement("button");
      del.className = "delete-btn";
      del.textContent = "×";
      del.setAttribute("aria-label", "Delete todo");
      del.addEventListener("click", () => deleteTodo(todo.id));

      li.append(checkbox, span, del);
      list.appendChild(li);
    }

    const remaining = todos.filter((t) => !t.completed).length;
    count.textContent = `${remaining} item${remaining === 1 ? "" : "s"} left`;
    footer.hidden = todos.length === 0;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTodo(text);
    input.value = "";
    input.focus();
  });

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    filter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach((f) => f.classList.remove("active"));
    btn.classList.add("active");
    render();
  });

  clearCompleted.addEventListener("click", () => {
    todos = todos.filter((t) => !t.completed);
    save();
    render();
  });

  render();
})();
