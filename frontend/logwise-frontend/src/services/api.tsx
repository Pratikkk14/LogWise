import axios from "axios"

// --- Types for your data models ---
export interface GCPProject {
  id: string
  name: string
  projectId: string
  lastAnalyzed: string
  status: string
}

export interface Session {
  id: string
  name: string
  timeRange: string
  status: string
  project: string
}

export interface LogEntry {
  timestamp: string
  severity: string
  message: any
  resource_type: string
  labels: Record<string, string>
}

export interface LogsResponse {
  logs: LogEntry[]
}

export interface StartSessionResponse {
  sessionId: string
}

export interface ExplainResponse {
  explanation: string
}

// --- Axios instance ---
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
})

// --- Dashboard API ---
export const dashboardAPI = {
  getProjects: () => api.get<GCPProject[]>("/dashboard/projects").then(r => r.data),
  getSessions: () => api.get<Session[]>("/dashboard/sessions").then(r => r.data),
  startSession: (projectId: string) =>
    api.post<StartSessionResponse>("/dashboard/start-session", { projectId }).then(r => r.data),
}

// --- Logs API (for InvestigationSession) ---
export const logsAPI = {
  getLogs: (
    startMinutesAgo = 60,
    endMinutesAgo = 0,
    severity?: string
  ): Promise<LogsResponse> => {
    const params = new URLSearchParams({
      start_minutes_ago: startMinutesAgo.toString(),
      end_minutes_ago:   endMinutesAgo.toString(),
    })
    if (severity) params.append("severity", severity)
    return api.get<LogsResponse>(`/logs?${params.toString()}`).then(r => r.data)
  },
  getRecentLogs: (): Promise<LogsResponse> => logsAPI.getLogs(60, 0),
  getErrorLogs: (): Promise<LogsResponse> => logsAPI.getLogs(60, 0, "ERROR"),
}

// --- Explain API (right‐hand panel) ---
export const explainAPI = {
  explainLog: (logMessage: string, projectDescription: string): Promise<ExplainResponse> =>
    api.post<ExplainResponse>("/explain", { log_message: logMessage, project_description: projectDescription }).then(r => r.data),
}

// --- Health check helper ---
export const healthCheck = (): Promise<boolean> =>
  api
    .get("/")
    .then(() => true)
    .catch(() => false)

export interface LogsResponse {
    logs: LogEntry[];
  }

// new investigation namespace
export const investigationAPI = {
    getSession: async (sessionId: string) => {
      const resp = await api.get(`/investigation/${sessionId}`)
      return resp.data as any  // or a proper Session type
    },
    getLogs: async (
      sessionId: string,
      startMinutesAgo: number = 60,
      endMinutesAgo: number = 0,
      severity?: string
      ) => {
      const params = new URLSearchParams({
        start_minutes_ago: startMinutesAgo.toString(),
        end_minutes_ago: endMinutesAgo.toString(),
      })
      if (severity) params.append("severity", severity)
      const resp = await api.get(
        `/investigation/${sessionId}/logs?${params.toString()}`
      )
    return resp.data as { logs: any[] }
  }
}

export default api