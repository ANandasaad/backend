// Chat Name
// isGroup Name
// users
// Latest Message
// GroupAdmin

import mongoose, { Model, Schema, Types } from "mongoose";
interface IChat extends Document {
  chatName: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  latestMessage: Types.ObjectId;
  groupAdmin: Types.ObjectId;
}

const chatModel: Schema<IChat> = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat: Model<IChat> = mongoose.model<IChat>("Chat", chatModel);
export default Chat;
