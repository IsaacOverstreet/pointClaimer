import { User } from "../models/Users";
import { Request, Response } from "express-serve-static-core";

export async function leaderBoard(req: Request, res: Response) {
  try {
    const io = req.app.get("io");
    const users = await User.find().sort({ totalPoints: -1 });

    const ranking = users.map((user, i) => ({
      id: user.userId,
      name: user.name,
      totalPoints: user.totalPoints,
      rank: i + 1,
    }));

    io.emit("leaderboardUpdate", ranking);

    res.status(200).json({ success: true, data: ranking });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}
