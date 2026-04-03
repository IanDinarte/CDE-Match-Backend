import { Router } from "express";
import { memberController } from "../../controllers/member.controller.js";

const router = Router();

router.route("/").get(memberController.listMembers);

router.route("/new").post(memberController.newMember);

router.route("/login").post(memberController.login);

router.route("/logout").post(memberController.logout);

router.route("/profile/:id").get(memberController.profile);

router.route("/edit/:id").patch(memberController.editProfile);

router.route("/delete/:id").get(memberController.deleteProfile);

export default router;
