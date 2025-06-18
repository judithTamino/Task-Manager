import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// Generate JWT Token
const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @desc Register a new user
// @route POST/api/auth/register
// @access public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, image, adminInviteToken } = req.body;

  if (!name || !email || !password) {
    const error = new Error("Missing details");
    error.status = 400;
    throw error;
  }

  // Check if a user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("User already exists");
    error.status = 400;
    throw error;
  }

  let role = "member";
  if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN)
    role = "admin";

  // Create new user
  const user = await User.create({ name, email, password, image, role });
  res.status(201).json({
    success: true, msg: "User created successfully", data: {
      token: generateToken(user._id),
      user: user
    }
  });
});

// @desc Login user
// @route POST/api/auth/login
// @access public
export const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw new error;
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw new error;
  }

  // Return data with jwt
  res.status(200).json({
    success: true,
    msg: "User logedin successfully",
    data: {
      token: generateToken(user._id),
      user: user
    }
  });

});

// @desc Get user profile
// @route GET/api/auth/profile
// @access private (requires jwt)
export const getUserProfile = asyncHandler(async (req, res) => {
  console.log("hello")
  const user = await User.findById(req.user.id).select("-password");
  console.log(user);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw new error;
  }

  res.status(200).json(user);
});

// @desc Update user profile
// @route PUT/api/auth/profile
// @access private (requires jwt)
// export const updateUser = asyncHandler(async (req, res, next) => { });