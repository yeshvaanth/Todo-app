# To-Do Application

A full-stack To-Do application The application allows users to manage tasks, track their status, search and filter todos, and view individual task details.

## Features

- Create a new todo.
- View all todos.
- View an individual todo on a separate details page.
- Update todo title, description, and status.
- Delete todos with a confirmation dialog.
- Search todos by title.
- Filter todos by status.
- Sort todos.
- Mark todos as completed or pending.
- Validate user input and handle API errors.
- Persist todo data in MySQL.

## Technology Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- MySQL2

**Database**
- MySQL

**Testing and API Tools**
- Node.js built-in test runner
- Postman

## Project Structure

```text
Todo App/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── postman/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── details.html
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- MySQL Server
- Git
- Postman (optional, for API testing)

## Database Setup

1. Start your MySQL server.
2. Create the database:

```sql
CREATE DATABASE DB_todo;
```

3. Select the database:

```sql
USE trrip_todo;
```

4. Create the `todos` table:

```sql
CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed')
        NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

## Backend Setup

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory using `.env.example` as a template.

Configure the following environment variables with your local MySQL credentials:

```dotenv
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=***_todo
DB_PORT=3306
```

Start the backend development server:

```bash
npm run dev
```

The API server runs at:

`http://localhost:5000`

## Frontend Setup

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

The application has two HTML entry points:

- `index.html` — todo list page.
- `details.html?id=1` — individual todo details page for the specified ID.

## API Endpoints

Base URL: `http://localhost:5000/api/todos`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/todos` | Retrieve todos |
| GET | `/api/todos/:id` | Retrieve a todo by ID |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

### Create Todo Example

**POST** `/api/todos`

Request body:

```json
{
  "title": "Learn Node.js",
  "description": "Practice backend development"
}
```

### Update Todo Example

**PUT** `/api/todos/1`

Request body:

```json
{
  "title": "Learn Node.js",
  "description": "Practice backend development",
  "status": "in_progress"
}
```

Supported statuses:

- `pending`
- `in_progress`
- `completed`

### Search and Filter

The list endpoint supports title search and status filtering through query parameters.

Example:

`GET /api/todos?search=Node&status=pending`

## Running Backend Tests

From the project root:

```bash
npm --prefix backend test
```

The backend service tests cover validation, CRUD operations, missing records, and database error handling.

## Postman Collection

The Postman collection is provided in:

`backend/postman
