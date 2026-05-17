import { Router } from "express";

import memberRouter from "./member.router.js";
import dealRouter from "./deal.router.js";

const router = Router();

router.use('/member', memberRouter); // /api/member/
router.use('/deal', dealRouter); // /api/deal/

export default router;