import User from "../models/userModel";
import { NotFound, Unauthorized } from "http-errors";
import bcrypt from "bcrypt";
import generateToken from "../utilies/generateToken";
type userInput = {
  name: string;
  email: string;
  password: string;
  pic: File;
};

type LoginType = {
  email: string;
  password: string;
};

const UserLogic = {
  async userRegister({ input }: { input: userInput }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, email, password, pic } = input;
        if (!name || !email || !password)
          throw new NotFound("All fields must be provided");

        const isUserExist = await User.findOne({
          email,
        });
        if (isUserExist) throw new NotFound("User already exists");
        const hashPassword = await bcrypt.hash(password, 10);

        const createUser = await User.create({
          name,
          email,
          password: hashPassword,
          pic,
        });
        const options = {
          id: createUser._id,
          email: createUser.email,
        };
        const token = generateToken(options);

        resolve({ createUser, token });
      } catch (error) {
        reject(error);
      }
    });
  },

  async login({ input }: { input: LoginType }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password } = input;
        console.log(input);
        if (!email || !password)
          throw new NotFound("Email or password is required");
        const isUserExist = await User.findOne({
          email,
        });
        if (!isUserExist) throw new NotFound("User not found");
        const hashPassword = await bcrypt.compare(
          password,
          isUserExist?.password as string
        );

        if (!hashPassword) throw new Unauthorized("Password is incorrect");
        const options = {
          id: isUserExist._id,
          email: isUserExist.email,
        };
        const token = generateToken(options);
        return resolve({
          userLogin: isUserExist,
          token: token,
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  async getUsers(search: string, userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const keyword = search
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
              ],
            }
          : {};
        const response = await User.find(keyword).find({
          _id: { $ne: userId },
        });
        if (!response) throw new NotFound("Users not found");
        return resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default UserLogic;
