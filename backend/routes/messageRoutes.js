import express from "express";
import { getMessage, sendMessage } from "../controllers/messageComtroller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const messageRouter = express.Router();

messageRouter.post("/send-message/:id", isAuthenticated, sendMessage);
messageRouter.get("/get-message/:id", isAuthenticated, getMessage);

export default messageRouter;
