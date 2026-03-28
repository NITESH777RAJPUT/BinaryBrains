const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const request = async (path, options = {}) => {
  const auth = JSON.parse(localStorage.getItem("tracker_auth") || "{}");
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const authService = {
  signup: (payload) =>
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getProfile: () => request("/api/auth/me"),
  updateProfile: (payload) =>
    request("/api/auth/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

export const projectService = {
  getProjects: () => request("/api/projects"),
  createProject: (payload) =>
    request("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getProject: (projectId) => request(`/api/projects/${projectId}`),
  updateAssignment: (projectId, payload) =>
    request(`/api/projects/${projectId}/assignment`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

export const timeLogService = {
  createTimeLog: (payload) =>
    request("/api/timelogs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getAllLogs: () => request("/api/timelogs"),
  getProjectLogs: (projectId) => request(`/api/timelogs/${projectId}`),
};

export const aiService = {
  analyzeProject: (payload) =>
    request("/api/ai/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const teamService = {
  createTeam: (payload) =>
    request("/api/team/create", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  invite: (payload) =>
    request("/api/team/invite", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  join: (payload) =>
    request("/api/team/join", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getTeam: () => request("/api/team"),
  removeMember: (payload) =>
    request("/api/team/remove-member", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateRole: (payload) =>
    request("/api/team/update-role", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
