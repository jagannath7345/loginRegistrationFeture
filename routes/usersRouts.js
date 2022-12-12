import express from "express";
const router = express.Router();
import UserController from "../controller/UserController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

router.use("/changepassword", checkUserAuth);

router.post("/register", UserController.userRegstration);
router.post("/login", UserController.userLogin);
router.post("/changepassword", UserController.changePassword);

export default router;
