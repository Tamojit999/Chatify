import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        //extracting the token from the cookie
        const token = socket.handshake.headers.cookie
        ?.split(";")
        .find((c) => c.trim().startsWith("jwt="))
        ?.split("=")[1];
        if (!token) {
            console.log("No token provided in socket handshake");
            return next(new Error("Authentication error: No token provided"));
        }
        //verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            console.log("Invalid token in socket handshake");
            return next(new Error("Authentication error: Invalid token"));
        }
        //find the user from the database
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("User not found for token in socket handshake");
            return next(new Error("Authentication error: User not found"));
        }
        socket.user = user; // attaching the user to the socket object for later use in event handlers
        socket.userId = user._id.toString(); // attaching the userId as a string for easier access
         console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);
        next();
    } catch (error) {
         console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
    }
}