import { setSuggestedUsers } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const backendUserUrl = import.meta.env.VITE_backendUserUrl;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(backendUserUrl + "/get-suggested-users");
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.suggestedUser));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, []);
};

export default useGetSuggestedUsers;
