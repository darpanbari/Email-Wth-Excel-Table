import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
    firstName:{
        type: String, 
        required: true
    },
    lastName:{
        type: String, 
        required: true
    },
    userId:{
        type: Number,
        required: true
    },
    department:{
        type: String,
        required: true
    },
})

export default mongoose.model("user", UserModel)