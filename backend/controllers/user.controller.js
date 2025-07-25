import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

// @desc   Get all users
// @route  GET/api/users
// @access private (admin)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "member" }).select("-password");

  // Add task counts to each user
  const usersWithCounts = await Promise.all(users.map(async (user) => {
    const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
    const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
    const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

    return {
      ...user._doc, // Include all existing user data
      pendingTasks,
      inProgressTasks,
      completedTasks
    };
  }));
  res.status(200).json(usersWithCounts);
});

// @desc   Get user
// @route  GET/api/users/:id
// @access private
export const getUser = asyncHandler(async (req, res) => {
  const userInfo = req.user;
  const { id } = req.params;

  if (userInfo._id != id && userInfo.role !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to view this user`s details.");
  }

  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ succsess: true, data: user });
});

// @desc   Delete user
// @route  DELETE/api/users/:id
// @access private (admin)
export const deleteUser = asyncHandler(async (req, res) => {

});