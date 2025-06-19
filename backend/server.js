import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import authRouter from './routes/auth.route.js';
import errorMiddleware from "./middlewares/error.middleware.js";
import userRouter from './routes/user.route.js';
import taskRouter from './routes/task.route.js';


const app = express();

// Middleware to handle cors
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use ('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
// app.use('/api/reports', reportRouter);

// Error Middleware
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));