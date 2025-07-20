import express from "express";

import { claimPoint } from "../controllers/claimPoints";

const router = express.Router();

router.post("/claim", claimPoint);

export default router;
