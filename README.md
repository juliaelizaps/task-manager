# Task Manager API

A simple REST API for managing tasks built with Bun, Express, and PostgreSQL.

## API Endpoints

- GET /api/task - Get all tasks (supports ?status= and ?priority= filters)
- GET /api/task/:id - Get task by ID
- POST /api/task - Create new task
- PUT /api/task/:id - Update task
- DELETE /api/task/:id - Delete task

## Task Schema

{
  "id": "number",
  "title": "string",
  "description": "string (optional)",
  "status": "pending | in progress | completed",
  "priority": "low | medium | high",
  "due_date": "string (optional)",
  "created_at": "string",
  "updated_at": "string"
}

## Running the Application

1. Clone the repository and start the services:
   git clone https://github.com/juliaelizaps/task-manager.git
   cd task-manager
   docker-compose up --build

2. The API will be available at http://localhost:3000

The application runs in Docker with PostgreSQL database. All dependencies and configuration are handled automatically.

## Testing

### Running Tests with Docker

Run the test suite using Docker:
```bash
docker-compose up test
```

To clean up and run tests:
```bash
docker-compose down && docker-compose up test
```

### Test Coverage

Success Cases:
- GET all tasks
- POST create task
- GET task by ID
- DELETE task
- PUT update task

Failure Cases:
- POST with missing title
- GET non-existent task 

## Database

The application uses PostgreSQL with the following configuration:
- Host: localhost (or db in Docker)
- Port: 5433 (external), 5432 (internal)
- Database: taskdb
- User: postgre
- Password: postgre

The database schema is automatically created when the application starts.

## Database Access

To connect to the PostgreSQL database:

   # Connecting using Docker Compose (PSQL)
   docker compose exec db psql -U postgre -d taskdb

Password: postgre

## Testing Endpoints on Postman real exemples:


- POST http://localhost:3000/api/task
```bash
body
{
  "title": "test tasks",
  "description": "test",
  "status": "pending",
  "priority": "medium",
  "due_date": null
}
```
- GET http://localhost:3000/api/task?status=pending
- GET http://localhost:3000/api/task/2
- DELETE http://localhost:3000/api/task/1
- PUT http://localhost:3000/api/task/2

```bash
body
{
  "title": "New title",
  "priority": "high"
}
```