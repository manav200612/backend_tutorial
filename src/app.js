import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();

app.use(cors([{
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}]));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"))

app.use(cookieParser());

//routes

import UserRouter from './routes/user.routes.js'

// routes declared in routes

app.use("/api/v1/users", UserRouter )

// app.post("/api/v1/users/register", async (req, res) => {
//     console.log("after");
//     console.log(req);
//     return res.json({"message": "Register"})})

export {app}