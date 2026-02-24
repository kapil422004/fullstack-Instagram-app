//js or jsx

import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const backendPostUrl = import.meta.env.VITE_backendPostUrl;

const useGetAllPosts = () => {
  const dispatch = useDispatch();

  // const { refresh } = useSelector((store) => store.posts);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get(backendPostUrl + "/get-all-post");
        if (res) {
          dispatch(setPosts(res.data.posts));
          console.log(res.data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPosts();
  }, []);
};

export default useGetAllPosts;
