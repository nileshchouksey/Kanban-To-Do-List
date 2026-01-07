const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectDB = require('../db/connect');
const User = require('../models/User');
const Task = require('../models/Task');

const seedData = async () => {
  try {
    await connectDB();

    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json')));
    const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tasks.json')));

    await User.deleteMany();
    await Task.deleteMany();

    await User.insertMany(users);
    await Task.insertMany(tasks);

    console.log('✅ Users and Tasks seeded successfully to MongoDB Atlas');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();