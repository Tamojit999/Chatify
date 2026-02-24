import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/utilies.js";
import { sendWelcomeEmail } from "../email/emailHandler.js";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create a new user
        const newuser = new User({
            fullName,
            email,
            password: hashedPassword // we are storing the hashed password in the database, not the plain text password
        });
        if (newuser) {
            const savedUser = await newuser.save();
            const token = generateToken(savedUser._id, res);
            res.status(201).json({
                _id: newuser._id,
                fullName: newuser.fullName,
                email: newuser.email,
                profilePic: newuser.profilePic,

            });
            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL); //client URL is the URL of the frontend application, which we will use in the welcome email template to provide a link for the user to open the app.
            } catch (error) {
                console.error("Failed to send welcome email:", error);
            }
        }
        else {
            res.status(400).json({ message: "invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({ message: "Server error" });

    }



};
export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase();
        password = password.trim();
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller:", error);
        res.status(500).json({ message: "Server error" });

    }

};
export const logout =(_, res) => {
    res.cookie("jwt","",{ maxAge: 0 }); // we are setting the cookie with an empty value and maxAge of 0, which will effectively delete the cookie from the client's browser. the name  of the cookie will be same as the the name we used to set the cookie in the generateToken function, which is "jwt" in this case.
    res.status(200).json({message:"Logged out successfully"});
};

