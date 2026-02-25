import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: ["http://localhost:5173"],
  methods: ["GET", "POST"],
});

const userMap = {}; //sotre socketId:userId

export const getReciverSocketId = (receiverId) => {
  return userMap[receiverId];
};

//listen
io.on("connection", (socket) => {
  console.log(`User is connected:${socket.id}`);

  //listen
  socket.on("add_user", (userId) => {
    if (userId) {
      console.log(`UserId = ${userId}`);
      socket.userId = userId;
      userMap[userId] = socket.id;
      //send online user,s userId
      io.emit("getOnlineUsers", Object.keys(userMap));
    }
  });

  //listen
  socket.on("disconnect", () => {
    delete userMap[socket.userId];
    //sending
    io.emit("getOnlineUsers", Object.keys(userMap));
  });
});

export { io, app, server };
