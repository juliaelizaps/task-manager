import express from "express";
import type {Request, Response } from "express"

const app = express();
const port = 8080;

app.get("/", (response:Response, request:Request)=>{
    response.json({message:"testing"});
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});