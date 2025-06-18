import jwt from "jsonwebtoken";
import User from '../models/user.model.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer"))
      token = token.split(" ")[1]; // extract token

    if (!token) {
      res.status(401);
      throw new Error("No token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    req.user = user;
    next();
    
  } catch (error) {
    next(error);
  }
};

// Middleware to protect routes
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ msg: "Access denied, admin only" });
};