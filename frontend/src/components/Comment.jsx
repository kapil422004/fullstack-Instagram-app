// import { Avatar } from 'radix-ui'
import React from "react";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";

const Comment = ({ comment }) => {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage
            className="object-cover"
            src={comment?.author?.profilePicture}
          />
          <AvatarFallback>
            {comment?.author?.userName[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="font-bold text-sm">{comment?.author?.userName}</h1>
        <span className="font-normal pl-1">{comment?.text}</span>
      </div>
      <hr className="w-full mt-2 border-t border-gray-200 " />
    </div>
  );
};

export default Comment;
