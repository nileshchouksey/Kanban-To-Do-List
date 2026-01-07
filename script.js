// State management
let tasks = [];
let currentFilter = 'all';

// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// Load tasks from backend on page load
async function loadTasks() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/api/tasks', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load tasks');
    tasks = await res.json();
    renderTasks();
  } catch (err) {
    console.error(err);
    alert('Error loading tasks');
  }
}

// Add new task (backend)
async function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') {
    taskInput.focus();
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to add tasks');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text: taskText, priority: 'medium', status: 'todo' })
    });

    if (!res.ok) throw new Error('Failed to create task');
    const newTask = await res.json();

    tasks.unshift(newTask);
    taskInput.value = '';
    taskInput.focus();
    renderTasks();
  } catch (err) {
    console.error(err);
    alert('Error creating task');
  }
}

// Delete task (backend)
async function deleteTask(id) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete task');
    tasks = tasks.filter(task => task._id !== id);
    renderTasks();
  } catch (err) {
    console.error(err);
    alert('Error deleting task');
  }
}

// Toggle task completion (backend)
async function toggleTask(id) {
  const token = localStorage.getItem('token');
  const task = tasks.find(t => t._id === id);
  if (!task) return;

  try {
    const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completed: !task.completed })
    });
    if (!res.ok) throw new Error('Failed to update task');
    const updatedTask = await res.json();

    tasks = tasks.map(t => (t._id === id ? updatedTask : t));
    renderTasks();
  } catch (err) {
    console.error(err);
    alert('Error updating task');
  }
}

// Clear all completed tasks (backend)
async function clearCompleted() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:3000/api/tasks', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to clear completed tasks');
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
  } catch (err) {
    console.error(err);
    alert('Error clearing completed tasks');
  }
}

// Filter tasks
function filterTasks(filter) {
  currentFilter = filter;
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTasks();
}

// Render tasks
function renderTasks() {
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty-state';
    emptyState.textContent =
      currentFilter === 'all'
        ? 'No tasks yet. Add one above!'
        : currentFilter === 'active'
        ? 'No active tasks!'
        : 'No completed tasks!';
    taskList.appendChild(emptyState);
  } else {
    filteredTasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

      taskItem.innerHTML = `
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? 'checked' : ''}
          onchange="toggleTask('${task._id}')"
        >
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
      `;

      taskList.appendChild(taskItem);
    });
  }

  const activeTasks = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} remaining`;

  const hasCompleted = tasks.some(task => task.completed);
  clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});
clearCompletedBtn.addEventListener('click', clearCompleted);
filterBtns.forEach(btn => btn.addEventListener('click', () => filterTasks(btn.dataset.filter)));

// Initialize app
loadTasks();