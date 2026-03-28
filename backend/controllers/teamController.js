import crypto from "crypto";
import Project from "../models/Project.js";
import Team from "../models/Team.js";
import TimeLog from "../models/TimeLog.js";
import User from "../models/User.js";
import { buildPortfolioSummary, calculateProjectMetrics } from "../utils/analytics.js";

const round = (value) => Number((value || 0).toFixed(2));

const mapTeamMembers = (members, usersById) =>
  members.map((member) => {
    const user = usersById.get(member.userId.toString());
    return {
      id: user?._id || member.userId,
      name: user?.name || "Unknown",
      email: user?.email || "",
      avatar: user?.avatar || "",
      role: member.role,
    };
  });

const buildTeamPayload = async (team) => {
  const users = await User.find({ teamId: team._id }).select("name email avatar role");
  const usersById = new Map(users.map((user) => [user._id.toString(), user]));
  const projects = await Project.find({ teamId: team._id }).populate("assignedTo", "name email avatar role");
  const projectIds = projects.map((project) => project._id);
  const timeLogs = await TimeLog.find({ projectId: { $in: projectIds } })
    .populate("userId", "name email avatar role")
    .sort({ createdAt: -1 });

  const projectCards = projects.map((project) => {
    const relatedLogs = timeLogs.filter(
      (log) => log.projectId.toString() === project._id.toString()
    );

    return {
      project,
      metrics: calculateProjectMetrics(project, relatedLogs),
    };
  });

  const teamMembers = mapTeamMembers(team.members, usersById);
  const portfolioSummary = buildPortfolioSummary(projectCards);
  const contributionMap = new Map();

  teamMembers.forEach((member) => {
    contributionMap.set(member.id.toString(), {
      memberId: member.id,
      name: member.name,
      email: member.email,
      avatar: member.avatar,
      role: member.role,
      hours: 0,
      earnings: 0,
      projectsAssigned: 0,
      effectiveRate: 0,
    });
  });

  timeLogs.forEach((log) => {
    const entry = contributionMap.get(log.userId?._id?.toString() || log.userId?.toString());
    if (!entry) return;
    entry.hours += log.duration;
  });

  projects.forEach((project) => {
    const assigneeKey = project.assignedTo?._id?.toString();
    const entry = assigneeKey ? contributionMap.get(assigneeKey) : null;
    if (!entry) return;
    entry.projectsAssigned += 1;
    entry.earnings += project.price;
  });

  const memberContributions = [...contributionMap.values()].map((entry) => ({
    ...entry,
    hours: round(entry.hours),
    earnings: round(entry.earnings),
    effectiveRate: round(entry.hours > 0 ? entry.earnings / entry.hours : entry.earnings),
  }));

  const bestPerformingMember = [...memberContributions].sort(
    (a, b) => b.effectiveRate - a.effectiveRate
  )[0] || null;

  const activityFeed = [
    ...projects.map((project) => ({
      id: `project-${project._id}`,
      type: "project_created",
      message: `${usersById.get(project.userId.toString())?.name || "Someone"} created ${project.title}`,
      createdAt: project.createdAt,
    })),
    ...timeLogs.map((log) => ({
      id: `log-${log._id}`,
      type: "time_logged",
      message: `${log.userId?.name || "Someone"} logged ${round(log.duration)} hours on ${
        projects.find((project) => project._id.toString() === log.projectId.toString())?.title || "a project"
      }`,
      createdAt: log.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 12);

  return {
    team: {
      id: team._id,
      name: team.name,
      ownerId: team.ownerId,
      createdAt: team.createdAt,
      inviteCount: team.invites.filter((invite) => !invite.acceptedAt).length,
    },
    members: teamMembers,
    pendingInvites: team.invites
      .filter((invite) => !invite.acceptedAt)
      .map((invite) => ({
        email: invite.email,
        role: invite.role,
        token: invite.token,
        createdAt: invite.createdAt,
      })),
    analytics: {
      totalTeamEarnings: portfolioSummary.totalEarnings,
      averageHourlyRate: portfolioSummary.averageHourlyRate,
      bestPerformingMember,
      memberContributions,
    },
    activityFeed,
    projects: projectCards,
  };
};

export const createTeam = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Team name is required" });
  }

  if (req.user.teamId) {
    return res.status(400).json({ message: "You already belong to a team" });
  }

  const team = await Team.create({
    name,
    ownerId: req.user._id,
    members: [{ userId: req.user._id, role: "admin" }],
  });

  await User.findByIdAndUpdate(req.user._id, {
    teamId: team._id,
    role: "admin",
  });

  const updatedTeam = await Team.findById(team._id);
  return res.status(201).json(await buildTeamPayload(updatedTeam));
};

export const inviteToTeam = async (req, res) => {
  const { email, role = "member" } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Invite email is required" });
  }

  const team = await Team.findById(req.user.teamId);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser?.teamId?.toString() === team._id.toString()) {
    return res.status(400).json({ message: "That user is already in your team" });
  }

  const token = crypto.randomBytes(24).toString("hex");
  const invite = {
    email,
    role,
    token,
    invitedBy: req.user._id,
  };

  team.invites = [
    ...team.invites.filter((currentInvite) => currentInvite.email !== email || currentInvite.acceptedAt),
    invite,
  ];
  await team.save();

  return res.status(201).json({
    invite: {
      email,
      role,
      token,
      inviteLink: `${process.env.FRONTEND_URL || "http://localhost:5173"}/team/join/${token}`,
    },
  });
};

export const joinTeam = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Invite token is required" });
  }

  if (req.user.teamId) {
    return res.status(400).json({ message: "Leave your current team before joining another one" });
  }

  const team = await Team.findOne({ "invites.token": token });
  if (!team) {
    return res.status(404).json({ message: "Invite not found" });
  }

  const invite = team.invites.find((currentInvite) => currentInvite.token === token);
  if (!invite || invite.acceptedAt) {
    return res.status(400).json({ message: "Invite is no longer active" });
  }

  if (invite.email !== req.user.email) {
    return res.status(403).json({ message: "This invite was created for a different email address" });
  }

  team.members.push({ userId: req.user._id, role: invite.role });
  invite.acceptedAt = new Date();
  await team.save();

  await User.findByIdAndUpdate(req.user._id, {
    teamId: team._id,
    role: invite.role,
  });

  const refreshedTeam = await Team.findById(team._id);
  return res.json(await buildTeamPayload(refreshedTeam));
};

export const getTeam = async (req, res) => {
  if (!req.user.teamId) {
    return res.json({ team: null, members: [], analytics: null, activityFeed: [], pendingInvites: [] });
  }

  const team = await Team.findById(req.user.teamId);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  return res.json(await buildTeamPayload(team));
};

export const removeMember = async (req, res) => {
  const { memberId } = req.body;
  const team = await Team.findById(req.user.teamId);

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  if (memberId === req.user._id.toString()) {
    return res.status(400).json({ message: "Use a separate leave-team flow for your own account" });
  }

  team.members = team.members.filter((member) => member.userId.toString() !== memberId);
  await team.save();

  await User.findByIdAndUpdate(memberId, {
    teamId: null,
    role: "member",
  });

  await Project.updateMany(
    { teamId: team._id, assignedTo: memberId },
    { assignedTo: team.ownerId }
  );

  return res.json(await buildTeamPayload(team));
};

export const updateMemberRole = async (req, res) => {
  const { memberId, role } = req.body;
  const team = await Team.findById(req.user.teamId);

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  team.members = team.members.map((member) =>
    member.userId.toString() === memberId ? { ...member.toObject(), role } : member
  );
  await team.save();

  await User.findByIdAndUpdate(memberId, { role });

  return res.json(await buildTeamPayload(team));
};
