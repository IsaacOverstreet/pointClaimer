import { Schema, model, models } from "mongoose";

export interface IUser {
  userId: string;
  name: string;
  totalPoints: number;
}

const userSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
