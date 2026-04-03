import { Router } from "express";

import adminManagerRouter from "./admin_manager.router.js"
import memberManagerRouter from "./member_manager.router.js"

const router = Router();

router.use("/admin", adminManagerRouter);
router.use("/member", memberManagerRouter);

export default router;
