import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, sendMessageGroup } from "../controllers/message.controller.js";

// Router para mensagens
const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/send/group/:groupId", protectRoute, sendMessageGroup);

export default router;