
📘 Kanban To‑Do List Application
A full‑stack Kanban‑style to‑do list application with user authentication, built with a Node.js/Express backend and React frontend. It features JWT authentication, task CRUD operations, filtering, sorting.

✨ Features
🔑 Authentication
- ✅ User registration with email and password
- ✅ User login with JWT authentication
- ✅ Secure password hashing with bcrypt
- ✅ Protected routes and API endpoints
- ✅ Session management with JWT tokens
📝 To‑Do List Features
- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Delete individual tasks
- ✅ Filter tasks (All, Active, Completed)
- ✅ Clear all completed tasks
- ✅ Task counter
- ✅ User‑specific task management
- ✅ Responsive design (mobile + desktop)
- ✅ Modern UI with smooth animations

📂 Project Structure
Kanban-To-Do-List/
├── server/                     # Express backend
|--data/                        #json data files
│   ├── db/                     # DB connection, env setup
|   |--db_scripts               # db seeding
│   ├── models/                 # Mongoose schemas
│   ├── utils/                  # Helper functions
│   ├── server.js               # Entry point
│   ├── package.json            # Server dependencies
│   └── .env.example            # Environment variables template
├── client/                     # React frontend
│                   
│   ├── src/
│   │   ├── assets/             # Images, icons
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page-level views (Home,Login, Register, TodoList)
│   │   ├── contexts/           # React contexts (AuthContext)
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # API utilities (api.js)

│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   │   ├── auth.js/            # Helper functions
│   ├── index.html              # HTML template
│   ├── package.json            # Client dependencies
│   └── vite.config.js          # Vite configuration
├── docs/                       # Documentation
│   ├── openapi.yaml            # Swagger/OpenAPI spec
│   ├── SRS.md                  # Software Requirements Spec
│   ├── TDD.md                  # Technical Design Document
│   └── APIdocs.md              # Api documentaion
├── script.js                   # Utility scripts
├── .env                        # Environment variables
├── .gitignore                  # Ignore rules
└── README.md                   # Project overview



⚙️ Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- MongoDB Atlas or local MongoDB instance (if migrating from JSON storage)

🚀 Installation & Setup
- Clone the repo:
git clone https://github.com/your-username/Kanban-To-Do-List.git
cd Kanban-To-Do-List
- Install dependencies:
npm run install:all
- Or install separately:
cd server && npm install
cd ../client && npm install
- Set up environment variables:
Server (server/.env)
Create a  .env file in the server  folder:

cd server
cp .env.example .env
- Edit .env and set:
PORT=3000
JWT_SECRET=your-super-secret-key
MONGO_URI=your-mongodb-uri
- Run in development mode:
npm run dev
- Server → http://localhost:3000
 Client (`client/.env`)
Create a `.env` file in the `client/` folder:

```env
VITE_API_URL=Base url of the backend API
cd client
cp .env.example .env
edit .env and set 
VITE_API-URL=Base url of backend API

- Client → http://localhost:8080
- Run individually:
npm run server:dev   # Backend only
npm run client:dev   # Frontend only

🖥️ Usage
- Register → create account with email + password
- Login → authenticate with JWT
- Manage tasks → add, edit, delete, mark complete/incomplete
- Filter → All, Active, Completed
- Clear completed → bulk delete finished tasks
- Logout → end session

📘 API Documentation

Source: docs/openapi.yaml

🔗 API Endpoints
Authentication
- POST /api/register → Register new user
- POST /api/login → Login user
- GET /api/me → Get current user info (auth required)
Tasks (auth required)
- GET /api/tasks → Get all tasks
- POST /api/tasks → Create new task
- PUT /api/tasks/:id → Update task
- DELETE /api/tasks/:id → Delete task
- DELETE /api/tasks/clear-completed → Delete all completed tasks

🛠 Technology Stack
Backend: Node.js, Express, bcryptjs, jsonwebtoken, cors, dotenv, MongoDB/Mongoose
Frontend: React 18, React Router, Vite, CSS3, Fetch API

🔒 Security Features
- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- Input validation & sanitization
- CORS enabled

📂 Data Storage
- Current: JSON files (server/data/users.json, server/data/tasks.json)
- Migrate to MongoDB Atlas  for production

🧪 Development
- Nodemon for auto‑reload
- Jest + Supertest for backend tests
- React Testing Library for frontend tests

🚧 Future Enhancements
- [ ] Full Kanban board view with drag‑and‑drop
- [ ] Due dates & reminders
- [ ] Export/import functionality
- [ ] Task sharing between users
- [ ] Real‑time updates with WebSockets

📜 License
ISC

