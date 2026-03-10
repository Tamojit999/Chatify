import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/utilies.js";
import { sendWelcomeEmail } from "../email/emailHandler.js";
import cloudinary from "../libs/cloudinary.js";

export const signup = async (req, res) => {
    try {
        let { fullName, email, password } = req.body;
        
        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }
        fullName = fullName.trim();
        email = email.trim().toLowerCase();
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
            // Fire-and-forget: don't await since response is already sent
            sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL)
                .catch((error) => console.error("Failed to send welcome email:", error));
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

        if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }

        email = email.trim().toLowerCase();
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
export const updateProfile = async (req, res) => {
   try {
    const {profilePic}=req.body;
    if(!profilePic)
    {
        return res.status(400).json({message:"Profile picture is required"});
    }
    const uploadResponse=await cloudinary.uploader.upload(profilePic);
    const user_id=req.user._id; // we can access the user object from the req object, because we have attached the user object to the req object in the protectRoute middleware.
    const updatedUser=await User.findByIdAndUpdate(
        user_id,
        {profilePic:uploadResponse.secure_url},
        {new:true} // this option will return the updated user object in the response, instead of the old user object.
    ).select("-password"); // we are selecting all the fields except the password field, because we don't want to send the password field in the response.
    res.status(200).json(updatedUser);
    
   } catch (error) {
    console.log("Error in updateProfile controller:", error);
    res.status(500).json({ message: "Server error" });
   }
};

