import mongoose from "mongoose";
import dotenv from "dotenv";
import { Color } from "colors";
dotenv.config();
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined");
    }
    const db = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log(`Connect database`);
  } catch (error) {
    console.log("Failed to connect database", error);
    process.exit();
  }
};

export default connectDB;
