import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import bodyParser from "body-parser";
import cors from "cors";
import UserRoute from "./routers/userRoutes";
import ChatRoute from "./routers/chatRoutes";
import fileUpload from "express-fileupload";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
connectDB();
dotenv.config();

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", UserRoute);
app.use("/api/chat", ChatRoute);
app.use(notFound);
app.use(errorHandler);
app.listen(3000, () => {
  console.log("listening on http://localhost on port 3000");
});
