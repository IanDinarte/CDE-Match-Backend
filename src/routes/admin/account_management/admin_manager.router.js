import { Router } from "express";
import { adminController } from "../../../controllers/admin.controller.js";

const router = Router();

router.route("/").get(adminController.listAdmins);

//criar admin
router.route("/new").get(adminController.newAdminPage);
router.route("/").post(adminController.newAdmin)

router.route("/:id").get(adminController.adminProfile);

//editar admin
router.route("/:id/edit").get(adminController.editAdminPage);
router.route("/:id").patch(adminController.editAdmin);

router.route("/:id").delete(adminController.deleteAdmin);

export default router;
