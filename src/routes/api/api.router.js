import { Router } from "express";

import memberRouter from "./member.router.js";
import dealRouter from "./deal.router.js";
import authRouter from "./auth.router.js";
import { authController } from "../../controllers/auth.controller.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/member", authController.protectApi, memberRouter); // /api/member/
router.use("/deal", authController.protectApi, dealRouter); // /api/deal/

export default router;
