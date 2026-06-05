import { Router } from "express";
import { dealApi } from "../../controllers/api/deal.api.js";
import { authController } from "../../controllers/auth.controller.js";

const router = Router();

router.route("/").get(dealApi.listDeals);

router.route("/suggestion").get(authController.protectApi, dealApi.suggestedDeals);

// router.route("/new").get();
router.route("/").post(authController.protectApi, dealApi.newDeal);

router.route("/:id").get(dealApi.dealDetails);

router.route("/suggestion").post(authController.protectApi, dealApi.createSuggestion);

router.route("/suggestion/:id").delete(dealApi.rejectSuggestion);

router.route("/:id").patch(dealApi.editDeal);

// router.route("/:id/edit").get();

export default router;
