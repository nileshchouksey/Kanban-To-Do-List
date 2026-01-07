Software requirements specification for TaskWave Kanban app

Overview
TaskWave is a web-based Kanban task manager with three workflow states—To Do, In Progress, Done—supporting CRUD operations, status transitions, priorities, filtering, sorting, and authentication. The system is built with a React frontend, Node/Express backend, and MongoDB Atlas via Mongoose. It targets individual users managing personal tasks, with clean UX and reviewer-friendly code.

Scope and objectives
• 	Purpose: Provide a simple, reliable Kanban board for personal task management with clear status transitions and priority handling.
• 	In-scope: Authentication, task CRUD, status changes, priority management, filtering/sorting, completed toggle, clear completed, responsive UI, secure API.
• 	Out-of-scope: Team collaboration, real-time sync, notifications, attachments, comments, role-based permissions.

Stakeholders and users
	Primary user: Authenticated individual managing personal tasks.
• 	Admin (future): Operational oversight, data maintenance.
• 	Developer/Reviewer: Maintains code quality, tests, deployments.

System context and architecture
• 	Frontend: React (SPA), state management via hooks, modular components, REST API integration.
• 	Backend: Node.js + Express, RESTful endpoints, JWT-based authentication.
• 	Database: MongoDB Atlas, Mongoose models and validation.
• 	Security: HTTPS (production), JWT auth, input validation, CORS.
• 	Deployment: Local dev, cloud-hosted backend and DB (e.g., Render/Heroku + Atlas).

Functional requirements
Authentication
Login/Logout: Email/username + password; JWT issued on login; logout clears token.
• 	Protected routes: All task endpoints require valid JWT.
• 	Session handling: Token stored securely (e.g., httpOnly cookie or secure storage).
Task management
• 	Create task: Text, priority (low/medium/high), default status to do,in-progress,done .
• 	Read tasks: Fetch all tasks for the authenticated user; support filters and sorting client-side.
• 	Update task: Edit text, priority; toggle completed; change status among to do,in-progress , done .
• 	Delete task: Remove a task by ID.
• 	Clear completed: Bulk delete or mark completed tasks as archived (current: delete).
• 	Status transitions:
• 	From to do →in-progress 
• 	From  in-progress→to do  or done 
• 	From done →in-progress  (reopen)
• 	Filtering: All, Active (not completed), Completed (completed=true).
• 	Sorting: By priority (low→high or high→low), optionally by createdAt.
UI/UX
• 	Kanban columns: To Do, In Progress, Done with counts.
• 	Task card: Title, priority badge, edit/delete, checkbox (completed), move controls.
• 	Controls: Add task input, priority select, filter buttons, sort dropdown, clear completed.
• 	Feedback: Loading states, error alerts, optimistic updates where safe.

Non-functional requirements
• 	Performance: <300ms average API response under normal load; smooth UI updates.
• 	Reliability: No data loss on status changes; consistent state across UI and DB.
• 	Security: JWT auth, input validation, sanitized payloads, least privilege DB access.
• 	Maintainability: Modular components, clear naming, consistent enums, normalized data.
• 	Scalability: Handle thousands of tasks per user; efficient queries and indexes.
• 	Usability: Accessible controls, keyboard support for adding tasks, clear labels.
• 	Compatibility: Modern browsers; responsive layout; Windows 11 dev environment.
Data model
User schema (Mongoose)
Fields:
   text:string,required
   username: { type: String, required: true },
   email: { type: String, required: true },
   password: { type: String, required: true },
   createdAt: Date, default 

Task schema (Mongoose)
• 	Fields:
• 	text: String, required
• 	status: String, enum , default 
• 	priority: String, enum , default 
• 	completed: Boolean, default 
• 	userId: String, required
• 	createdAt: Date, default 
• 	Indexes:
• 	userId (single-field)
• 	Optional compound index: userId + status for faster filtering

API endpoints
|Method  | EndPoint          | Auth |  Description                   |Request Body                          |Response        | 
|  POST  | /api/auth/login   | NO   |  Login and receive JWT         | { email, password }                  | { token, user }| 
|  POST  | /api/auth/logout  | YES  |Logout(invalidate client token) |  -                                   | 204 No Content | 
|  GET   | /api/tasks        | YES  | Get tasks for current user     |                                      | [Task]         | 
|  POST  | /api/tasks        | YES  | Create a new task              |{text, priority, status? }            | Task           | 
|  PUT   | /api/tasks/:id    | YES  | Update task fields             |{text?, priority?, status?,completed?}| Task           | 
|  DELETE| /api/tasks/:id    | YES  | Delete a task                  | -                                    | 204 No Content | 
|  DELETE| /api/tasks/       | YES  | Delete all completed tasks     | -                                    | { deletedCount}|
           clear-completed

- Auth: Bearer JWT in Authorization header or httpOnly cookie.
- Validation: Enforce enums and required fields; reject invalid status strings.

UI workflows
- Add task: Enter text → select priority → Add → task appears in To Do.
- Move task: Click move button in card → status updates → card re-renders in target column.
- Complete task: Checkbox toggles completed; Done column also shows completed tasks.
- Edit task: Click Edit → inline form → Save → card updates.
- Delete task: Click Delete → card removed.
- Filter/sort: Toggle filter buttons and priority sort; list updates client-side.
- Clear completed: Click button → bulk delete → counts update.

Constraints and assumptions
- Status values: Must match backend enum exactly ('in-progress' with hyphen).
- Normalization: Frontend normalizes _id to id and preserves status casing.
- Ownership: All task operations scoped to authenticated user.
- Error handling: Graceful UI alerts; avoid silent failures.

Risks and mitigations
- Enum mismatch: Align frontend/backend strings; add tests for status transitions.
- Auth leakage: Use secure token storage; avoid exposing JWT in logs.
- Data inconsistency: Normalize responses; prefer server truth over optimistic updates.
- Bulk operations: Clear completed must be scoped to user; confirm action in UI.

