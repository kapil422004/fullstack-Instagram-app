import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbconnect from "./utils/dbconnect.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

const PORT = process.env.PORT;
const allowOrigin = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
    methods: ["POST", "PUT", "DELETE", "GET"],
  }),
);
app.use(express.json());
app.use(cookieParser());

dbconnect()

app.use("/api/v1/user", userRouter)

app.get(('/'),(req,res ) => {
  return res.send("Hello")
})

app.listen(PORT, () => {
  console.log(`App is live on ${PORT}`);
});
