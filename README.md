# TaskFlow — Task Management System

A full-stack task management web app built with React, Node.js, Express, and MongoDB.

---

## Features

- JWT-based Authentication (Signup / Login)
- Full CRUD for Tasks
- Filter by Status & Priority
- Search by title
- Sort by due date, creation date, priority
- Pagination
- Analytics dashboard (total, completed, pending, overdue, completion %)
- Dark / Light mode
- Responsive design
- Global error handling

---

## Tech Stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Frontend  | React 18, React Router v6   |
| Backend   | Node.js, Express.js         |
| Database  | MongoDB + Mongoose          |
| Auth      | JWT + bcryptjs              |
| Styling   | Custom CSS (no framework)   |

---

## Project Structure

```
task-manager/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT protect + role-based
│   │   └── error.js         # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js          # Indexed for performance
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Analytics.js
        │   ├── Navbar.js
        │   ├── ProtectedRoute.js
        │   ├── TaskCard.js
        │   └── TaskForm.js
        ├── context/
        │   ├── AuthContext.js
        │   └── ThemeContext.js
        ├── pages/
        │   ├── Dashboard.js
        │   ├── Login.js
        │   └── Signup.js
        ├── services/
        │   └── api.js        # Axios instance + all API calls
        ├── App.js
        ├── index.css
        └── index.js
```

---

## Setup Instructions

### Prerequisites
- Node.js >= 16
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create your .env file
cp .env.example .env
# Fill in your values:
#   MONGO_URI=mongodb://localhost:27017/taskmanager
#   JWT_SECRET=your_secret_key
#   PORT=5000
#   NODE_ENV=development

npm run dev     # Development with nodemon
# OR
npm start       # Production
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Optional: Create .env for custom API URL
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

npm start       # Runs on http://localhost:3000
```

---

## API Endpoints

### Auth Routes

| Method | Endpoint          | Auth | Description         |
|--------|-------------------|------|---------------------|
| POST   | /api/auth/signup  | No   | Register new user   |
| POST   | /api/auth/login   | No   | Login, returns JWT  |
| GET    | /api/auth/me      | Yes  | Get current user    |

**Signup body:**
```json
{ "name": "John", "email": "john@test.com", "password": "123456" }
```

**Login body:**
```json
{ "email": "john@test.com", "password": "123456" }
```

---

### Task Routes (All require `Authorization: Bearer <token>`)

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | /api/tasks            | Get all tasks (filters + pagination)|
| POST   | /api/tasks            | Create a task                      |
| GET    | /api/tasks/:id        | Get single task                    |
| PUT    | /api/tasks/:id        | Update a task                      |
| DELETE | /api/tasks/:id        | Delete a task                      |
| GET    | /api/tasks/analytics  | Get analytics summary              |

**GET /api/tasks Query Params:**

| Param    | Values                          | Description         |
|----------|---------------------------------|---------------------|
| status   | Todo, In Progress, Done         | Filter by status    |
| priority | Low, Medium, High               | Filter by priority  |
| search   | any string                      | Search in title     |
| sortBy   | createdAt, dueDate, priority    | Sort field          |
| order    | asc, desc                       | Sort direction      |
| page     | number (default: 1)             | Pagination page     |
| limit    | number (default: 10)            | Tasks per page      |

**Task body:**
```json
{
  "title": "Fix login bug",
  "description": "Optional details",
  "status": "Todo",
  "priority": "High",
  "dueDate": "2024-12-31"
}
```

**Analytics Response:**
```json
{
  "analytics": {
    "total": 20,
    "completed": 8,
    "inProgress": 5,
    "todo": 7,
    "overdue": 3,
    "completionPercentage": 40,
    "priorityStats": { "Low": 5, "Medium": 10, "High": 5 }
  }
}
```

---

## Design Decisions

### Backend
- **JWT Auth**: Stateless auth via `jsonwebtoken`. Token expires in 7 days. Stored on frontend in `localStorage`.
- **Global Error Middleware**: Single `error.js` middleware catches Mongoose errors (cast errors, duplicate keys, validation) and formats them consistently.
- **MongoDB Indexes**: Compound indexes on `{ user, status }`, `{ user, priority }`, `{ user, dueDate }` and a text index on `title` for fast filtering/searching per user.
- **Role-based Access**: `authorize(...roles)` middleware ready for future admin features.
- **Validation**: `express-validator` for input validation on auth and task creation routes.

### Frontend
- **Context API**: `AuthContext` manages user session. `ThemeContext` manages dark/light mode with `localStorage` persistence.
- **Axios Interceptors**: Auto-attach JWT token on every request; redirect to `/login` on 401.
- **Debounced Search**: Prevents excessive API calls while typing.
- **Optimistic UI**: Task card updates locally on toggle/delete for instant feedback.
- **Component Separation**: `TaskCard`, `TaskForm`, `Analytics`, `Navbar` are independent reusable components.
- **No CSS Framework**: All styles in a single `index.css` using CSS custom properties (variables) for full dark/light mode support.

---

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Deployment

### Backend (Railway / Render)
1. Push backend folder to GitHub
2. Set environment variables in the platform dashboard
3. Set start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Push frontend folder to GitHub
2. Set `REACT_APP_API_URL` to your deployed backend URL
3. Build command: `npm run build`
4. Output directory: `build`

---

## License
MIT
