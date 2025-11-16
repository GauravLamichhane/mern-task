# MERN Chat Application

A real-time chat application built with MongoDB, Express.js, React, and Node.js using Socket.IO.

## Prerequisites

- Node.js (v14+)
- MongoDB
- npm

## Project Structure

```
├── backend/          # Express + Socket.IO server
├── frontend/         # React + Vite client
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` with your configuration:
```
MONGO_URL=mongodb://localhost:27017/mern-socket
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Update `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Run the Application

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## Features

- Real-time messaging with Socket.IO
- User authentication with JWT
- MongoDB database
- Responsive React frontend

## Notes

- Ensure MongoDB is running before starting the backend
- Both servers must be running for the application to work properly
