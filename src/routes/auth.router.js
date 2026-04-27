import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

const router = Router();

router.route("/login").get(authController.loginPage);
router.route("/login").post(authController.login);

// router.route("/register").get(authController.registerPage);
// router.route("/").post(authController.register);

router.route("/logout").get(authController.logout);

export default router;
