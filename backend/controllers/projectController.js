import Project from "../models/Project.js";
import TimeLog from "../models/TimeLog.js";
import User from "../models/User.js";
import {
  buildMonthlyAnalytics,
  buildPortfolioSummary,
  calculateProjectMetrics,
} from "../utils/analytics.js";
import { buildProjectScope } from "../middleware/authMiddleware.js";

const getTeamMembers = async (user) => {
  if (!user.teamId) {
    return [user];
  }

  return User.find({ teamId: user.teamId })
    .select("name email avatar role")
    .sort({ createdAt: 1 });
};

const validateAssignment = async (user, assignedTo) => {
  if (!assignedTo) {
    return null;
  }

  const assignee = await User.findOne(
    user.teamId ? { _id: assignedTo, teamId: user.teamId } : { _id: user._id }
  ).select("_id");

  return assignee ? assignee._id : null;
};

export const createProject = async (req, res) => {
  const { title, client, type, pricingType, price, estimatedHours, thresholdRate, assignedTo } = req.body;

  if (!title || !client || !type || !pricingType || !price || !estimatedHours || !thresholdRate) {
    return res.status(400).json({ message: "All project fields are required" });
  }

  const normalizedAssignedTo = await validateAssignment(req.user, assignedTo || req.user._id);
  if (!normalizedAssignedTo) {
    return res.status(400).json({ message: "Assigned member must belong to your team" });
  }

  const project = await Project.create({
    userId: req.user._id,
    teamId: req.user.teamId || null,
    assignedTo: normalizedAssignedTo,
    title,
    client,
    type,
    pricingType,
    price,
    estimatedHours,
    thresholdRate,
  });

  await project.populate("assignedTo", "name email avatar role");

  return res.status(201).json(project);
};

export const getProjects = async (req, res) => {
  const scope = buildProjectScope(req.user);
  const projects = await Project.find(scope)
    .populate("assignedTo", "name email avatar role")
    .sort({ createdAt: -1 });
  const projectIds = projects.map((project) => project._id);
  const timeLogs = await TimeLog.find({ projectId: { $in: projectIds } })
    .populate("userId", "name email avatar role")
    .sort({ createdAt: -1 });
  const teamMembers = await getTeamMembers(req.user);

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
    teamMembers,
  });
};

export const getProjectById = async (req, res) => {
  const scope = buildProjectScope(req.user);
  const project = await Project.findOne({
    _id: req.params.id,
    ...scope,
  }).populate("assignedTo", "name email avatar role");

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const timeLogs = await TimeLog.find({ projectId: project._id })
    .populate("userId", "name email avatar role")
    .sort({ createdAt: -1 });
  const metrics = calculateProjectMetrics(project, timeLogs);
  const teamMembers = await getTeamMembers(req.user);

  return res.json({
    project,
    metrics,
    timeLogs,
    teamMembers,
  });
};

export const updateProjectAssignment = async (req, res) => {
  const scope = buildProjectScope(req.user);
  const { assignedTo } = req.body;
  const normalizedAssignedTo = await validateAssignment(req.user, assignedTo);

  if (!normalizedAssignedTo) {
    return res.status(400).json({ message: "Assigned member must belong to your team" });
  }

  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, ...scope },
    { assignedTo: normalizedAssignedTo },
    { new: true }
  ).populate("assignedTo", "name email avatar role");

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  return res.json({ project });
};
