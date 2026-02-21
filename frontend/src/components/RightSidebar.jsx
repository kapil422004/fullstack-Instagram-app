import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { authUser } = useSelector((store) => store.users);
  return (
    <div className="w-60 my-20 mr-10">
      <div className="w-60 flex items-start  gap-2 ">
        <Link to={`/profile/${authUser?._id}`}>
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={authUser?.profilePicture}
              alt="post_image"
            />
            <AvatarFallback>
              {authUser?.userName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${authUser?._id}`}>{authUser?.userName}</Link>
          </h1>
          <span className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
            {authUser?.bio}
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
