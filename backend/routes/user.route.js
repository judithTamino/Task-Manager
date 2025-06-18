import {Router} from "express";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";
import { deleteUser, getUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", protect, adminOnly, getUsers);
userRouter.get("/:id", protect, getUser);
userRouter.delete("/:id", protect, adminOnly, deleteUser);

export default userRouter;