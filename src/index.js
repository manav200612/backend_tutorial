import dotenv from 'dotenv';
import { app } from './app.js';
import mongoose from "mongoose";
import {DB_NAME} from "./constant.js"
import connectDB from "./db/index.js";

dotenv.config({
    path: `./env`,
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`the server is running at port : ${process.env.PORT}` )}
)})
.catch((err) => {
    console.log("mongodb error", err);
})






















// import express from "express"
// const app = express()

// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on('error',() => {console.log('Error', error)})

//         console.log("Connected to MongoDB!");
//         app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))

//     } catch (error) {
//         console.error("ERROR: " + error);
//         throw err
//     }
// })()