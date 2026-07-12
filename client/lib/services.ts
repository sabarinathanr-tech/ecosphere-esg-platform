import api from "./api";

// ─── Pagination Params ────────────────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
}

function buildParams(params: PaginationParams = {}) {
  const p: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") p[k] = String(v);
  });
  return p;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authApi = {
  me: () => api.get("/auth/me"),
  updateProfile: (data: { name?: string; department?: string; avatarUrl?: string }) =>
    api.put("/auth/profile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/auth/change-password", data),
};

// ─── ENVIRONMENT ──────────────────────────────────────────────────────────────
export const emissionFactorsApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/emission-factors", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/emission-factors/${id}`),
  create: (data: unknown) => api.post("/emission-factors", data),
  update: (id: string, data: unknown) => api.put(`/emission-factors/${id}`, data),
  delete: (id: string) => api.delete(`/emission-factors/${id}`),
};

export const carbonTransactionsApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/carbon-transactions", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/carbon-transactions/${id}`),
  create: (data: unknown) => api.post("/carbon-transactions", data),
  update: (id: string, data: unknown) => api.put(`/carbon-transactions/${id}`, data),
  delete: (id: string) => api.delete(`/carbon-transactions/${id}`),
  verify: (id: string) => api.post(`/carbon-transactions/${id}/verify`),
};

export const productProfilesApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/product-profiles", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/product-profiles/${id}`),
  create: (data: unknown) => api.post("/product-profiles", data),
  update: (id: string, data: unknown) => api.put(`/product-profiles/${id}`, data),
  delete: (id: string) => api.delete(`/product-profiles/${id}`),
};

export const sustainabilityGoalsApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/sustainability-goals", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/sustainability-goals/${id}`),
  create: (data: unknown) => api.post("/sustainability-goals", data),
  update: (id: string, data: unknown) => api.put(`/sustainability-goals/${id}`, data),
  delete: (id: string) => api.delete(`/sustainability-goals/${id}`),
};

// ─── SOCIAL ───────────────────────────────────────────────────────────────────
export const csrActivitiesApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/csr-activities", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/csr-activities/${id}`),
  create: (data: unknown) => api.post("/csr-activities", data),
  update: (id: string, data: unknown) => api.put(`/csr-activities/${id}`, data),
  delete: (id: string) => api.delete(`/csr-activities/${id}`),
};

export const employeeParticipationApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/employee-participation", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/employee-participation/${id}`),
  create: (data: unknown) => api.post("/employee-participation", data),
  update: (id: string, data: unknown) => api.put(`/employee-participation/${id}`, data),
  delete: (id: string) => api.delete(`/employee-participation/${id}`),
};

export const trainingProgramsApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/training-programs", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/training-programs/${id}`),
  create: (data: unknown) => api.post("/training-programs", data),
  update: (id: string, data: unknown) => api.put(`/training-programs/${id}`, data),
  delete: (id: string) => api.delete(`/training-programs/${id}`),
};

export const diversityApi = {
  getStats: () => api.get("/diversity/stats"),
};

// ─── GOVERNANCE ───────────────────────────────────────────────────────────────
export const policiesApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/policies", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/policies/${id}`),
  create: (data: unknown) => api.post("/policies", data),
  update: (id: string, data: unknown) => api.put(`/policies/${id}`, data),
  delete: (id: string) => api.delete(`/policies/${id}`),
};

export const policyAcknowledgementsApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/policy-acknowledgements", { params: buildParams(params) }),
  create: (data: unknown) => api.post("/policy-acknowledgements", data),
  update: (id: string, data: unknown) => api.put(`/policy-acknowledgements/${id}`, data),
  bulkRemind: (policyId: string) => api.post(`/policy-acknowledgements/bulk-remind`, { policyId }),
};

export const auditsApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/audits", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/audits/${id}`),
  create: (data: unknown) => api.post("/audits", data),
  update: (id: string, data: unknown) => api.put(`/audits/${id}`, data),
  delete: (id: string) => api.delete(`/audits/${id}`),
};

export const complianceIssuesApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/compliance-issues", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/compliance-issues/${id}`),
  create: (data: unknown) => api.post("/compliance-issues", data),
  update: (id: string, data: unknown) => api.put(`/compliance-issues/${id}`, data),
  delete: (id: string) => api.delete(`/compliance-issues/${id}`),
};

// ─── GAMIFICATION ─────────────────────────────────────────────────────────────
export const challengesApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/challenges", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/challenges/${id}`),
  create: (data: unknown) => api.post("/challenges", data),
  update: (id: string, data: unknown) => api.put(`/challenges/${id}`, data),
  delete: (id: string) => api.delete(`/challenges/${id}`),
  join: (id: string) => api.post(`/challenges/${id}/join`),
};

export const challengeParticipationApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/challenge-participation", { params: buildParams(params) }),
  update: (id: string, data: unknown) => api.put(`/challenge-participation/${id}`, data),
};

export const badgesApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/badges", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/badges/${id}`),
  create: (data: unknown) => api.post("/badges", data),
  update: (id: string, data: unknown) => api.put(`/badges/${id}`, data),
  delete: (id: string) => api.delete(`/badges/${id}`),
};

export const rewardsApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/rewards", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/rewards/${id}`),
  create: (data: unknown) => api.post("/rewards", data),
  update: (id: string, data: unknown) => api.put(`/rewards/${id}`, data),
  delete: (id: string) => api.delete(`/rewards/${id}`),
};

export const rewardRedemptionsApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/reward-redemptions", { params: buildParams(params) }),
  create: (data: unknown) => api.post("/reward-redemptions", data),
  update: (id: string, data: unknown) => api.put(`/reward-redemptions/${id}`, data),
};

export const leaderboardApi = {
  get: (params?: { period?: "monthly" | "alltime"; department?: string }) =>
    api.get("/leaderboard", { params }),
};

// ─── REPORTS ──────────────────────────────────────────────────────────────────
export const reportsApi = {
  environmental: (params?: { period?: string; department?: string }) =>
    api.get("/reports/environmental", { params }),
  social: (params?: { period?: string }) =>
    api.get("/reports/social", { params }),
  governance: (params?: { period?: string }) =>
    api.get("/reports/governance", { params }),
  esgSummary: (params?: { period?: string }) =>
    api.get("/reports/esg-summary", { params }),
};

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
export const departmentsApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/departments", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/departments/${id}`),
  create: (data: unknown) => api.post("/departments", data),
  update: (id: string, data: unknown) => api.put(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`),
};

export const categoriesApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/categories", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: unknown) => api.post("/categories", data),
  update: (id: string, data: unknown) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const usersApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/users", { params: buildParams(params) }),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: unknown) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notificationsApi = {
  getAll: (params?: PaginationParams) =>
    api.get("/notifications", { params: buildParams(params) }),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};
