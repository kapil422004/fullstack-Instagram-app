import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    refresh: false,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setRefresh: (state) => {
      state.refresh = !state.refresh;
    },
  },
});

export const { setPosts, setRefresh } = postSlice.actions;
export default postSlice.reducer;
