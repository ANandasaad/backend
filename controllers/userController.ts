import { RequestHandler } from "express";
import UserLogic from "../businessLogics/user.business.logic";

const UserController: {
  registerUser: RequestHandler;
  loginUser: RequestHandler;
  getAllUsers: RequestHandler;
} = {
  async registerUser(req, res, next) {
    try {
      const input = req.body;
      const response = await UserLogic.userRegister({ input });
      res.json({
        success: true,
        message: "User registration successfully",
        data: response,
      });
    } catch (error) {
      res.status(401).send({
        success: false,
        message: error,
      });
      next(error);
    }
  },

  async loginUser(req, res, next) {
    try {
      const input = req.body;
      const response = await UserLogic.login({ input });
      res.json({
        success: true,
        message: "User Login successfully",
        data: response,
      });
    } catch (error) {
      res.status(401).send({
        success: false,
        message: error,
      });
      next(error);
    }
  },

  async getAllUsers(req: Request | any, res, next) {
    try {
      const { search } = req.query;
      const userId = req.user.id;
      console.log(userId);
      const response = await UserLogic.getUsers( search,userId );
      res.json({
        success: true,
        message: "User List was successfully retrieved",
        data: response,
      });
    } catch (error) {
      res.status(401).send({
        success: false,
        message: error,
      });
      next(error);
    }
  },
};

export default UserController;
