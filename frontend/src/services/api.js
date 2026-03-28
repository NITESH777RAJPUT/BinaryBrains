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
};

export const projectService = {
  getProjects: () => request("/api/projects"),
  createProject: (payload) =>
    request("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getProject: (projectId) => request(`/api/projects/${projectId}`),
};

export const timeLogService = {
  createTimeLog: (payload) =>
    request("/api/timelogs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getProjectLogs: (projectId) => request(`/api/timelogs/${projectId}`),
};

export const aiService = {
  analyzeProject: (payload) =>
    request("/api/ai/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

