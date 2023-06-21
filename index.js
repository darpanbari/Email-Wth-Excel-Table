import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { getAttendance } from "./Email-Sender.js";
import {getAttendanceExcel} from "./Email-Excel.js"

const app = express();

const PORT = 7070;

app.use(cors())
app.use(bodyParser.json())

app.listen(PORT,()=>{
    console.log(`server listning on port ${PORT}`)
});

mongoose.connect(`mongodb://0.0.0.0:27017/Table-Email`)
.then(()=>{
    console.log("Database connected successfully")
})
.catch((err)=>{
    console.log(err)
})

// getAttendance()
getAttendanceExcel()
