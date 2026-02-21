import React from "react";
import Feed from "./feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPosts from "@/hooks/getAllPosts";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers.js";

const Home = () => {
  useGetAllPosts();    
  useGetSuggestedUsers();
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
