import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel"; // Adjust the path to your User model

const protect = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "chatApp") as { id: string }; // Ensure the token is typed correctly

      req.user = await User.findById(decoded.id);
      if (!req.user) {
        res.status(401);
        return res.json({ message: "Not authorized, user not found" });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return res.json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401);
    return res.json({ message: "Not authorized, no token" });
  }
};

export default protect;
