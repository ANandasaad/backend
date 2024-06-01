import { Types } from "mongoose";
import jwt from "jsonwebtoken";
type userInput = {
  id: Types.ObjectId;
  email: string;
};

const generateToken = (options: userInput) => {
  try {
    const { id, email } = options;
    const token = jwt.sign({ id, email }, "chatApp", { expiresIn: "30d" });
    return token;
  } catch (error) {
    console.log(error);
  }
};
export default generateToken;
