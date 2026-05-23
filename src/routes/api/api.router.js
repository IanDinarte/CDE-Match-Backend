import { Router } from "express";

import memberRouter from "./member.router.js";
import dealRouter from "./deal.router.js";
import authRouter from "./auth.router.js";

const router = Router();

router.use("/member", memberRouter); // /api/member/
router.use("/deal", dealRouter); // /api/deal/
router.use("/auth", authRouter);

export default router;
