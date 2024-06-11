import { NotFound, Unauthorized, NotAcceptable } from "http-errors";
import Message from "../models/messageModel";
import User from "../models/userModel";
import Chat from "../models/chatModel";

const MessageLogic = {
  async createMessage(chatId: string, content: string, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!content || !chatId)
          throw new NotFound("Invalid data passed into request");

        var newMessage = {
          sender: userId,
          content: content,
          chat: chatId,
        };
        var message = await Message.create(newMessage);
        var messageData = await Message.findById(message._id)
          .populate("sender", "name pic")
          .populate("chat")
          .exec();
        var data = await User.populate(messageData, {
          path: "chat.users",
          select: "name pic email",
        });
        await Chat.findByIdAndUpdate(chatId, {
          latestMessage: data,
        });
        return resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },
  async fetchMessage(chatId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const messages = await Message.find({
          chat: chatId,
        })
          .populate("sender", "name pic email")
          .populate("chat");
        return resolve(messages);
      } catch (error) {
        reject(error);
      }
    });
  },
};
export default MessageLogic;
