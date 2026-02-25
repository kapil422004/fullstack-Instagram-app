import React, { useState } from "react";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Badge,
  BadgeCheck,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
// import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import CommentDialog from "./ui/CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import { setAuthUser } from "@/redux/userSlice";
import useFollowUser from "@/hooks/useFollowUser";

const Post = ({ post }) => {
  if (!post) return null;
  const [open, setOpen] = useState(false);
  const { authUser } = useSelector((store) => store.users);
  const backendPostUrl = import.meta.env.VITE_backendPostUrl;
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const { posts } = useSelector((store) => store.posts);
  const { followUnfollow } = useFollowUser();
  const isFollowing = authUser?.following?.includes(post?.author?._id);

  // console.log(authUser) //authusr
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        backendPostUrl + `/delete-post/${post?._id}`,
      );
      if (res.data.success) {
        toast.success(res.data.message);
        const updatePost = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatePost));
        // dispatch(setRefresh());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const res = await axios.put(
        backendPostUrl + `/like-or-dislike-post/${post._id}`,
      );
      toast.success(res.data.message);

      const alreadyLiked = post?.likes?.includes(authUser?._id);
      const updatedPost = posts.map((p) => {
        if (p._id !== post._id) return p;

        const likes = alreadyLiked
          ? p.likes.filter((id) => id !== authUser._id)
          : [...p.likes, authUser._id];

        return { ...p, likes };
      });

      dispatch(setPosts(updatedPost));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.put(
        backendPostUrl + `/bookmark-or-remove-bookmark/${post._id}`,
      );
      if (res.data.success) {
        toast.success(res.data.message);

        const alreadyBookmarked = authUser?.bookmarks?.includes(post?._id);

        const updatedBookmarks = alreadyBookmarked
          ? authUser.bookmarks.filter((id) => id !== post._id)
          : [...authUser.bookmarks, post._id];

        dispatch(setAuthUser({ ...authUser, bookmarks: updatedBookmarks }));
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        setText("");
        const updatePost = posts.map((p) => {
          return post._id === p._id
            ? {
                ...p,
                comments: [...p.comments, res.data.comment],
              }
            : p;
        });
        // dispatch(setRefresh());
        dispatch(setPosts(updatePost));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post.author?.profilePicture}
              alt="post_image"
              className="object-cover"
            />
            <AvatarFallback>
              {post?.author?.userName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1>{post.author.userName}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="w-[300px] flex flex-col items-center text-sm text-center gap-3 py-5">
            {post?.author._id !== authUser?._id && (
              <>
                <div
                  onClick={() => followUnfollow(post?.author)}
                  variant="ghost"
                  className="cursor-pointer w-fit text-[#ED4956]     font-bold"
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </div>
                <hr className="w-full border-t border-gray-200 " />
              </>
            )}
            <div variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </div>

            {authUser?._id === post?.author._id && (
              <>
                <hr className="w-full border-t border-gray-200 " />
                <div
                  onClick={deletePostHandler}
                  variant="ghost"
                  className="cursor-pointer w-fit"
                >
                  Delete
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between mt-3">
        <div className=" flex items-center gap-3">
          {post?.likes?.includes(authUser?._id) ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"24px"}
              className="cursor-pointer text-[#e32d2d]"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={"24px"}
              className="cursor-pointer"
            />
          )}
          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        {authUser?.bookmarks?.includes(post?._id) ? (
          <GoBookmarkFill
            onClick={bookmarkHandler}
            size={"24px"}
            className="cursor-pointer hover:text-gray-600"
          />
        ) : (
          <GoBookmark
            onClick={bookmarkHandler}
            size={"24px"}
            className="cursor-pointer hover:text-gray-600"
          />
        )}
      </div>
      <span className="font-medium block mb-1 mt-2">
        {post.likes.length} likes
      </span>
      <p>
        <span className="font-medium ">{post.author.userName} </span>
        {post.caption}
      </p>

      {post.comments.length > 0 && (
        <span
          className="cursor-pointer text-sm text-gray-500 font-semibold "
          onClick={() => setOpen(true)}
        >
          View all {post.comments.length} comments
        </span>
      )}

      <CommentDialog post={post} open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          value={text}
          onChange={changeEventHandler}
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        <span
          onClick={addCommentHandler}
          className="text-[#3BADF8] font-semibold cursor-pointer"
        >
          Post
        </span>
      </div>
    </div>
  );
};

export default Post;
