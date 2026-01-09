// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db/connect');
const User = require('./models/User');
const Task = require('./models/Task');
const corsOptions = require('./config/corsConfig');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Connect to MongoDB Atlas
connectDB();

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ---------------- ROUTES ----------------

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'User registered successfully', token, user: { id: newUser._id, username: newUser.username, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
app.get('/api/me', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user._id, username: user.username, email: user.email });
});

// Get tasks
app.get('/api/tasks', authenticateToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Create task
app.post('/api/tasks', authenticateToken, async (req, res) => {
  const { text, priority, status } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Task text is required' });

  const allowedPriorities = ['low', 'medium', 'high'];
  const p = allowedPriorities.includes(priority) ? priority : 'low';

  const newTask = await Task.create({ userId: req.user.id, text: text.trim(), completed: false, priority: p, status: status || 'todo' });
  res.status(201).json(newTask);
});

// Update task
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { text, completed, priority, status } = req.body;

  const allowedPriorities = ['low', 'medium', 'high'];
  const allowedStatuses = ['todo', 'in-progress', 'done'];

  const updatedTask = await Task.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    {
      ...(text !== undefined && { text: text.trim() }),
      ...(completed !== undefined && { completed }),
      ...(priority !== undefined && { priority: allowedPriorities.includes(priority) ? priority : 'low' }),
      ...(status !== undefined && { status: allowedStatuses.includes(status) ? status : 'todo' }),
    },
    { new: true }
  );

  if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
  res.json(updatedTask);
});

// Delete task
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted successfully' });
});

// Delete all completed tasks
app.delete('/api/tasks', authenticateToken, async (req, res) => {
  await Task.deleteMany({ userId: req.user.id, completed: true });
  res.json({ message: 'Completed tasks deleted successfully' });
});

// Serve client app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});