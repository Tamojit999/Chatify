import aj from "../libs/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
export const arcjetProtection=async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if(decision.isDenied())
        {
            // Check the reason for denial
            if(decision.reason.isRateLimit())
            {
                return res.status(429).json({ message: "Too many requests. Please try again later." });
            }
            else if(decision.reason.isBot())
            {
                // Check if it's a spoofed bot for more specific message
                if(decision.results.some(isSpoofedBot))
                {
                    return res.status(403).json({ message: "Forbidden: Spoofed bot detected" });
                }
                return res.status(403).json({ message: "Forbidden: Bot detected" });
            }
            else{
                return res.status(403).json({ message: "Forbidden: Request denied by Arcjet" });
            }

        }
        next();
        
    } catch (error) {
        console.log("Error in arcjetProtection middleware:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
};