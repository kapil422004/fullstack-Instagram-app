import React, { useState } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/userSlice";
import { setPosts } from "@/redux/postSlice";
axios.defaults.withCredentials = true;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const backendUserUrl = import.meta.env.VITE_backendUserUrl;

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(backendUserUrl + "/login", {
        email,
        password,
      });

      if (res.data.success) {
        navigate('/')
        dispatch(setAuthUser(res.data.user))
        // dispatch(setPosts())
        console.log(res.data.user)
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.success(res.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center w-screen h-screen justify-center">
        <form
          onSubmit={loginHandler}
          className="shadow-lg flex flex-col gap-5 p-8 w-90"
        >
          <div className="my-4">
            <h1 className="text-center font-bold text-xl">LOGO</h1>
            <p className="text-center">
              Login to see everyday moments from your close friends.
            </p>
          </div>
          <div>
            <Label className="mx-1 font-medium">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-visible:ring-transparent my-2"
            />
          </div>
          <div>
            <Label className="mx-1 font-medium">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-visible:ring-transparent my-2"
            />
          </div>

          {loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit">Login</Button>
          )}

          <span className="text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup here.
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
