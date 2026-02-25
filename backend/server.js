import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbconnect from "./utils/dbconnect.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT;
const allowOrigin = [
  "http://localhost:5173",
  "https://fullstack-instagram-app.vercel.app",
  "https://fullstack-instagram-app-git-main-kapil-ishwarkars-projects.vercel.app",
  "https://fullstack-instagram-9wti9wfrl-kapil-ishwarkars-projects.vercel.app",
];
app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
    methods: ["POST", "PUT", "DELETE", "GET"],
  }),
);
app.use(express.json());
app.use(cookieParser());

dbconnect();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/message", messageRouter);

app.get("/", (req, res) => {
  return res.send("Hello");
});

server.listen(PORT, () => {
  console.log(`App is live on ${PORT}`);
});
