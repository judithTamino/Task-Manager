import { Router } from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js"
import { createTask, deleteTask, getDashboard, getTask, getTasks, getUserDashboard, updateTask, updateTaskChecklist, updateTaskStatus } from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.get("/dashboard", protect, adminOnly, getDashboard);
taskRouter.get("/dashboard/user", protect, getUserDashboard);
taskRouter.get("/", protect, getTasks); // Get tasks => admin - all, user - assigned
taskRouter.get("/:id", protect, getTask); // Get task by id
taskRouter.post("/", protect, adminOnly, createTask); // Create task => admin
taskRouter.put("/:id", protect, updateTask) // Update task details
taskRouter.delete("/:id", protect, adminOnly, deleteTask) // Delete task
taskRouter.put("/:id/status", protect, updateTaskStatus); // Update task status
taskRouter.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist

export default taskRouter;