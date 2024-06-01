import { RequestHandler } from "express";
import ChatLogic from "../businessLogics/chat.business.logic";
import { NotFound } from "http-errors";
const ChatController: {
  accessChat: RequestHandler;
  fetchChats: RequestHandler;
  createGroupChat: RequestHandler;
  renameGroupChat: RequestHandler;
  removeFromGroupChat: RequestHandler;
  addToGroupChat: RequestHandler;
} = {
  async accessChat(req: Request | any, res, next) {
    try {
      const { userId } = req.params;

      const { id } = req.user;
      const response = await ChatLogic.accessChat(userId, id);
      res.json({
        success: true,
        message: "Successfully accessed chat",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  async fetchChats(req: any, res, next) {
    try {
      const { id } = req.user;
      const response = await ChatLogic.fetchChats(id);
      res.json({ success: true, message: "Fetched chat", data: response });
    } catch (error) {
      next(error);
    }
  },
  async createGroupChat(req: any, res, next) {
    try {
      const users = req.body.users;
      const groupName = req.body.name;
      const userId = req.user.id;

      const response = await ChatLogic.createGroupChat(
        users,
        userId,
        groupName
      );
      res.json({
        success: true,
        message: "Group chat created successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  async removeFromGroupChat(req: any, res, next) {
    try {
      const { chatId } = req.params;
      const { userId } = req.body;
      const response = await ChatLogic.removeFromGroupChat(chatId, userId);
      res.json({
        success: true,
        message: "Removed from group successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  async renameGroupChat(req: any, res, next) {
    try {
      const chatId = req.params.chatId;
      const groupName = req.body.name;
      const response = await ChatLogic.renameGroupChat(chatId, groupName);
      res.json({
        success: true,
        message: "Group name renamed successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  async addToGroupChat(req, res, next) {
    try {
      const { chatId } = req.params;
      const { userId } = req.body;
      console.log(chatId);
      const response = await ChatLogic.addToGroupChats(userId, chatId);
      res.json({
        success: true,
        message: "User added successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ChatController;
