import Task from "../models/task.model.js";
import asyncHandler from "express-async-handler";

// @desc   Get tasks
// @route  GET/api/tasks
// @access private
export const getTasks = asyncHandler(async (req, res) => {
  const { status } = req.query;
  let filter = {};

  if (status) filter.status = status;

  let tasks;
  if (req.user.role === "admin")
    tasks = await Task.find(filter).populate("assignedTo", "name email image");
  else
    tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate("assignedTo", "name email image");

  // Add completed todoChecklist count to each task
  tasks = await Promise.all(tasks.map(async (task) => {
    const completedCount = task.todoCheckList.filter(item => item.completed).length;
    return { ...task._doc, completedTodoCount: completedCount };
  }));

  // Status summary counts
  const allTasks = await Task.countDocuments(req.user.role === "admin" ? {} : { assignedTo: req.user._id });

  const pendingTasks = await Task.countDocuments({
    ...filter,
    status: "Pending",
    ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
  });

  const inProgressTasks = await Task.countDocuments({
    ...filter,
    status: "In Progress",
    ...(req.user.role !== "admin" && { assignedTo: req.user._id })
  });

  const completedTasks = await Task.countDocuments({
    ...filter,
    status: "Completed",
    ...(req.user.role !== "admin" && { assignedTo: req.user._id })
  });

  res.json({
    tasks, statusSummary: {
      all: allTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
    }
  });
});

// @desc   Get task by ID
// @route  GET/api/tasks/:id
// @access private
export const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate("assignedTo", "name email image");
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json({ succsses: true, data: task });
});

// @desc   Create new task
// @route  POST/api/tasks
// @access admin
export const createTask = asyncHandler(async (req, res) => {
  const { title, dueDate, assignedTo } = req.body;
  if (!Array.isArray(assignedTo)) {
    res.status(400);
    throw new Error("assignedTo must be an array of user IDs");
  }

  if (!title || !dueDate) {
    res.status(400);
    throw new Error("Missing details.");
  }

  const task = await Task.create(req.body);
  res.status(201).json({ succsses: true, data: task });
});

// @desc   Update task
// @route  PUT/api/tasks/:id
// @access private
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate || task.dueDate;
  task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
  task.attachments = req.body.attachments || task.attachments;

  if (req.body.assignedTo) {
    if (!Array.isArray(req.body.assignedTo)) {
      res.status(400);
      throw new Error("assignedTo must be an array of user IDs");
    }

    task.assignedTo = req.body.assignedTo;
  }

  const updatedTask = await task.save();
  res.status(200).json({ succsses: true, data: updatedTask });
});

// @desc   Delete task
// @route  DELETE/api/tasks/:id
// @access admin
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();
  res.status(200).json({ succsses: true, msg: "Task deleted" });
});

// @desc   Update task status
// @route  PUT/api/tasks/:id/status
// @access private
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const isAssigned = task.assignedTo.some(userId => userId.toString() === req.user._id.toString());

  if (isAssigned && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  task.status = req.body.status || task.status;
  if (task.status === "Completed") {
    task.todoCheckList.forEach(item => item.completed = true);
    task.progress = 100;
  }

  await task.save();
  res.status(200).json({ succsses: true, msg: "Task status updated", data: task });
});

// @desc   Update task checklist
// @route  PUT/api/tasks/:id/todo
// @access private
export const updateTaskChecklist = asyncHandler(async (req, res) => {
  const { todoCheckList } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update checklist");
  }

  task.todoCheckList = todoCheckList; // Replace with updated checklist

  // Auto-update progress based on checklist completion
  const completedCount = task.todoCheckList.filter(item => item.completed).length;
  const totalItems = task.todoCheckList.length;
  task.progress = totalItems > 0 ? Math.round(completedCount / totalItems * 100) : 0;

  // Auto-mark task as completed if all are checked
  if (task.progress === 100)
    task.status = "Completed";
  else if (task.progress > 0)
    task.status = "In Progress";
  else
    task.status = "Pending";

  await task.save();
  const updatedTask = await Task.findById(req.params.id).populate("assignedTo", "name email image");

  res.json({ succsses: true, msg: "Task chacklist updated", data: updatedTask })
});

// @desc   Dashboard Data
// @route  GET/api/tasks/dashboard
// @access admin
export const getDashboard = asyncHandler(async (req, res) => {
  // Fetch statistics
  const totalTasks = await Task.countDocuments();
  const pendingTasks = await Task.countDocuments({ status: "Pending" });
  const completedTasks = await Task.countDocuments({ status: "Completed" });
  const overdueTasks = await Task.countDocuments({
    status: { $ne: "Completed" },
    dueDate: { $lt: new Date() }
  });

  // Ensure all possible statuses are included
  const tasksStatuses = ["Pending", "In Progress", "Completed"];
  const tasksDistributionRaw = await Task.aggregate([{
    $group: { _id: "$status", count: { $sum: 1 } },
  }]);
  const tasksDistribution = tasksStatuses.reduce((acc, status) => {
    const formatedKey = status.replace(/\s+/g, ""); // Remove space
    acc[formatedKey] = tasksDistributionRaw.find(item => item._id === status)?.count || 0;
    return acc;
  }, {});

  tasksDistribution["All"] = totalTasks; // Add total count to tasksDistribution

  // Ensure all priority levels are included
  const tasksPriorities = ["Low", "Medium", "High"];
  const tasksPriorityLevelesRaw = await Task.aggregate([{
    $group: { _id: "$priority", count: { $sum: 1 } },
  }]);
  const tasksPriorityLeveles = tasksPriorities.reduce((acc, priority) => {
    acc[priority] = tasksPriorityLevelesRaw.find(item => item._id === priority)?.count || 0;
    return acc;
  }, {});

  // Fetch recent 10 tasks
  const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(10).select("title status dueDate createdAt");

  res.status(200).json({
    succsses: true,
    statistics: {
      totalTasks,
      pendingTasks,
      completedTasks,
      overdueTasks
    },
    charts: {
      tasksDistribution,
      tasksPriorityLeveles
    },
    recentTasks,
  });
});


// @desc   User Dashboard Data
// @route  GET/api/tasks/dashboard/user
// @access private
export const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Fetch data for the logged-in user

  // Fetch statistic for user-specific tasks
  const totalTasks = await Task.countDocuments({ assignedTo: userId });
  const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
  const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
  const overdueTasks = await Task.countDocuments({
    assignedTo: userId,
    status: { $ne: "Completed" },
    dueDate: { $lt: new Date() }
  });

  //Task distribution by status
  const tasksStatuses = ["Pending", "In Progress", "Completed"];
  const tasksDistributionRaw = await Task.aggregate([
    { $match: { assignedTo: userId.toString() } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const tasksDistribution = tasksStatuses.reduce((acc, status) => {
    const formatedKey = status.replace(/\s+/g, ""); // Remove space
    acc[formatedKey] = tasksDistributionRaw.find(item => item._id === status)?.count || 0;
    return acc;
  }, {});
  tasksDistribution["All"] = totalTasks;

  // Task distribution by priority
  const tasksPriorities = ["Low", "Medium", "High"];
  const tasksPriorityLevelesRaw = await Task.aggregate([
    { $match: { assignedTo: userId } },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  const tasksPriorityLeveles = tasksPriorities.reduce((acc, priority) => {
    acc[priority] = tasksPriorityLevelesRaw.find(item => item._id === priority)?.count || 0;
    return acc;
  }, {});

  // Fetch recent 10 tasks for the logged-in user
  const recentTasks = await Task.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt");

  res.status(200).json({
    succsses: true,
    statistics: {
      totalTasks,
      pendingTasks,
      completedTasks,
      overdueTasks
    },
    charts: {
      tasksDistribution,
      tasksPriorityLeveles
    },
    recentTasks,
  });
});