import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socketio } = useSelector((store) => store.socketio);
  const { messages } = useSelector((store) => store.chats);

  useEffect(() => {
    //listen
    socketio?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...(messages || []), newMessage]));
    });

    return () => {
      socketio?.off("newMessage"); //will stop listning for event
    };
  }, [messages]);
};
export default useGetRTM;
