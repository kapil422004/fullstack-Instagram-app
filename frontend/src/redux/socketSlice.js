import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name:"socket",
    initialState:{
        socketio:null
    },
    reducers:{
        // actions
        setSocket:(state,action) => {
            state.socketio = action.payload;
        }
    }
});
export const {setSocket} = socketSlice.actions;
export default socketSlice.reducer;