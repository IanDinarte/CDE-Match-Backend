import { Router } from "express";
import { upload } from "../../config/cloudinary.js";
import { memberApi } from "../../controllers/api/member.api.js";

const router = Router();

router.route("/").get(memberApi.listMembers);

router.route("/suggest").get(memberApi.listMemberSuggest);

router.route("/:id").get(memberApi.memberProfile);

router
  .route("/:id")
  .patch(upload.single("profilePicture"), memberApi.editMember);
router.route("/:id/password").patch(memberApi.changePassword);

router.route("/:id/deactivate").patch(memberApi.deactivateAccount);

router
  .route("/:id/business")
  .post(upload.single("logo"), memberApi.addBusiness);
router
  .route("/:id/business/:bid")
  .patch(upload.single("logo"), memberApi.editBusiness);
router.route("/:id/business/:bid").delete(memberApi.deleteBusiness);

export default router;
