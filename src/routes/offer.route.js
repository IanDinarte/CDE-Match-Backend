import { Router } from "express";
import { offerController } from "../controllers/offer.controller.js";

const router = Router();

router.route("/create").post(offerController.createOffer);

router.route("/offers").get(offerController.listOffers);

router.route("/update/:id").patch(offerController.updateOffer);

router.route("/:id").get(offerController.offerDetails);

router.route("/delete/:id").delete(offerController.deleteOffer);

export default router;
