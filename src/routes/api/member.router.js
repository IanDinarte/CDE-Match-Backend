import { Router } from "express";
import { upload } from "../../config/cloudinary.js";
import { memberApi } from "../../controllers/api/member.api.js";
import { authController } from "../../controllers/auth.controller.js";

const router = Router();

// router.route("/").get(authController.protectApi, memberApi.listMembers);

router.route("/suggest").get(authController.protectApi, memberApi.listMembersSuggest);

// router.route("/me").get(authController.protectApi, memberApi.me);

router.route("/:id").get(authController.protectApi, memberApi.memberProfile);

router.route("/:id").patch(upload.single("profilePicture"), memberApi.editMember);

// router.route("/:id/edit").get();
// router.route("/:id").patch(upload.single("profilePicture"), );

// router.route("/:id").delete();

// router.route("/:id/business").get();
// router.route("/:id/business").post(upload.single("logo"), );
// router.route("/:id/business/:bid").get();
// router.route("/:id/business/:bid/edit").get();
// router.route("/:id/business/:bid").patch(upload.single("logo"), );
// router.route("/:id/business/:bid/delete").patch();

export default router;
