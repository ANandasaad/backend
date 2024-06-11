import express from "express";
import protect from "../middlewares/authMiddleware";
import MessageController from "../controllers/messageController";
const router = express.Router();
router.post("/create-message", protect, MessageController.createMessage);
router.get("/get-message/:chatId", protect, MessageController.fetchMessage);
export default router;
