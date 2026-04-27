import { Router } from "express";
import { dealController } from "../controllers/offer.controller.js";

const router = Router();

router.route("/").get(dealController.listDeals);

router.route("/new").post(dealController.createDeal);

router.route("/update/:id").patch(dealController.updateDeal);

router.route("/:id").get(dealController.dealDetails);

router.route("/delete/:id").delete(dealController.deleteDeal);

export default router;