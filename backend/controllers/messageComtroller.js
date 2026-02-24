import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReciverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage: message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message field is empty.",
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    //socket implementation
    const receiverSocketId = getReciverSocketId(receiverId);
    // console.log(receiverSocketId);
    io.to(receiverSocketId).emit("newMessage", newMessage)

    return res.status(200).json({
      newMessage,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: "[]",
      });
    }

    return res.status(200).json({
      success: true,
      message: conversation?.messages || [],
    });
  } catch (error) {
    console.log(error);
  }
};
