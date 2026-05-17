import { Router } from "express";
import { dealController } from "../../controllers/deal.controller.js";

const router = Router();

router.route("/").get(dealController.listDeals);

router.route("/new").get(dealController.newDealPage);
router.route("/").post(dealController.newDeal);

router.route("/:id").get(dealController.dealDetails);

router.route("/:id/edit").get(dealController.editDealPage);
router.route("/:id").patch(dealController.editDeal);

router.route("/:id").delete(dealController.deleteDeal);

export default router;