import mongoose from "mongoose";

const attendanceModel = new mongoose.Schema({
    firstName:{
        type: String, 
        required: true
    },
    lastName:{
        type: String, 
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    inTime:{
        type: Date,
        required: true
    },
    outTime:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    employeeId:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
})

export default mongoose.model("attendance", attendanceModel)