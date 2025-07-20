import { leaderBoard } from "../controllers/leaderBoard";
import { Router } from "express";

const router = Router();

router.get("/leaderboard", leaderBoard);
export default router;
