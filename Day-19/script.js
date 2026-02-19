
// In-memory task store
let tasks = [];
let idCounter = 0;

// DOM references
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalCountEl = document.getElementById("totalCount");
const completedCountEl = document.getElementById("completedCount");
const pendingCountEl = document.getElementById("pendingCount");

// Helper: create a task object
function createTask(text) {
  return {
    id: ++idCounter,
    text: text.trim(),
    completed: false,
    createdAt: new Date()
  };
}

// Render all tasks to the DOM
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <li style="text-align:center; padding:12px; font-size:0.9rem; color:#9ca3af;">
        No tasks yet. Add your first one!
      </li>
    `;
    updateStats();
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");
    li.dataset.id = task.id;

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const meta = document.createElement("span");
    meta.className = "task-meta";
    meta.textContent = formatTime(task.createdAt);

    left.appendChild(checkbox);
    left.appendChild(text);

    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.flexDirection = "column";
    right.style.alignItems = "flex-end";
    right.style.gap = "4px";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "✕";

    right.appendChild(meta);
    right.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(right);
    taskList.appendChild(li);
  });

  updateStats();
}

// Update stats (total, completed, pending)
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  totalCountEl.textContent = total;
  completedCountEl.textContent = completed;
  pendingCountEl.textContent = pending;
}

// Format time for small timestamp
function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Add task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = taskInput.value.trim();

  if (!value) {
    taskInput.focus();
    return;
  }

  const newTask = createTask(value);
  tasks.unshift(newTask); // newest on top
  taskInput.value = "";
  renderTasks();
});

// Handle click on list (event delegation)
taskList.addEventListener("click", (e) => {
  const listItem = e.target.closest(".task-item");
  if (!listItem) return;

  const id = Number(listItem.dataset.id);

  // Toggle complete if checkbox clicked
  if (e.target.matches(".task-checkbox")) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
    return;
  }

  // Delete if delete button clicked
  if (e.target.matches(".delete-btn")) {
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
  }
});

// Initial render
renderTasks();
