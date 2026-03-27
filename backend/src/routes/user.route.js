import { Router } from "express";
import { Register, Login, Profile, EditProfile, DeleteProfile, Logout } from "../controllers/user.controller.js";

const router = Router();

router.route('/register').post(Register);

router.route('/login').post(Login);

router.route('/logout').post(Logout);

router.route('/profile/:id').get(Profile);

router.route('/edit/:id').patch(EditProfile);

router.route('/delete/:id').get(DeleteProfile);

export default router;