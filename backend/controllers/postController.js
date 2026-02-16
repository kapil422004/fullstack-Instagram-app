import sharp from "sharp";
import { Post } from "../models/postModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { User } from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image required!",
      });
    }

    const optimizeImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = getDataUri({
      originalname: image.originalname,
      buffer: optimizeImageBuffer,
    });
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      image: cloudResponse.secure_url,
      caption,
      author: authorId,
    });

    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      success: true,
      message: "Post uploaded.",
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "userName, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "userName, profilePicture" },
      });

    return res.status(200).json({
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const authorId = req.id;

    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "userName profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "userName profilePicture" },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likeOrDislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isAlreadyLiked = post.likes.includes(userId);

    if (isAlreadyLiked) {
      //dislike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      // post.likes.pull(userId); can use this also as i have already found post with findById but here need to use post.save()
      return res.status(200).json({
        success: true,
        message: "Disliked",
      });
    } else {
      //like
      await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
      return res.status(200).json({
        success: true,
        message: "Liked",
      });
    }

    //socket logic i wrote both like and dis like at one controller 2:53
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const authorId = req.id;
    const postId = req.params.id;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Field is empty!",
      });
    }
    //post check
    const postExist = await Post.findById(postId);

    if (!postExist) {
      return res.status(400).json({
        success: false,
        message: "Post not found!",
      });
    }

    const comment = await Comment.create({
      text,
      author: authorId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "profilePicture userName",
    });

    await Post.updateOne({ _id: postId }, { $push: { comments: comment._id } });
    return res.status(201).json({
      success: true,
      comment,
      message: "Comment added.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "userName  profilePicture",
    );

    if (!comments) {
      return res.status(400).json({
        success: false,
        message: "Comments not found for this post.",
      });
    }
    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.author.toString() !== authorId) {
      //to string because in db it will be in form of object
      return res.status(401).json({
        success: false,
        message: "Unanthorized",
      });
    }
    //remove post from postModel
    await Post.findByIdAndDelete(postId);

    //remove postid from userModel
    const user = await User.findById(authorId);

    user.posts = user.posts.filter((post) => post.toString() !== postId);

    await user.save();

    //remove comments of this post
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted succesfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkOrRemoveBookmark = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    // check post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //check user/ author
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isAlreadyBookmarked = user.bookmarks.includes(post._id);
    //remove
    if (isAlreadyBookmarked) {
      user.bookmarks.pull(post._id);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Removed from Bookmarks.",
      });
    } else {
      //add to bookmark
      user.bookmarks.push(post._id);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Bookmarked succesfully.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
