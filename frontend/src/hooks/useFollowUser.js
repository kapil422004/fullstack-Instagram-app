import { setAuthUser, setUserProfile } from "@/redux/userSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useFollowUser = () => {
  const dispatch = useDispatch();
  const { authUser, userProfile } = useSelector((store) => store.users);
  const backendUserUrl = import.meta.env.VITE_backendUserUrl;

  const followUnfollow = async (targetUser) => {
    try {
      const res = await axios.post(
        backendUserUrl + `/follow-or-unfollow/${targetUser._id}`,
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const isFollowing = authUser.following.includes(targetUser._id);

        const updatedAuthUser = {
          ...authUser,
          following: isFollowing
            ? authUser.following.filter((id) => id !== targetUser._id)
            : [...authUser.following, targetUser._id],
        };

        dispatch(setAuthUser(updatedAuthUser));

        if (userProfile?._id === targetUser._id) {
          const updatedUserProfile = {
            ...userProfile,
            followers: isFollowing
              ? userProfile.followers.filter((id) => id !== authUser._id)
              : [...userProfile.followers, authUser._id],
          };

          dispatch(setUserProfile(updatedUserProfile));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { followUnfollow };
};

export default useFollowUser;
