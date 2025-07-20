import { User } from "../models/Users";
import { ClaimRecord } from "../models/claimRecords";
import { Request, Response } from "express-serve-static-core";
import { io } from "../index";

export async function claimPoint(req: Request, res: Response) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // generate random points
    const points = Math.floor(Math.random() * 10) + 1;

    // update user point
    user.totalPoints += points;
    await user.save();
    io.emit("leaderboardUpdate");

    // Create claim history entry
    const history = await ClaimRecord.create({
      userId: user.userId,
      pointsClaimed: points,
    });

    res.json({
      success: true,
      awardedPoints: points,
      user: {
        id: user._id,
        name: user.name,
        totalPoints: user.totalPoints,
      },
      history,
    });
  } catch (error) {
    console.error("Claim Points Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
