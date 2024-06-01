import express from "express";
import UserController from "../controllers/userController";
import protect from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/login", UserController.loginUser);
router.post("/sign-up", UserController.registerUser);
router.get("/get-users", protect, UserController.getAllUsers);

export default router;
