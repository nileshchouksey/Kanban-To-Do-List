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
const logoutBtn = document.getElementById('logoutBtn');
const usernameDisplay = document.getElementById('usernameDisplay');

// Check authentication on page load
async function init() {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Verify token
    const isValid = await verifyAuth();
    if (!isValid) {
        window.location.href = 'login.html';
        return;
    }

    // Display user info
    const user = getUser();
    if (user) {
        usernameDisplay.textContent = `Welcome, ${user.username}!`;
    }

    // Load tasks
    await loadTasks();

    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTasks(btn.dataset.filter);
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Load tasks from API
async function loadTasks() {
    try {
        const response = await apiRequest('/api/tasks');
        if (response.ok) {
            tasks = await response.json();
            renderTasks();
        } else {
            showError('Failed to load tasks');
        }
    } catch (error) {
        console.error('Load tasks error:', error);
        showError('Failed to load tasks. Please refresh the page.');
    }
}

// Add new task
async function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        taskInput.focus();
        return;
    }

    try {
        const response = await apiRequest('/api/tasks', {
            method: 'POST',
            body: JSON.stringify({ text: taskText })
        });

        if (response.ok) {
            const newTask = await response.json();
            tasks.unshift(newTask);
            taskInput.value = '';
            taskInput.focus();
            renderTasks();
        } else {
            const data = await response.json();
            showError(data.error || 'Failed to add task');
        }
    } catch (error) {
        console.error('Add task error:', error);
        showError('Failed to add task. Please try again.');
    }
}

// Delete task
async function deleteTask(id) {
    try {
        const response = await apiRequest(`/api/tasks/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            tasks = tasks.filter(task => task.id !== id.toString());
            renderTasks();
        } else {
            showError('Failed to delete task');
        }
    } catch (error) {
        console.error('Delete task error:', error);
        showError('Failed to delete task. Please try again.');
    }
}

// Toggle task completion
async function toggleTask(id) {
    const task = tasks.find(t => t.id === id.toString());
    if (!task) return;

    const newCompletedState = !task.completed;

    try {
        const response = await apiRequest(`/api/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ completed: newCompletedState })
        });

        if (response.ok) {
            const updatedTask = await response.json();
            tasks = tasks.map(t => t.id === id.toString() ? updatedTask : t);
            renderTasks();
        } else {
            showError('Failed to update task');
        }
    } catch (error) {
        console.error('Toggle task error:', error);
        showError('Failed to update task. Please try again.');
    }
}

// Clear all completed tasks
async function clearCompleted() {
    try {
        const response = await apiRequest('/api/tasks', {
            method: 'DELETE'
        });

        if (response.ok) {
            tasks = tasks.filter(task => !task.completed);
            renderTasks();
        } else {
            showError('Failed to clear completed tasks');
        }
    } catch (error) {
        console.error('Clear completed error:', error);
        showError('Failed to clear completed tasks. Please try again.');
    }
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active filter button
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTasks();
}

// Render tasks based on current filter
function renderTasks() {
    // Filter tasks
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Clear task list
    taskList.innerHTML = '';

    // Render tasks or empty state
    if (filteredTasks.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.textContent = currentFilter === 'all' 
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
                    onchange="toggleTask('${task.id}')"
                >
                <span class="task-text">${escapeHtml(task.text)}</span>
                <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
            `;
            
            taskList.appendChild(taskItem);
        });
    }

    // Update task count
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} remaining`;
    
    // Show/hide clear completed button
    const hasCompleted = tasks.some(task => task.completed);
    clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    // You can implement a toast notification here
    alert(message);
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

