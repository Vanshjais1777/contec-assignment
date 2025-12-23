# Task Management System

A full-stack role-based task management application with audit logging capabilities. Built with Express.js, MongoDB, and React.

## Features

- **User Authentication** - Secure login and registration with JWT
- **Role-Based Access Control** - Admin and User roles with different permissions
- **Task Management** - Create, edit, delete, and filter tasks
- **Audit Logging** - Track all system activities (admin only)
- **Task Assignment** - Assign tasks with priority levels and due dates
- **Responsive Design** - Works on desktop and mobile devices

## Project Structure

```
project-root/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── controllers/        # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── audit.controller.js
│   │   ├── middleware/         # Custom middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── role.middleware.js
│   │   ├── models/             # MongoDB schemas
│   │   │   ├── user.model.js
│   │   │   ├── task.model.js
│   │   │   └── audit.model.js
│   │   └── routes/             # API routes
│   │       ├── auth.routes.js
│   │       ├── task.routes.js
│   │       └── audit.routes.js
│   ├── server.js
│   ├── seed.js                 # Admin user seeding script
│   └── package.json
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── api/                # API client
│   │   ├── components/         # React components
│   │   ├── context/            # React context (Auth)
│   │   ├── pages/              # Page components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
└── README.md                   # This file
```

## Prerequisites

- **Node.js** v16 or higher ([download](https://nodejs.org/))
- **MongoDB** - Local instance or MongoDB Atlas account ([create free](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file in backend directory
cat > .env << EOF
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
JWT_SECRET=your_secret_key_here_change_this_in_production
NODE_ENV=development
EOF

# Start the backend server
npm run dev
```

Backend will run at `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file in frontend directory
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start the frontend development server
npm run dev
```

Frontend will run at `http://localhost:5173`

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:password@cluster.mongodb.net/taskdb` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret key for JWT tokens (change in production) | `your-secret-key-here` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Create Admin User

The project includes a seeding script to create an admin user automatically.

### Running the Seed Script

```bash
# Navigate to backend directory
cd backend

# Run the seed script
npm run seed
```

This will create an admin user with the following credentials:
- **Email:** `admin@demo.com`
- **Password:** `password123`

If the admin user already exists, the script will display a message and exit.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

**Request Body Example (Register):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Request Body Example (Login):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response Example:**
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/tasks` | Get user's tasks (or all tasks for admin) | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |

**Task Object:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Complete project",
  "description": "Finish the task management system",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2024-12-31",
  "assignedTo": "507f1f77bcf86cd799439012",
  "createdBy": "507f1f77bcf86cd799439013",
  "createdAt": "2024-12-20T10:30:00Z",
  "updatedAt": "2024-12-20T10:30:00Z"
}
```

### Audit Logs (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/audit` | Get all audit logs | Yes (Admin) |

**Audit Log Object:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "action": "TASK_CREATED",
  "userId": "507f1f77bcf86cd799439012",
  "userName": "John Doe",
  "resourceType": "Task",
  "resourceId": "507f1f77bcf86cd799439013",
  "changes": {
    "title": "Complete project",
    "status": "pending"
  },
  "timestamp": "2024-12-20T10:30:00Z"
}
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens expire after 30 days. Store the token securely in your frontend (localStorage is used in this project).

## User Roles

### User Role
- Create their own tasks
- Edit their own tasks
- Delete their own tasks
- View only their tasks on dashboard

### Admin Role
- All user permissions
- View all tasks in the system
- Access audit logs
- View complete audit history

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Testing

### Demo Accounts

After running the seed script, you can login with:

**Admin Account:**
- Email: `admin@demo.com`
- Password: `password123`

**Regular User:**
- Register a new account through the signup page

### Testing Workflow

1. **Register** - Create a new user account
2. **Login** - Sign in with your credentials
3. **Create Task** - Add tasks with title, description, priority, and due date
4. **Edit Task** - Update task details and status
5. **View Tasks** - Filter and manage your tasks
6. **(Admin Only)** - View audit logs to see all system activities

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemon** - Development server auto-reload

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Status

This is a complete, production-ready task management system with all essential features implemented.

## License

ISC

## Support

For issues or questions, please check the project files or review the API documentation above.
