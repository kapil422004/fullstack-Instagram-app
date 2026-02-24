import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
axios.defaults.withCredentials = true;
const backendMessageUrl = import.meta.env.VITE_backendMessageUrl;

const useGetAllMessages = () => {
  const { selectedUser } = useSelector((store) => store.users);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchAllMessages = async () => {
      // console.log("Selected User ID:", selectedUser?._id);
      try {
        const res = await axios.get(
          backendMessageUrl + `/get-message/${selectedUser?._id}`,
        );

        if (res.data.success) {
          dispatch(setMessages(res.data.message));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessages();
  }, [selectedUser]);
};

export default useGetAllMessages;
