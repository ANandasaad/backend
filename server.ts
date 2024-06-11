import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import bodyParser from "body-parser";
import cors from "cors";
import UserRoute from "./routers/userRoutes";
import ChatRoute from "./routers/chatRoutes";
import MessageRoute from "./routers/messageRoutes";
import fileUpload from "express-fileupload";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import { Server } from "socket.io";
connectDB();
dotenv.config();

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", UserRoute);
app.use("/api/chat", ChatRoute);
app.use("/api/message", MessageRoute);
app.use(notFound);
app.use(errorHandler);
const server = app.listen(3000, () => {
  console.log("listening on http://localhost on port 3000");
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: " http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connection established");
  socket.on("setup", (userData) => {
    socket.join(userData.data?.userLogin?._id);

    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room", room);
  });
  socket.on("new Message", (newMessageRec) => {
    var chat = newMessageRec.chat;
    if (!chat.users) return console.log("chat users not defined");
    chat.users.forEach((user: any) => {
      if (user?._id == newMessageRec?.sender?._id) return;
      socket.in(user._id).emit("message received", newMessageRec);
    });
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup", (userData) => {
    console.log("User disconnected");
    socket.leave(userData.data?.userLogin?._id);
  });
});
