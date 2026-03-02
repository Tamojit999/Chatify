import "dotenv/config";

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import connectDB from "./libs/db.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // Middleware to parse JSON bodies in requests
app.use(cookieParser()); // Middleware to parse cookies from incoming requests

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

//Authentication routes
app.use("/api/auth", authRoutes);
//Message routes
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server is running on port: " + PORT);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
