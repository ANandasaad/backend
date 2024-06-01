import express from "express";
import protect from "../middlewares/authMiddleware";
import ChatController from "../controllers/chatController";
const router = express.Router();
router.post("/access-chat/:userId", protect, ChatController.accessChat);
router.get("/fetch-chat", protect, ChatController.fetchChats);
router.post("/create-group-chat", protect, ChatController.createGroupChat);
router.put(
  "/update-group-name/:chatId",
  protect,
  ChatController.renameGroupChat
);
router.put("/addUser-to-group/:chatId", protect, ChatController.addToGroupChat);
router.put(
  "/remove-from-group/:chatId",
  protect,
  ChatController.removeFromGroupChat
);
export default router;
