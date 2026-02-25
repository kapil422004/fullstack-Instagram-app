import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import { setSelectedUser } from "@/redux/userSlice";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
axios.defaults.withCredentials = true;

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { authUser, suggestedUsers, selectedUser, onlineUsers } = useSelector(
    (store) => store.users,
  );
  const { messages } = useSelector((store) => store.chats);
  const dispatch = useDispatch();
  const backendMessageUrl = import.meta.env.VITE_backendMessageUrl;
  // const isOnline = true

  // console.log(selectedUser);

  const sendMessageHandler = async (selectedUserId) => {
    try {
      const res = await axios.post(
        backendMessageUrl + `/send-message/${selectedUserId}`,
        { textMessage },
      );
      // console.log(res)
      if (res.data.success) {
        dispatch(setMessages([...(messages || []), res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(""));
    };
  }, []);

  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{authUser?.userName}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    className="object-cover"
                    src={suggestedUser?.profilePicture}
                  />
                  <AvatarFallback>
                    {suggestedUser?.userName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.userName}</span>
                  <span
                    className={`text-xs font-bold ${isOnline ? "text-green-600" : "text-red-600"} `}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage
                className="object-cover"
                src={selectedUser?.profilePicture || undefined}
                alt="profile"
              />
              <AvatarFallback>
                    {selectedUser?.userName?.[0]?.toUpperCase()}
                

              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.userName}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages..."
            />
            <Button
              disabled={!textMessage.trim()}
              onClick={() => sendMessageHandler(selectedUser?._id)}
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4 " />
          <h1 className="font-medium">Your messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
