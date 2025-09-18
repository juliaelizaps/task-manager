import { describe, it, expect } from "bun:test";
import request from "supertest";
import app from "../index";

describe("GET /api/task", () => {
  it("Should return status 200 and an array", async () => {
    const response = await request(app).get("/api/task");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("POST /api/task", () => {
  it("Should create a task", async () => {
    const newTask = {
      title: "Test criation",
      priority: "high",
    };

    const response = await request(app)
      .post("/api/task")
      .send(newTask)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(newTask.title);
  });

  it("Should fail with missing title", async () => {
    const invalidTask = {
      description: "Task without title"
    };

    const response = await request(app)
      .post("/api/task")
      .send(invalidTask)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(500);
  });
});

describe("GET /api/task/:id", () => {
  it("Should get a task by id", async () => {
    const newTask = {
      title: "Task to find",
      priority: "medium"
    };

    const createResponse = await request(app)
      .post("/api/task")
      .send(newTask)
      .set("Content-Type", "application/json");

    const taskId = createResponse.body.id;

    const response = await request(app).get(`/api/task/${taskId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe(newTask.title);
  });

  it("Should return 404 for non-existent task", async () => {
    const response = await request(app).get("/api/task/99999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Task not found");
  });
});

describe("DELETE /api/task/:id", () => {
  it("Should delete a task", async () => {
    const newTask = {
      title: "Task to delete",
      priority: "low"
    };

    const createResponse = await request(app)
      .post("/api/task")
      .send(newTask)
      .set("Content-Type", "application/json");

    const taskId = createResponse.body.id;

    const response = await request(app).delete(`/api/task/${taskId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Task ${taskId} deleted`);
  });
});

describe("PUT /api/task/:id", () => {
  it("Should update a task", async () => {
    const newTask = {
      title: "Original title",
      priority: "low"
    };

    const createResponse = await request(app)
      .post("/api/task")
      .send(newTask)
      .set("Content-Type", "application/json");

    const taskId = createResponse.body.id;

    const updateData = {
      title: "Updated title",
      priority: "high"
    };

    const response = await request(app)
      .put(`/api/task/${taskId}`)
      .send(updateData)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updateData.title);
    expect(response.body.priority).toBe(updateData.priority);
  });
});