import { Router } from "express";
import { memberController } from "../../controllers/member.controller.js";

const router = Router();

router.route("/").get(memberController.listMembers);

router.route("/new").get(memberController.newMemberPage);
router.route("/").post(memberController.newMember);

router.route("/:id").get(memberController.memberProfile);

router.route("/:id/edit").get(memberController.editMemberPage);
router.route("/:id").patch(memberController.editMember);

router.route("/:id").delete(memberController.deleteMember);

export default router;
