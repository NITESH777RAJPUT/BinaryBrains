import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const buildProjectScope = (user) =>
  user.teamId ? { teamId: user.teamId } : { userId: user._id, teamId: null };

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireTeam = (req, res, next) => {
  if (!req.user?.teamId) {
    return res.status(400).json({ message: "Join or create a team first" });
  }

  next();
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user?.teamId) {
    return next();
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have access to this action" });
  }

  next();
};

export default protect;
