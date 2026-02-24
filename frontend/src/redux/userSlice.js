import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser:null,
    onlineUsers:[]
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    }
  },
});

export const { setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUser, setOnlineUsers } = userSlice.actions;
export default userSlice.reducer;
