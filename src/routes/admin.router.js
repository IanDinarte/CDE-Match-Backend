import { Router } from "express";

import accountManagerRouter from "./account_management/accounts_management.router.js"
import offerManagerRouter from "./offer_manager.router.js"

const router = Router();

router.use('/manage-accounts', accountManagerRouter);
router.use('/manage-offers', offerManagerRouter);

export default router;