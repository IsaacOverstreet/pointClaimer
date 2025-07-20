import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
let isConnected = false;

export async function connectMongoDb() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.DB_URI as string);
    isConnected = true;
  } catch (error) {
    console.log("mongoDb connection error", error);
    throw error;
  }
}
