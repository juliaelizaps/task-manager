
import express from "express";
import type {Request, Response } from "express"


const app = express();
const port = 8080;
app.use(express.json());

type Task = {
    id: number;
    title: string;
    description?: string;
    status: "pending"| "in progress" | "completed";
    priority: "low" | "medium" | "high";
    due_date?: string;
    created_at: string;
    updated_at: string;
};

let tasks : Task[] =[];

// POST/api/tasks http://localhost:8080/api/tasks

app.post("/api/tasks", (request:Request, response:Response)=>{
    
    const date = new Date().toISOString();

    const task: Task = {
        id: tasks.length + 1, 
        title:request.body.title, 
        description:request.body.description|| "", 
        status: request.body.status|| "pending",
        priority:request.body.priority|| "low",
        due_date:request.body.due_date|| null,
        created_at: date,
        updated_at: date
    };

    tasks.push(task);
    response.json(task);

    console.log(tasks);
});

// GET/api/tasks
app.get("/api/tasks", (request:Request, response:Response )=>{
    response.json(tasks);
});

app.get("/", (request:Request, response:Response)=>{
    response.json({ message: "Hi"});
});

app.listen(port, "0.0.0.0", ()=>{
    console.log(`Listening on port ${port}`);
});
