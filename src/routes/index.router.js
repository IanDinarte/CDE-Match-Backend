import { Router } from "express";
import { indexController } from "../controllers/index.controller.js";

const router = Router();

router.route("/").get(indexController.homePage);

export default router;
