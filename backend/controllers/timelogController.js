import Project from "../models/Project.js";
import TimeLog from "../models/TimeLog.js";
import { calculateProjectMetrics } from "../utils/analytics.js";

export const createTimeLog = async (req, res) => {
  const { projectId, duration, type, notes, startedAt, createdAt } = req.body;

  if (!projectId || !duration || !type) {
    return res.status(400).json({ message: "projectId, duration, and type are required" });
  }

  const project = await Project.findOne({ _id: projectId, userId: req.user._id });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const timeLog = await TimeLog.create({
    projectId,
    duration,
    type,
    notes,
    startedAt,
    createdAt,
  });

  const updatedLogs = await TimeLog.find({ projectId }).sort({ createdAt: -1 });

  return res.status(201).json({
    timeLog,
    metrics: calculateProjectMetrics(project, updatedLogs),
  });
};

export const getTimeLogsByProject = async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.projectId,
    userId: req.user._id,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const timeLogs = await TimeLog.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });

  return res.json({
    timeLogs,
    metrics: calculateProjectMetrics(project, timeLogs),
  });
};

export const getAllTimeLogs = async (req, res) => {
  const projects = await Project.find({ userId: req.user._id }).select("_id title client");
  const projectIds = projects.map((project) => project._id);

  const timeLogs = await TimeLog.find({ projectId: { $in: projectIds } })
    .populate("projectId", "title client")
    .sort({ createdAt: -1 });

  return res.json({ timeLogs });
};
