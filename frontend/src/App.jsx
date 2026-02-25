import React, { useEffect } from "react";
import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import axios from "axios";
import Home from "./components/Home";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/userSlice.js";
import { setSocket } from "./redux/socketSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotFound from "./components/NotFound";
axios.defaults.withCredentials = true;

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: `/profile/:id`,
        element: <Profile />,
      },
      {
        path: `/account/edit`,
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((store) => store.users);
  const backendUrl = import.meta.env.VITE_backendUrl;

  useEffect(() => {
    if (!authUser?._id) return;
    const socketio = io(backendUrl);

    dispatch(setSocket(socketio));

    //send user id
    socketio.emit("add_user", authUser?._id);
    //listen
    socketio.on("getOnlineUsers", (onlineUsers) => {
      //add online user in redux
      dispatch(setOnlineUsers(onlineUsers));
    });

    return () => {
      socketio.close();
    };
  }, [authUser]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
};

export default App;
