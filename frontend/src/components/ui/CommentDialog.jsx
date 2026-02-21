import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setRefresh } from "@/redux/postSlice";
import Comment from "../Comment";

const CommentDialog = ({ post, open, setOpen }) => {
  const [text, setText] = useState("");
  const { authUser } = useSelector((store) => store.users);
  const { posts } = useSelector((store) => store.posts);
  const dispatch = useDispatch();
  const backendPostUrl = import.meta.env.VITE_backendPostUrl;

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const addCommentHandler = async () => {
    // console.log("clicked")
    try {
      const res = await axios.post(
        backendPostUrl + `/add-comment/${post._id}`,
        { text },
      );
      if (res.data.success) {
        console.log(res);
        toast.success(res.data.message);
        // setOpen(false)
        setText("");
        const updatePost = posts.map((p) => {
          return p._id === post._id
            ? {
                ...p,
                comments: [...p.comments, res.data.comment],
              }
            : p;
        });
        dispatch(setPosts(updatePost));
        // dispatch(setRefresh());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={post.image}
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={authUser?.profilePicture}
                      className="object-cover"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="text-md ">{authUser?.userName} </Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="w-60 flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <hr className="w-full border-t border-gray-200 " />

                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {post?.comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1">
                <input
                  value={text}
                  onChange={changeEventHandler}
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full outline-none border border-gray-300 p-1 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={addCommentHandler}
                  variant="outline"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
