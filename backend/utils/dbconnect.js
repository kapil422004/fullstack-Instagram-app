import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

const dbconnect = async () => {
  try {
   await mongoose.connect(DB_URL);
    console.log("Mongodb connected.");
  } catch (error) {
    console.log(error);
  }
};

export default dbconnect