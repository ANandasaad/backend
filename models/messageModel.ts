import mongoose, { Model, Schema, Types } from "mongoose";

interface IMessage extends Document {
  sender: Types.ObjectId;
  content: string;
  chat: Types.ObjectId;
}

const messageModal: Schema<IMessage> = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageModal
);
export default Message;
