import { Router } from "express";

import accountManagerRouter from "./account_management/accounts_management.router.js"
import dealManagerRouter from "./deal_manager.router.js"

const router = Router();

router.use('/manage-accounts', accountManagerRouter);
router.use('/manage-deals', dealManagerRouter);

export default router;