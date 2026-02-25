import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.posts);
  const { authUser } = useSelector((store) => store.users);

  return (
    <div>
      {posts
        .filter(
          (post) =>
            authUser.following.includes(post.author._id) ||
            post?.author?._id === authUser?._id,
        )
        .map((post) => (
          <Post key={post?._id} post={post} />
        ))}
    </div>
  );
};

export default Posts;
