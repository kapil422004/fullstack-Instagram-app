import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/postModel.js";

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const checkUserName = await User.findOne({ userName });

    if (checkUserName) {
      return res.status(400).json({
        success: false,
        message: "User name is already taken!",
      });
    }

    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered!",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      userName,
      email,
      password: hashPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    let user = await User.findOne({ email }).populate("posts");
    // console.log(user)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered.",
      });
    }


    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect!",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });


    user = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      //   bookmarks:user.bookmarks

    }

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.userName}`,
      user
    });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", {
        maxAge: 0,
      })
      .json({
        success: true,
        message: "Logged out!",
      });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    
    //id from middleware
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated.",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const loggedinUserId = req.id; //from middleware

    const suggestedUser = await User.find({
      _id: { $ne: loggedinUserId },
    }).select("-password");

    if (suggestedUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Currently do not have any suggested user.",
      });
    }

    return res.status(200).json({
      suggestedUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const targetUserID = req.params.id; //params to whom we are following
    const loggedinUserID = req.id; // middleware

    const loggedinUser = await User.findById(loggedinUserID);
    const targetUser = await User.findById(targetUserID);

    const isFollowing = loggedinUser.following.includes(targetUserID);

    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: loggedinUserID },
          { $pull: { following: targetUserID } },
        ),
        User.updateOne(
          { _id: targetUserID },
          { $pull: { followers: loggedinUserID } },
        ),
      ]);

      return res.status(200).json({
        success: true,
        message: "Unfollowed succesfully.",
      });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: loggedinUserID },
          { $push: { following: targetUserID } },
        ),
        User.updateOne(
          { _id: targetUserID },
          { $push: { followers: loggedinUserID } },
        ),
      ]);
      return res.status(200).json({
        success: true,
        message: "Followed succesfully.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
