import express from "express";
import { signup, login, logout, updateProfile, checkAuth, changePassword, forgotPassword, deleteAccount } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAuth } from "../middleware/requireAuth.js";


// Router para autenticação (backend)
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);
router.post("/change-password", requireAuth, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/delete-account", requireAuth, deleteAccount);

export default router; 