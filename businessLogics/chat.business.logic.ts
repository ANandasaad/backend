import Chat from "../models/chatModel";
import { NotFound, Unauthorized } from "http-errors";
import User from "../models/userModel";
import { Types } from "mongoose";

const ChatLogic = {
  async accessChat(userId: string, id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) throw new NotFound("User Id is required");
        var isChat: any = await Chat.find({
          isGroupChat: false,
          $and: [
            { users: { $elemMatch: { $eq: new Types.ObjectId(id) } } },
            { users: { $elemMatch: { $eq: new Types.ObjectId(userId) } } },
          ],
        })
          .populate("users", "-password")
          .populate("latestMessage");

        isChat = await User.populate(isChat, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        if (isChat.length > 0) {
          resolve(isChat[0]);
        } else {
          var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [userId, id],
          };
          try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({
              _id: createChat._id,
            }).populate("users", "-password");
            resolve(fullChat);
          } catch (error) {
            reject(error);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  async fetchChats(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const chats = await Chat.find({
          users: {
            $elemMatch: { $eq: id },
          },
        })
          .sort({ updatedAt: -1 })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage");

        const result: any = await User.populate(chats, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        if (!result) throw new NotFound("Chat not found");
        return resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
  async createGroupChat(users: string, userId: string, groupName: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!users || !groupName) throw new NotFound("All fields are required");

        var usersData: string[] = JSON.parse(users);
        if (usersData.length < 1) throw new NotFound("More than 2 users");
        usersData.push(userId);
        const createGroupChat = await Chat.create({
          chatName: groupName,
          users: usersData,
          isGroupChat: true,
          groupAdmin: userId,
        });
        const fullGroupChat = await Chat.findOne({
          _id: createGroupChat._id,
        })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

        return resolve(fullGroupChat);
      } catch (error) {
        reject(error);
      }
    });
  },
  async removeFromGroupChat(chatId: string, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId || !chatId) throw new NotFound("All fields are required");
        const removed = await Chat.findByIdAndUpdate(
          chatId,
          {
            $pull: { users: userId },
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

        if (!removed) throw new NotFound("addToGroupChat not found");
        return resolve(removed);
      } catch (error) {
        reject(error);
      }
    });
  },
  async renameGroupChat(chatId: string, groupName: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!chatId) throw new NotFound("chatId not found");
        if (!groupName) throw new NotFound("groupName not found");
        const updateGroupName = await Chat.findByIdAndUpdate(
          chatId,
          { chatName: groupName },
          { new: true }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
        if (!updateGroupName) throw new NotFound("updateGroupName not found");
        return resolve(updateGroupName);
      } catch (error) {
        reject(error);
      }
    });
  },
  async addToGroupChats(userId: string, chatId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId || !chatId) throw new NotFound("All fields are required");
        const addedToGroupChat = await Chat.findByIdAndUpdate(
          chatId,
          {
            $push: { users: userId },
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
        console.log(addedToGroupChat);

        if (!addedToGroupChat) throw new NotFound("addToGroupChat not found");
        return resolve(addedToGroupChat);
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default ChatLogic;
