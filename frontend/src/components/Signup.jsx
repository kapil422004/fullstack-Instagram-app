import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import Login from "./Login";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
axios.defaults.withCredentials = true;

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const backendUserUrl = import.meta.env.VITE_backendUserUrl;

  const signupHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(backendUserUrl + "/signup", {
        userName,
        email,
        password,
      });
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login")
        setUserName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8 w-90"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-center">
            Sign up to see everyday moments from your close friends.
          </p>
        </div>
        <div>
          <Label className="mx-1 font-medium">Username</Label>
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="focus-visible:ring-transparent my-2"
          />
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
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login here.
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
