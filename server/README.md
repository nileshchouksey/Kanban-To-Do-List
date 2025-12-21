# Server Setup

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Create `.env` file:
   ```bash
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## Data Files

The server will automatically create:
- `data/users.json` - User accounts
- `data/tasks.json` - All tasks

These files are created automatically on first run.

