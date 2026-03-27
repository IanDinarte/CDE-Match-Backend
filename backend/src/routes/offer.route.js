import { Router } from "express";
import { CreateOffer } from "../controllers/offer.controller.js";
import { ListOffers } from "../controllers/offer.controller.js";
import { UpdateOffer } from "../controllers/offer.controller.js";
import { DeleteOffer } from "../controllers/offer.controller.js";
import { OfferDetails } from "../controllers/offer.controller.js";

const router = Router();

router.route("/create").post(CreateOffer);

router.route("/offers").get(ListOffers);

router.route("/update/:id").patch(UpdateOffer);

router.route("/offer/:id").get(OfferDetails);

router.route("/delete/:id").delete(DeleteOffer);

export default router;
