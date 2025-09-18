
import express from "express";
import {json} from "express";
import type {Request, Response } from "express"
import helmet from "helmet";

const app = express();
const port = 3000;
app.use(json());
app.use(helmet());

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

let taskArray : Task[] =[];

// http://localhost:3000/api/task


// POST /api/task 
app.post("/api/task", (request:Request, response:Response)=>{
    
    const date = new Date().toISOString();

    const task: Task = {
        id: taskArray.length + 1, 
        title:request.body.title, 
        description:request.body.description|| "", 
        status: request.body.status|| "pending",
        priority:request.body.priority|| "low",
        due_date:request.body.due_date|| null,
        created_at: date,
        updated_at: date
    };

    taskArray.push(task);
    response.json(task);
});


// GET ALL /api/task
// Use: /api/task?status= or /api/task?priority=
app.get("/api/task", (request:Request, response:Response )=>{

    const {status,priority} = request.query;
    const filteredTask = taskArray.filter(task => {

        const optionOne = status && task.status !== status;
        const optionTwo = priority && task.priority !==priority;

        if (optionOne || optionTwo){
            return false;
        }
        return true;
    });

    response.json(filteredTask);
});


// GET /api/task/:id
app.get("/api/task/:id", (request:Request, response:Response )=>{
    const id = Number(request.params.id);
    const task = taskArray.find((task): task is Task => task.id === id);

    if(!task){
        return response.status(404).json({error:"Task not found"});
    }
    response.json(task);
});


// DELETE /api/task/:id
app.delete("/api/task/:id", (request:Request, response:Response )=>{
    const id = Number(request.params.id);
    const task = taskArray.find(task => task.id === id);

    if(!task){
       return response.status(404).json({error:"Task not found"});
    }

    taskArray = taskArray.filter(task => task.id !== id);
    response.json({message:`Task ${id} deleted`});
});

// PUT /api/task/:id
app.put("/api/task/:id", (request: Request, response: Response) => {
    const id = Number(request.params.id);
    const task = taskArray.find(task => task.id === id);

    if (!task) {
        return response.status(404).json({ error: "Task not found" });
    }

    task.title = request.body.title ?? task.title;
    task.description = request.body.description ?? task.description;
    task.status = request.body.status ?? task.status;
    task.priority = request.body.priority ?? task.priority;
    task.due_date = request.body.due_date ?? task.due_date;
    task.updated_at = new Date().toISOString();

    response.json(task);
});





app.get("/", (request:Request, response:Response)=>{
    response.json({ message: "Hi, It's working :)"});
});

app.listen(port, "0.0.0.0", ()=>{
    console.log(`Listening on port ${port}`);
});
