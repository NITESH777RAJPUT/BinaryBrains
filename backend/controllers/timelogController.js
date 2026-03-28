import Project from "../models/Project.js";
import TimeLog from "../models/TimeLog.js";
import { calculateProjectMetrics } from "../utils/analytics.js";
import { buildProjectScope } from "../middleware/authMiddleware.js";

export const createTimeLog = async (req, res) => {
  const { projectId, duration, type, notes, startedAt, createdAt } = req.body;

  if (!projectId || !duration || !type) {
    return res.status(400).json({ message: "projectId, duration, and type are required" });
  }

  const project = await Project.findOne({ _id: projectId, ...buildProjectScope(req.user) });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const timeLog = await TimeLog.create({
    projectId,
    userId: req.user._id,
    duration,
    type,
    notes,
    startedAt,
    createdAt,
  });

  const updatedLogs = await TimeLog.find({ projectId })
    .populate("userId", "name email avatar role")
    .sort({ createdAt: -1 });

  return res.status(201).json({
    timeLog,
    metrics: calculateProjectMetrics(project, updatedLogs),
  });
};

export const getTimeLogsByProject = async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.projectId,
    ...buildProjectScope(req.user),
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const timeLogs = await TimeLog.find({ projectId: req.params.projectId })
    .populate("userId", "name email avatar role")
    .sort({ createdAt: -1 });

  return res.json({
    timeLogs,
    metrics: calculateProjectMetrics(project, timeLogs),
  });
};

export const getAllTimeLogs = async (req, res) => {
  const projects = await Project.find(buildProjectScope(req.user)).select("_id title client");
  const projectIds = projects.map((project) => project._id);

  const timeLogs = await TimeLog.find({ projectId: { $in: projectIds } })
    .populate("projectId", "title client")
    .populate("userId", "name email avatar role")
    .sort({ createdAt: -1 });

  return res.json({ timeLogs });
};
