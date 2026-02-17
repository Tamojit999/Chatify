import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:""
    }
},{
    timestamps:true // this will automatically add createdAt and updatedAt fields to the schema
});
const User=mongoose.model("User",userSchema);
export default User;