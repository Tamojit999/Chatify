import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
export const resendClient = new Resend(process.env.RESEND_API_KEY); // Initialize Resend with your API key
export const sender={
    email: process.env.EMAIL_FROM,
    name: process.env.EMAIL_FROM_NAME,
}
