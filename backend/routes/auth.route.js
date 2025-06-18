import { Router } from "express";
import {registerUser, getUserProfile, loginUser} from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", protect, getUserProfile);
// authRouter.put("/profile", protect, updateUser);

export default authRouter;