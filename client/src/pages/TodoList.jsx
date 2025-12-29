import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiRequest } from '../utils/api'
import '../index.css'

function TodoList() {
  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState('')
  const [currentFilter, setCurrentFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const { user, logout } = useAuth()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const response = await apiRequest('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Load tasks error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    const taskText = taskInput.trim()
    
    if (taskText === '') {
      return
    }

    try {
      const response = await apiRequest('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ text: taskText })
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks(prev => [newTask, ...prev])
        setTaskInput('')
      }
    } catch (error) {
      console.error('Add task error:', error)
      alert('Failed to add task. Please try again.')
    }
  }

  const deleteTask = async (id) => {
    try {
      const response = await apiRequest(`/api/tasks/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== id.toString()))
      }
    } catch (error) {
      console.error('Delete task error:', error)
      alert('Failed to delete task. Please try again.')
    }
  }

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id.toString())
    if (!task) return

    const newCompletedState = !task.completed

    try {
      const response = await apiRequest(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: newCompletedState })
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(prev => prev.map(t => t.id === id.toString() ? updatedTask : t))
      }
    } catch (error) {
      console.error('Toggle task error:', error)
      alert('Failed to update task. Please try again.')
    }
  }

  const startEdit = (id, text) => {
    setEditingId(id.toString())
    setEditingText(text)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const saveEdit = async (id) => {
    const text = editingText.trim()
    if (text === '') {
      alert('Task text cannot be empty')
      return
    }

    try {
      const response = await apiRequest(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ text })
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(prev => prev.map(t => t.id === id.toString() ? updatedTask : t))
        cancelEdit()
      }
    } catch (error) {
      console.error('Edit task error:', error)
      alert('Failed to update task. Please try again.')
    }
  }

  const clearCompleted = async () => {
    try {
      const response = await apiRequest('/api/tasks', {
        method: 'DELETE'
      })

      if (response.ok) {
        setTasks(prev => prev.filter(task => !task.completed))
      }
    } catch (error) {
      console.error('Clear completed error:', error)
      alert('Failed to clear completed tasks. Please try again.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed
    if (currentFilter === 'completed') return task.completed
    return true
  })

  const activeTasks = tasks.filter(task => !task.completed).length
  const hasCompleted = tasks.some(task => task.completed)

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="todo-app">
        <div className="header-section">
          <h1>📝 My To-Do List</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
        
        <div className="input-section">
          <input
            type="text"
            id="taskInput"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            autoComplete="off"
          />
          <button onClick={addTask} className="add-btn">Add Task</button>
        </div>

        <div className="filter-section">
          <button
            className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="stats-section">
          <span id="taskCount">
            {activeTasks} {activeTasks === 1 ? 'task' : 'tasks'} remaining
          </span>
          {hasCompleted && (
            <button onClick={clearCompleted} className="clear-btn">
              Clear Completed
            </button>
          )}
        </div>

        <ul className="task-list">
          {filteredTasks.length === 0 ? (
            <li className="empty-state">
              {currentFilter === 'all'
                ? 'No tasks yet. Add one above!'
                : currentFilter === 'active'
                ? 'No active tasks!'
                : 'No completed tasks!'}
            </li>
          ) : (
            filteredTasks.map(task => (
              <li
                key={task.id}
                className={`task-item ${task.completed ? 'completed' : ''}`}
              >
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                {editingId === task.id.toString() ? (
                  <>
                    <input
                      className="task-edit-input"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(task.id)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      autoFocus
                    />
                    <button className="save-btn" onClick={() => saveEdit(task.id)}>Save</button>
                    <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span
                      className="task-text"
                      title="Double-click to edit"
                    >
                      {task.text}
                    </span>
                    <button className="edit-btn" onClick={() => startEdit(task.id, task.text)}>Edit</button>
                  </>
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default TodoList

