import express from "express";
import { login, logout, signup, updateProfile } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection); // Apply Arcjet protection to all routes in this router

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.use(protectRoute);
router.post("/logout", logout);
router.put("/update-profile", updateProfile);

router.get("/check", (req, res) => {
  res.status(200).json(req.user);
});

export default router;
