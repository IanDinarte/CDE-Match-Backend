import { Router } from "express";
import { adminController } from "../controllers/admin.controller";

const router = Router();

router.route("/create").post(adminController.register);

router.route("/admins").get(adminController.listAdmins);

router.route("/:id").get(adminController.adminProfile);

router.route("/edit/:id").patch(adminController.editAdmin);

router.route("/delete/:id").delete(adminController.deleteAdmin);

export default router;