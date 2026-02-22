import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/utilies.js";
import { sendWelcomeEmail } from "../email/emailHandler.js";
export const signup = async (req, res) => {
    try {
        let { fullName, email, password } = req.body;
        fullName = fullName.trim();
        email = email.trim().toLowerCase();
    // Validation
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Please provide all the required fields" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    // check if emailis valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
    }

    //hashing the password
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    // Create a new user
    const newuser=new User({
        fullName,
        email,
        password:hashedPassword // we are storing the hashed password in the database, not the plain text password
    });
    if(newuser){
        const savedUser=await newuser.save();
        const token = generateToken(savedUser._id, res);
        res.status(201).json({
            _id:newuser._id,
            fullName:newuser.fullName,
            email:newuser.email,
            profilePic:newuser.profilePic,
           
        });
        try {
            await sendWelcomeEmail(savedUser.email,savedUser.fullName,process.env.CLIENT_URL); //client URL is the URL of the frontend application, which we will use in the welcome email template to provide a link for the user to open the app.
        } catch (error) {
             console.error("Failed to send welcome email:", error);
        }
    }
    else{
        res.status(400).json({message:"invalid user data"});
    }
        
    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({ message: "Server error" });
        
    }
    


};
export const login = async (req, res) => {
    res.send("Login API");
};
export const logout = async (req, res) => {
    res.send("Logout API");
};

