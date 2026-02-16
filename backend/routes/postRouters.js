import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  addComment,
  addNewPost,
  bookmarkOrRemoveBookmark,
  deletePost,
  getAllPost,
  getCommentsOfPost,
  getUserPosts,
  likeOrDislikePost,
} from "../controllers/postController.js";
import upload from "../middlewares/multer.js";

const postRouter = express.Router();

postRouter.post("/add-new-post", isAuthenticated, upload.single("image"), addNewPost);
postRouter.get("/get-all-post", isAuthenticated, getAllPost);
postRouter.get("/get-user-posts", isAuthenticated, getUserPosts);
postRouter.put("/like-or-dislike-post/:id", isAuthenticated, likeOrDislikePost);
postRouter.post("/add-comment/:id", isAuthenticated, addComment);
postRouter.get("/get-comments-of-post/:id", isAuthenticated, getCommentsOfPost);
postRouter.delete("/delete-post/:id", isAuthenticated, deletePost);
postRouter.put("/bookmark-or-remove-bookmark/:id", isAuthenticated,
  bookmarkOrRemoveBookmark,
);

export default postRouter;
