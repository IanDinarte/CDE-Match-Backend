import { Router } from "express";
import { dealApi } from "../../controllers/api/deal.api.js";

const router = Router();

router.route("/").get(dealApi.listDeals);

router.route("/suggestion").get(dealApi.suggestedDeals);

router.route("/suggestion").post(dealApi.createSuggestion);

router.route("/suggestion/:id").delete(dealApi.rejectSuggestion);

router.route("/").post(dealApi.newDeal);

router.route("/:id").delete(dealApi.deleteDeal);

router.route("/match/:id").post(dealApi.match);

router.route("/:id").get(dealApi.dealDetails);

router.route("/:id").patch(dealApi.editDeal);


export default router;
