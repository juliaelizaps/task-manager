
import express from "express";
import {json} from "express";
import type {Request, Response } from "express"
import helmet from "helmet";
import {pool} from "./db/db"

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

//let taskArray : Task[] =[];

// http://localhost:3000/api/task


// POST /api/task 
app.post("/api/task", async (request:Request, response:Response)=>{
    try {
        const { title, description, status, priority, due_date } = request.body;
        const date = new Date().toISOString();

        const result = await pool.query(
            `INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at)      
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, description || "", status || "pending", priority || "low", due_date || null, date, date]
        );
        
        response.json(result.rows[0]);
    } catch (error) {
        response.status(500).json({ error: "Failed to create task" });
    }
});


// GET ALL /api/task
// Use: /api/task?status= or /api/task?priority=
app.get("/api/task", async (request: Request, response: Response) => {
    try {
        const { status, priority } = request.query;
        let query = "SELECT * FROM tasks";
        const params = [];
        let paramCount = 0;

        if (status || priority) {
            query += " WHERE ";
            const conditions = [];

            if (status) {
                paramCount++;
                conditions.push(`status = $${paramCount}`);
                params.push(status);
            }

            if (priority) {
                paramCount++;
                conditions.push(`priority = $${paramCount}`);
                params.push(priority);
            }

            query += conditions.join(" AND ");
        }

        const result = await pool.query(query, params);
        response.json(result.rows);
    } catch (error) {
        response.status(500).json({ error: "Failed to find tasks" });
    }
});


// GET /api/task/:id
app.get("/api/task/:id", async(request:Request, response:Response )=>{
    try {
            const id = Number(request.params.id);
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
        return response.status(404).json({error:"Task not found"});
    }
    
    response.json(result.rows[0]);
    } catch (error) {
        response.status(500).json({ error: "Failed to find task by id" });
    }

});


// DELETE /api/task/:id
app.delete("/api/task/:id", async (request:Request, response:Response )=>{
    try {
        const id = Number(request.params.id);
        const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
        
        if (result.rowCount === 0) {
            return response.status(404).json({error:"Task not found"});
        }
        
        response.json({message:`Task ${id} deleted`});
        
    } catch (error) {
        response.status(500).json({ error: "Failed to delete task" });
    }
});

// PUT /api/task/:id
app.put("/api/task/:id", async(request: Request, response: Response) => {
    try {
        const id = Number(request.params.id);
        const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return response.status(404).json({ error: "Task not found" });
        }
    
        const task = result.rows[0];
        const updated_at = new Date().toISOString();
    
        const updateResult = await pool.query(
            `UPDATE tasks SET 
             title = $2, description = $3, status = $4, priority = $5, due_date = $6, updated_at = $7
             WHERE id = $1 RETURNING *`,
            [
                id,
                request.body.title ?? task.title,
                request.body.description ?? task.description,
                request.body.status ?? task.status,
                request.body.priority ?? task.priority,
                request.body.due_date ?? task.due_date,
                updated_at
            ]
        );
    
        response.json(updateResult.rows[0]);
        
    } catch (error) {
        response.status(500).json({ error: "Failed to update task" });
    }
});


export default app;

app.listen(port, "0.0.0.0", ()=>{
    console.log(`Listening on port ${port}`);
});

