# Vulnerability Manager

A modern web application for tracking and managing security vulnerabilities, built with **React**, **Sass**, and **Node.js (Express)**.

## Features
- Create, edit, and delete vulnerabilities
- Track vulnerability status with realistic state transitions (Pending Fix, In Progress, Under Review, Solved, False Positive, Duplicate)
- Filter and search vulnerabilities by status, criticality, and keywords
- View and update vulnerability details in a responsive card grid
- History of state changes for each vulnerability
- Custom confirmation dialogs and form validation
- Clean, modern UI with responsive design

## Tech Stack
- **Frontend:** React, Sass (SCSS), Vite
- **Backend:** Node.js, Express (in-memory store for demo)
- **Styling:** Custom SCSS modules

## Folder Structure
```
backend/           # Node.js Express API
src/               # React frontend
  components/      # React components (with SCSS)
  services/        # API service layer
  utils/           # Shared constants
```

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/your-username/strike-challenge.git
cd strike-challenge
```

### 2. Install dependencies
```sh
npm install
cd backend
npm install
cd ..
```

### 3. Start the backend API
```sh
cd backend
node server.js
```
The backend will run on [http://localhost:4000](http://localhost:4000)

### 4. Start the frontend (React)
```sh
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173) (default Vite port)

## Usage
- Open the frontend in your browser
- Add, edit, and manage vulnerabilities
- Use the filter bar to search and filter by status or criticality
- Change status and track history for each vulnerability

## Notes
- This project uses an in-memory backend for demo purposes. All data will reset when the server restarts.
- For production, connect to a real database and add authentication.

---

**Made for the Strike Challenge.**
