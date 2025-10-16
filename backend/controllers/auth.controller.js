import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// Generate JWT Token
const generateToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @desc   Register a new user
// @route  POST/api/auth/register
// @access public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, image, adminInviteToken } = req.body;
  console.log(req.body);

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Missing details.");
  }

  // Check if a user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  let role = "member";
  if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN)
    role = "admin";

  // Create new user
  const user = await User.create({ name, email, password, image, role });
  res.status(201).json(user);
});

// @desc   Login user
// @route  POST/api/auth/login
// @access public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const accessToken = generateToken(user);

  // Return data with jwt
  res.status(200).json({ success: true, token: accessToken });
});

// @desc   Get user profile
// @route  GET/api/auth/profile
// @access private (requires jwt)
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

// @desc   Update user profile
// @route  PUT/api/auth/profile
// @access private (requires jwt)
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.password = req.body.password || user.password;

  // if(req.body.password) {
  //   const salt = await bcrypt.genSalt(10);
  //   user.password = await bcrypt.hash(req.body.password, salt);
  // }

  const updatedUser = await user.save();
  res.json(updatedUser);
});