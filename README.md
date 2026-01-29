# Task Management API

A RESTful API for managing tasks with user authentication and authorization built with Node.js, Express, MongoDB, and JWT.

## Features

- ✅ User registration and authentication
- ✅ JWT-based authorization
- ✅ Password hashing with bcrypt
- ✅ CRUD operations for tasks
- ✅ User-specific task management
- ✅ Protected routes with middleware
- ✅ MongoDB database integration

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Taha-Aaqib/task-manangment-api.git
cd task-managment-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d
```

4. Make sure MongoDB is running locally on port 27017

5. (Optional) Seed the database:
```bash
node seed.js
```

6. Start the server:
```bash
node server.js
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "697b57a72cd04dd4c4f574ae"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Task Routes (Protected)

All task routes require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

#### Get All Tasks
```http
GET /tasks
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "697b57a72cd04dd4c4f574ae",
    "title": "Finish homework",
    "description": "Math exercises",
    "completed": false,
    "user": "697b57a72cd04dd4c4f574ad",
    "createdAt": "2026-01-29T12:50:47.747Z"
  }
]
```

#### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "completed": false
}
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

## Project Structure

```
task-managment-api/
├── models/
│   ├── User.js          # User schema with password hashing
│   └── Task.js          # Task schema
├── routes/
│   ├── auth.js          # Authentication routes
│   └── tasks.js         # Task CRUD routes
├── middleware/
│   └── auth.js          # JWT verification middleware
├── .env                 # Environment variables (not in git)
├── .gitignore          # Git ignore file
├── server.js           # Main application file
├── seed.js             # Database seeding script
├── package.json        # Dependencies
└── README.md           # This file
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT signing | `supersecretkey123` |
| `JWT_EXPIRES_IN` | Token expiration time | `1d`, `7d`, `24h` |

## Authentication Flow

1. **Register**: User creates account → Password is hashed with bcrypt → Stored in database
2. **Login**: User provides credentials → Password verified → JWT token generated → Token sent to client
3. **Protected Routes**: Client sends token in Authorization header → Middleware verifies token → Request processed

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with expiration
- Protected routes with authentication middleware
- User-specific data access (users can only access their own tasks)

## Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Tasks:**
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Test task","completed":false}'
```

## License

MIT

## Author

Taha Aaqib
