import { Router } from "express";
import { memberController } from "../../../controllers/member.controller.js";
import { upload } from "../../../config/cloudinary.js";

const router = Router();

router.route("/").get(memberController.listMembers);

router.route("/new").get(memberController.newMemberPage);
router.route("/").post(upload.single("profilePicture"), memberController.newMember);

router.route("/:id").get(memberController.memberProfile);

router.route("/:id/edit").get(memberController.editMemberPage);
router.route("/:id").patch(upload.single("profilePicture"), memberController.editMember);

router.route("/:id").delete(memberController.deleteMember);

router.route("/:id/business").get(memberController.newBusinessPage);
router.route("/:id/business").post(upload.single("logo"), memberController.newBusiness);
router.route("/:id/business/:bid").get(memberController.businessDetails);
router.route("/:id/business/:bid/edit").get(memberController.editBusinessPage);
router.route("/:id/business/:bid").patch(upload.single("logo"), memberController.editBusiness);
router.route("/:id/business/:bid/delete").patch(memberController.deleteBusiness);

export default router;
