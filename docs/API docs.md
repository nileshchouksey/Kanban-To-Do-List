
📘 TaskWave API Documentation
Base URL
- Development: http://localhost:3000/api
- Production: https://<your-deployment-domain>/api

Authentication
🔑 Login
- POST /auth/login
- Description: Authenticate user and issue JWT.
- Request Body:
{
  "email": "user@example.com",
  "password": "secret"
}
- Response:
{
  "token": "jwt-token-string",
  "user": { "id": "123", "email": "user@example.com" }
}


🔒 Logout
- POST /auth/logout
- Description: Invalidate client session (frontend clears token).
- Response: 204 No Content

Tasks
📥 Get All Tasks
- GET /tasks
- Auth: Required (JWT)
- Response:
[
  {
    "id": "1",
    "text": "Write a story",
    "status": "in-progress",
    "priority": "medium",
    "completed": false,
    "userId": "123",
    "createdAt": "2026-01-05T18:30:00.000Z"
  }
]



➕ Create Task
- POST /tasks
- Auth: Required
- Request Body:
{
  "text": "Reading a novel",
  "priority": "low",
  "status": "todo"
}
- Response:
{
  "id": "2",
  "text": "Reading a novel",
  "status": "todo",
  "priority": "low",
  "completed": false,
  "userId": "123",
  "createdAt": "2026-01-05T18:35:00.000Z"
}



✏️ Update Task
- PUT /tasks/:id
- Auth: Required
- Request Body (examples):
- Update text/priority:
{ "text": "Updated task", "priority": "high" }
- Change status:
{ "status": "in-progress" }
- Toggle completed:
{ "completed": true }
- Response: Updated task object.

🗑️ Delete Task
- DELETE /tasks/:id
- Auth: Required
- Response: 204 No Content

🧹 Clear Completed
- DELETE /tasks/clear-completed
- Auth: Required
- Response:
{ "deletedCount": 3 }



Status Transitions
- Todo → In Progress: PUT /tasks/:id { "status": "in-progress" }
- In Progress → Todo/Done: PUT /tasks/:id { "status": "todo" } or { "status": "done" }
- Done → In Progress: PUT /tasks/:id { "status": "in-progress" }

Error Responses
- 400 Bad Request: Invalid payload (e.g., wrong enum value).
- 401 Unauthorized: Missing or invalid JWT.
- 404 Not Found: Task ID not found.
- 500 Internal Server Error: Unexpected server issue.

Notes for Developers
- Enums: Status must be one of ['todo', 'in-progress', 'done']. Priority must be ['low', 'medium', 'high'].
- Normalization: Frontend should normalize _id → id.
- Ownership: All task operations are scoped to the authenticated user.

