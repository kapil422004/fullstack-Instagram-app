import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessages from "@/hooks/useGetAllMessages";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetAllMessages();
  useGetRTM();
  const { authUser } = useSelector((store) => store.users);
  const { messages } = useSelector((store) => store.chats);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20 ">
            <AvatarImage
              className="object-cover"
              src={selectedUser?.profilePicture || null}
              alt="profile"
            />
            <AvatarFallback className="text-5xl ">
              {selectedUser?.userName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{selectedUser?.userName}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            return (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === authUser._id ? "justify-end" : ""}`}
              >
                <div
                  ref={bottomRef}
                  className={`p-2 rounded-lg max-w-xs wrap-break-word ${msg.senderId === authUser._id ? "bg-blue-500 text-white" : "bg-gray-200"} `}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
