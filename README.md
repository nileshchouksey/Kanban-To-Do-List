# Kanban To-Do List Application

A full-stack to-do list application with user authentication, built with Node.js/Express backend and React frontend.

## Features

### Authentication
- ✅ User registration with email and password
- ✅ User login with JWT authentication
- ✅ Secure password hashing with bcrypt
- ✅ Protected routes and API endpoints
- ✅ Session management with JWT tokens

### To-Do List Features
- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Delete individual tasks
- ✅ Filter tasks (All, Active, Completed)
- ✅ Clear all completed tasks
- ✅ Task counter
- ✅ User-specific task management
- ✅ Responsive design (works on mobile and desktop)
- ✅ Modern UI with smooth animations

## Project Structure

```
Kanban-To-Do-List/
├── server/
│   ├── data/           # JSON data files (auto-created)
│   │   ├── users.json  # User data
│   │   └── tasks.json  # Task data
│   ├── server.js       # Express server
│   ├── package.json    # Server dependencies
│   └── .env.example    # Environment variables template
├── client/
│   ├── src/
│   │   ├── pages/      # React page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── TodoList.jsx
│   │   ├── contexts/   # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── utils/      # Utility functions
│   │   │   └── api.js
│   │   ├── App.jsx     # Main app component
│   │   ├── main.jsx    # Entry point
│   │   └── index.css   # Global styles
│   ├── index.html      # HTML template
│   ├── package.json    # Client dependencies
│   └── vite.config.js  # Vite configuration
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation & Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd Kanban-To-Do-List
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   
   Or install separately:
   ```bash
   npm install                    # Root dependencies (concurrently)
   cd server && npm install      # Server dependencies
   cd ../client && npm install   # Client dependencies (React, Vite)
   ```

3. **Set up environment variables (optional):**
   ```bash
   cd server
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and set your JWT_SECRET (optional, defaults provided)
   ```

4. **Run both client and server in development mode:**
   ```bash
   npm run dev
   ```
   
   This will start:
   - **Server** on `http://localhost:3000` (with auto-reload via nodemon)
   - **Client** on `http://localhost:8080` (React app with Vite)
   
   Open your browser and navigate to `http://localhost:8080`

5. **Alternative: Run individually:**
   ```bash
   # Server only
   npm run server:dev
   # or
   cd server && npm run dev
   
   # Client only (requires server to be running)
   npm run client:dev
   # or
   cd client && npm run dev
   ```

## Usage

1. **Register a new account:**
   - Click "Register here" on the login page
   - Enter username, email, and password (min 6 characters)
   - You'll be automatically logged in after registration

2. **Login:**
   - Enter your email and password
   - Click "Login"

3. **Manage your tasks:**
   - Add tasks by typing and pressing Enter or clicking "Add Task"
   - Mark tasks as complete/incomplete with checkboxes
   - Delete individual tasks
   - Filter tasks by status (All, Active, Completed)
   - Clear all completed tasks at once
   - Logout using the logout button

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/me` - Get current user info (requires auth)

### Tasks (all require authentication)
- `GET /api/tasks` - Get all tasks for current user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `DELETE /api/tasks` - Delete all completed tasks

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations
- **Fetch API** - HTTP requests

## Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens for secure authentication
- Protected API routes require valid tokens
- Input validation and sanitization
- CORS enabled for cross-origin requests

## Data Storage

Currently uses JSON files for data storage:
- `server/data/users.json` - User accounts
- `server/data/tasks.json` - All tasks

**Note:** For production use, consider migrating to a proper database (MongoDB, PostgreSQL, etc.)

## Development

### Running in Development Mode

```bash
cd server
npm run dev
```

This uses `nodemon` to automatically restart the server on file changes.

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Future Enhancements

- [ ] Kanban board view (as suggested by the project name)
- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] Task editing
- [ ] Drag and drop reordering
- [ ] Export/import functionality
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Task sharing between users
- [ ] Real-time updates with WebSockets

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!
