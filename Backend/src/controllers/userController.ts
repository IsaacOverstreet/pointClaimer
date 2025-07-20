import { Request, Response } from "express-serve-static-core";
import { IUser, User } from "../models/Users";
import { v4 as uuid } from "uuid";

// POST /api/users - Create user
export async function createUser(req: Request, res: Response) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  //  Check if name exists
  const existingUser = await User.findOne({ name });
  if (existingUser) {
    return res.status(409).json({ error: "User name already exists" });
  }

  const user = await User.create({
    userId: uuid(),
    name,
    totalPoints: 0,
  });

  res.status(201).json(user);
}

// GET /api/users - List all users
export async function getUsers(req: Request, res: Response) {
  try {
    const users: IUser[] = await User.find();

    res.json(users);
  } catch (error) {
    console.error(" Error fetching users:", error);

    res.status(503).json({
      success: false,
      error: "Database connection failed",
      message: "Could not connect to MongoDB Atlas.",
    });

    res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to fetch users",
    });
  }
}
