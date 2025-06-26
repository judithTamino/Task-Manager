import { Router } from 'express';
import { adminOnly, protect } from '../middlewares/auth.middleware.js';
import { exportTasksReport, exportUsersReport } from '../controllers/report.controller.js';

const reportRouter = Router();

reportRouter.get('/exports/tasks', protect, adminOnly, exportTasksReport); // Export all tasks as Excel
reportRouter.get('/exports/users', protect, adminOnly, exportUsersReport); // Exports user-task report

export default reportRouter;