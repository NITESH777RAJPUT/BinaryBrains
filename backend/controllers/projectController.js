import Project from "../models/Project.js";
import TimeLog from "../models/TimeLog.js";
import {
  buildMonthlyAnalytics,
  buildPortfolioSummary,
  calculateProjectMetrics,
} from "../utils/analytics.js";

export const createProject = async (req, res) => {
  const { title, client, type, pricingType, price, estimatedHours, thresholdRate } = req.body;

  if (!title || !client || !type || !pricingType || !price || !estimatedHours || !thresholdRate) {
    return res.status(400).json({ message: "All project fields are required" });
  }

  const project = await Project.create({
    userId: req.user._id,
    title,
    client,
    type,
    pricingType,
    price,
    estimatedHours,
    thresholdRate,
  });

  return res.status(201).json(project);
};

export const getProjects = async (req, res) => {
  const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
  const projectIds = projects.map((project) => project._id);
  const timeLogs = await TimeLog.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 });

  const projectCards = projects.map((project) => {
    const relatedLogs = timeLogs.filter(
      (log) => log.projectId.toString() === project._id.toString()
    );
    const metrics = calculateProjectMetrics(project, relatedLogs);
    return {
      project,
      metrics,
    };
  });

  const portfolioSummary = buildPortfolioSummary(projectCards);
  const monthlyAnalytics = buildMonthlyAnalytics(timeLogs);

  return res.json({
    projects: projectCards,
    portfolioSummary,
    monthlyAnalytics,
  });
};

export const getProjectById = async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const timeLogs = await TimeLog.find({ projectId: project._id }).sort({ createdAt: -1 });
  const metrics = calculateProjectMetrics(project, timeLogs);

  return res.json({
    project,
    metrics,
    timeLogs,
  });
};

