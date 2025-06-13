# Vulnerability Manager

A modern web application for tracking and managing security vulnerabilities, built with **React**, **TypeScript**, **Sass**, and **Node.js (Express)**.

## Features
- Create, edit, and delete vulnerabilities
- Track vulnerability status with realistic state transitions (Pending Fix, In Progress, Under Review, Solved, False Positive, Duplicate)
- Filter and search vulnerabilities by status, criticality, and keywords
- View and update vulnerability details in a responsive card grid
- History of state changes for each vulnerability
- Custom confirmation dialogs and form validation
- Clean, modern UI with responsive design

## Tech Stack
### Frontend
- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Sass (SCSS modules)

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Testing:** Jest
- **Storage:** In-memory store (for demo purposes)

## Project Structure
```
├── backend/                # Node.js Express API
│   ├── src/
│   │   ├── api/           # API layer (routes, controllers)
│   │   ├── config/        # Environment configuration
│   │   ├── domain/        # Domain types and interfaces
│   │   ├── services/      # Business logic
│   │   └── utils/         # Shared utilities
│   ├── jest.config.js     # Jest test configuration
│   └── tsconfig.json      # TypeScript configuration
│
├── src/                   # React frontend
│   ├── assets/           # Static assets
│   ├── components/       # React components (with SCSS)
│   │   ├── confirmDialog/
│   │   ├── filterBar/
│   │   ├── vulnerabilityCard/
│   │   ├── vulnerabilityForm/
│   │   └── vulnerabilityGrid/
│   ├── services/         # API service layer
│   ├── utils/           # Shared constants
│   ├── App.tsx          # Main App component
│   ├── App.scss         # Main styles
│   └── main.tsx         # Application entry point
│
├── public/              # Static public assets
├── dist/               # Build output directory
├── tsconfig.json       # Frontend TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/your-username/strike-challenge.git
cd strike-challenge
```

### 2. Install dependencies
For the frontend:
```sh
npm install
```

For the backend:
```sh
cd backend
npm install
```

### 3. Start the backend API
```sh
cd backend
npm run build  # Build TypeScript files
npm start      # Start the server
```
The backend will run on [http://localhost:4000](http://localhost:4000)

For development with auto-reload:
```sh
npm run dev
```

### 4. Start the frontend (React)
```sh
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173)

## Development
- Frontend and backend are both written in TypeScript for type safety
- Use `npm run build` to compile TypeScript files
- Use `npm run dev` for development with hot-reload
- Run tests with `npm test`

## API Endpoints
- `GET /api/vulnerabilities` - List all vulnerabilities
- `POST /api/vulnerabilities` - Create a new vulnerability
- `PUT /api/vulnerabilities/:id` - Update a vulnerability
- `DELETE /api/vulnerabilities/:id` - Delete a vulnerability

## Notes
- This project uses an in-memory backend for demo purposes. All data will reset when the server restarts.
- For production, consider:
  - Adding a persistent database
  - Implementing user authentication
  - Setting up proper CORS configuration
  - Adding input validation
  - Implementing error logging

---

**Made for the Strike Challenge.**
