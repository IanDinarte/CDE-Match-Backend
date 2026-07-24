import { Router } from "express";
import { authApi } from "../../controllers/api/auth.api.js";


const router = Router();

router.use("/login", authApi.login);

router.route("/resetPassword").post(authApi.resetPassword);

router.route("/resetPassword").patch(authApi.changePassword);

export default router