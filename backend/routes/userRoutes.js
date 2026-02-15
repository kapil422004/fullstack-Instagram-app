import express from "express"
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/userController.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js"


const userRouter = express.Router()

userRouter.post("/signup", register)
userRouter.post("/login", login)
userRouter.get("/logout", logout)
userRouter.get("/get-profile/:id", isAuthenticated ,getProfile)
userRouter.post("/edit-profile", isAuthenticated , upload.single("profilePicture"),editProfile)
userRouter.get("/get-suggested-users",isAuthenticated, getSuggestedUsers)
userRouter.post("/follow-or-unfollow/:id",isAuthenticated, followOrUnfollow)

export default userRouter