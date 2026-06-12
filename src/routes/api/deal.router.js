import { Router } from "express";
import { dealApi } from "../../controllers/api/deal.api.js";
import { authController } from "../../controllers/auth.controller.js";

const router = Router();

router.route("/").get(authController.protectApi, dealApi.listDeals);

router
  .route("/suggestion")
  .get(authController.protectApi, dealApi.suggestedDeals);

router
  .route("/suggestion")
  .post(authController.protectApi, dealApi.createSuggestion);

router.route("/suggestion/:id").delete(dealApi.rejectSuggestion);

router.route("/").post(authController.protectApi, dealApi.newDeal);

router.route("/match/:id").post(authController.protectApi, dealApi.match);

// router.route("/unmatch/:id").delete(authController.protectApi, dealApi.unMatch);

router.route("/:id").get(authController.protectApi, dealApi.dealDetails);

router.route("/:id").patch(dealApi.editDeal);

export default router;
