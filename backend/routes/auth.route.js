import { Router } from "express";
import {registerUser, getUserProfile, loginUser, updateUser} from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", protect, getUserProfile);
authRouter.put("/profile", protect, updateUser);

authRouter.post("/upload-image", upload.single("image"), (req, res) => {
  if(!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json(imageUrl);
});

export default authRouter;