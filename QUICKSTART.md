# Quick Start Guide

## Run Both Client and Server

To run both the client and server simultaneously in development mode:

```bash
npm run dev
```

This command will:
- Start the **Express server** on `http://localhost:3000` (with auto-reload)
- Start the **Client dev server** on `http://localhost:8080` (with hot reload)

Open your browser and go to: **http://localhost:8080**

## Individual Commands

### Run Server Only
```bash
npm run server:dev
# or
cd server && npm run dev
```
Server runs on `http://localhost:3000` and also serves the client files.

### Run Client Only
```bash
npm run client:dev
```
Client runs on `http://localhost:8080` (requires server to be running separately for API calls).

## First Time Setup

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. (Optional) Create `.env` file in `server/` directory:
   ```env
   PORT=3000
   JWT_SECRET=your-secret-key-here
   ```

4. Run the application:
   ```bash
   npm run dev
   ```

## Ports

- **Server API**: `http://localhost:3000`
- **Client Dev Server**: `http://localhost:8080`
- **Server (serves client)**: `http://localhost:3000` (when running server only)

The client automatically detects which port it's running on and connects to the correct API endpoint.

