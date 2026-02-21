import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/userSlice";
import CreatePost from "./CreatePost";

const LeftSidebar = () => {
  const backendUserUrl = import.meta.env.VITE_backendUserUrl;
  const navigate = useNavigate();
  const { authUser } = useSelector((store) => store.users);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(backendUserUrl + "/logout");
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAuthUser(null));
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.success);
    }
  };

  const sidebarHandler = (text) => {
    if (text === "Logout") {
      logoutHandler();
    } else if (text === "Create") {
      setOpen(true);
    }else if (text === "Profile") {
      navigate(`/profile/${authUser?._id}`)
    }else if (text === "Home") {
      navigate("/")
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Message" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar>
          <AvatarImage
            src={authUser?.profilePicture}
            className="object-cover"
          />
          <AvatarFallback>
            {" "}
            {authUser?.userName?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">Logo</h1>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span> {item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen}/>
    </div>
  );
};

export default LeftSidebar;
