import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const backendPostUrl = import.meta.env.VITE_backendPostUrl;
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.posts);

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(backendPostUrl + "/add-new-post", formData, {
        headers: {
          "content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        setOpen(false);
        setFile("");
        setCaption("");
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-bold">
          Create new post.
        </DialogHeader>
        <div>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
          />
          <Input
            type="file"
            onChange={fileChangeHandler}
            className="w-50 mx-auto bg-[#dedede] hover:bg-[#c5c5c5] cursor-pointer mt-5 flex justify-center border-black "
          />
        </div>

        <Button
          disabled={!file || loading}
          onClick={createPostHandler}
          type="submit"
          className="cursor-pointer bg-[#0095F6] hover:bg-[#0182d9] font-bold"
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
