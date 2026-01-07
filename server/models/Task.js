const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },   
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true }, // link task to a user
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);