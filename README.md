# Vulnerability Manager

A modern web application for tracking and managing security vulnerabilities, built with **React**, **TypeScript**, **Sass**, and **Node.js (Express)**. Features role-based access control, JWT authentication, and a responsive design.

## Features
- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User roles)
  - Protected routes and API endpoints
  - Persistent sessions

- **Vulnerability Management**
  - Create, view, edit, and delete vulnerabilities (based on role)
  - Track status with transitions (Pending Fix, In Progress, Under Review, etc.)
  - Filter and search by status, criticality, and keywords
  - Responsive card grid layout for vulnerability details
  - History of state changes
  - Custom confirmation dialogs
  - Form validation
  - Robust JSON payload validation with clear error messages

- **User Interface**
  - Modern, clean UI with Sass styling
  - Responsive design for all devices
  - Role-specific UI elements
  - Toast notifications for actions
  - Loading states and error handling

## Tech Stack
### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Sass (SCSS) with CSS Modules
- **State Management:** Context API + Reducers
- **Routing:** React Router v6
- **HTTP Client:** Fetch API

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Testing:** Jest
- **Storage:** In-memory store (for demo purposes)
- **Error Handling:**
  - Comprehensive error middleware
  - Automatic JSON syntax validation
  - User-friendly error messages
  - Appropriate HTTP status codes (400 for malformed JSON)

## Project Structure
```
├── frontend/             # React/Vite Frontend Application
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── confirmDialog/    # Confirmation dialog component
│   │   │   ├── filterBar/        # Filtering and search bar
│   │   │   ├── header/           # App header with auth status
│   │   │   ├── login/            # Authentication form
│   │   │   ├── routing/          # Protected route components
│   │   │   ├── vulnerabilityCard/# Individual vulnerability display
│   │   │   ├── vulnerabilityForm/# Create/Edit vulnerability form
│   │   │   └── vulnerabilityGrid/# Grid display of vulnerabilities
│   │   ├── context/     # React Context providers (Auth, Vulnerability)
│   │   ├── services/    # API service integrations
│   │   ├── types/       # TypeScript interfaces and types
│   │   ├── utils/       # Constants and utility functions
│   │   └── views/       # Main view components
│   ├── public/          # Static assets
│   └── __tests__/       # Frontend tests
│
└── backend/             # Node.js/Express Backend API
    ├── src/
    │   ├── api/         # API layer
    │   │   ├── controllers/  # Request handlers
    │   │   ├── middleware/   # Auth and validation middleware
    │   │   └── routes/       # API endpoint definitions
    │   ├── config/      # Environment and auth configuration
    │   ├── domain/      # Domain interfaces and types
    │   │   ├── interfaces/
    │   │   └── types/
    │   ├── middleware/  # Global middleware
    │   ├── scripts/     # Utility scripts
    │   ├── services/    # Business logic layer
    │   └── utils/       # Helper functions and constants
    └── tests/           # Backend integration tests
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation and Setup

1. Clone the repository

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Start the backend server (from the backend directory):
```bash
npm run dev
```

5. In a new terminal, start the frontend development server (from the root directory):
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Authentication

The system includes two predefined users for testing:

1. Admin User
   - Username: admin
   - Password: admin123
   - Full access to all features (create, read, update, delete)

2. Regular User
   - Username: user
   - Password: user123
   - Limited access (create and read only)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user and receive JWT token

### Vulnerabilities
All endpoints require a valid JWT token in the Authorization header.

- `GET /api/vulnerabilities` - Get all vulnerabilities (Admin/User)
- `GET /api/vulnerabilities/:id` - Get a specific vulnerability (Admin/User)
- `POST /api/vulnerabilities` - Create a new vulnerability (Admin/User)
- `PUT /api/vulnerabilities/:id` - Update a vulnerability (Admin only)
- `DELETE /api/vulnerabilities/:id` - Delete a vulnerability (Admin only)

## Development

### Environment Variables
The backend uses the following environment variables:
- `PORT` - Server port (default: 4000)
- `JWT_SECRET` - Secret key for JWT signing (default: development key)
- `JWT_EXPIRES_IN` - Token expiration time (default: 24h)

Create a `.env` file in the backend directory to customize these values.

### Adding New Features
1. Backend:
   - Add routes in `backend/src/api/routes`
   - Create controllers in `backend/src/api/controllers`
   - Add business logic in `backend/src/services`
   - Define types in `backend/src/domain/interfaces`

2. Frontend:
   - Create components in `src/components`
   - Add API services in `src/services`
   - Define types in `src/types`
   - Update context providers in `src/context`

## Testing and Coverage

### Running Tests

#### Backend Tests
Navigate to the backend directory and use one of the following commands:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

#### Frontend Tests
Navigate to the frontend directory and use one of the following commands:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Coverage Report

#### Backend Coverage
After running tests with coverage, you can find the detailed coverage report in:
- HTML format: `backend/coverage/lcov-report/index.html`
- Console output showing:
  - Statement coverage
  - Branch coverage
  - Function coverage
  - Line coverage

The coverage report breaks down test coverage by:
- Controllers (auth, vulnerabilities)
- Middleware
- Services
- Utils

#### Frontend Coverage
Frontend coverage report is available at:
- HTML format: `frontend/coverage/lcov-report/index.html`

The frontend test suite includes comprehensive coverage of:
- Component Tests
  - VulnerabilityView (full CRUD operations)
  - VulnerabilityForm (input validation, submission)
  - VulnerabilityGrid (display, filtering)
  - FiltersBar (search, status filters)
  - ConfirmDialog (delete confirmation)
- Context Tests
  - AuthContext (authentication state)
  - VulnerabilityContext (state management)
- Reducer Tests
  - vulnerabilityReducer (state updates)
- Utility Tests
  - storage (localStorage handling)
  - constants (type validation)

Key testing features:
- Async operation testing
- Form validation
- Error handling
- User interactions
- Role-based access control
- State management
- API integration
- Middleware (authentication, error handling)
- Services
- Utils

### Test Organization
Tests are organized in the `backend/tests` directory:
- `auth.test.ts` - Authentication and authorization tests
- `vulnerabilities.test.ts` - CRUD operations and validation tests
- `testHelpers.ts` - Shared test utilities and fixtures

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
This project is licensed under the MIT License.
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
