import { Router } from "express";
import { authApi } from "../../controllers/api/auth.api.js";


const router = Router();

router.use("/login", authApi.login);

export default router