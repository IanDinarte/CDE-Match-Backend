import { Router } from "express";
import { dealApi } from "../../controllers/api/deal.api.js";
import { authController } from "../../controllers/auth.controller.js";

const router = Router();

router.route("/").get(dealApi.listDeals);

router.route("/suggested").get(authController.protectApi, dealApi.suggestedDeals);

// router.route("/new").get();
// router.route("/").post();

router.route("/:id").get(dealApi.dealDetails);


// router.route("/:id/edit").get();
// router.route("/:id").patch();

// router.route("/:id").delete();

export default router;
