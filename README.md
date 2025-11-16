# MERN Socket Chat (local development)

This repository is a small MERN (MongoDB, Express, React, Node) chat project using Socket.IO for real-time messaging.

This README shows how to set up and run the project locally on Windows (PowerShell examples).

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or hosted)

## Repository layout

```
.
├── backend/          # Express + Socket.IO server
├── frontend/         # React + Vite client
├── .gitignore
└── README.md
```

## Environment files

- `backend/.env.example` is provided. Copy it to `backend/.env` and update values before starting the backend.
- You can add `frontend/.env` (or `frontend/.env.local`) to configure the frontend API/socket endpoints; an example is included at `frontend/.env.example`.

Example `backend/.env.example` (already in repo):

```dotenv
MONGO_URL =mongodb://localhost:27017/mern-socket
JWT_SECRET = <your_jwt_secret_here>
PORT = 5000
```

Example `frontend/.env.example` (created in this repo):

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Install & Run (PowerShell)

Open two PowerShell terminals (one for backend, one for frontend).

Backend:

```powershell
cd 'C:\Users\dell\OneDrive\Desktop\Mern_task\backend'
npm install
Copy-Item .env.example .env
# Edit backend\.env to set your MongoDB URL and JWT secret if necessary
npm run dev
```

Frontend:

```powershell
cd 'C:\Users\dell\OneDrive\Desktop\Mern_task\frontend'
npm install
Copy-Item .env.example .env
# Edit frontend\.env to set VITE_API_URL/VITE_SOCKET_URL if using different ports
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`) in your browser.

## Notes about ports and env variables

- The frontend dev server (Vite) typically serves on port `5173` by default. The backend server typically runs on `PORT` from `backend/.env` (default `5000`).
- `VITE_API_URL` should point to your backend (e.g. `http://localhost:5000`). The frontend has been updated to use `import.meta.env.VITE_API_URL` and `VITE_SOCKET_URL` so you can change endpoints without editing source files.

## Troubleshooting

- If Socket.IO events appear duplicated on refresh, ensure both frontend and backend are running and that `VITE_SOCKET_URL` points to the backend.
- If you see CORS or connection errors, check backend logs and ensure `cors` is enabled in `backend/server.js`.

## Next steps / improvements

- Consider running backend and frontend with a single script using `concurrently`.
- If you'd like, I can make the API base URL configurable throughout the app and add a small script to run both servers together.
