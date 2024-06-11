import { RequestHandler } from "express";
import MessageLogic from "../businessLogics/message.business.logic";
const MessageController: {
  createMessage: RequestHandler;
  fetchMessage: RequestHandler;
} = {
  async createMessage(req: any, res, next) {
    try {
      const { content, chatId } = req.body;
      const userId = req.user.id;
      const response = await MessageLogic.createMessage(
        chatId,
        content,
        userId
      );
      res.json({
        success: true,
        message: "Message created successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  async fetchMessage(req, res, next) {
    try {
      const { chatId } = req.params;
      const response = await MessageLogic.fetchMessage(chatId);
      res.json({
        success: true,
        message: "Message fetched successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default MessageController;
