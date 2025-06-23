import axios from "axios";

// Types matching your backend schemas
export interface GCPProject {
  id: string;
  name: string;
  projectId: string;
  lastAnalyzed: string;
  status: string;
}

export interface Session {
  id: string;
  name: string;
  timeRange: string;
  status: string;
  project: string;
}

export interface StartSessionRequest {
  projectId: string;
}

export interface StartSessionResponse {
  sessionId: string;
}

export interface ExplainRequest {
  log_message: string;
  project_description: string;
}

export interface LogEntry {
  timestamp: string;
  severity: string;
  message: any; // Can be string or object
  resource_type: string;
  labels: Record<string, string>;
}

export interface LogsResponse {
  logs: LogEntry[];
}

export interface ExplainResponse {
  explanation: string;
}

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout for LLM calls
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error("📤 Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error("📥 Response Error:", error.response?.data || error.message);
    
    // Handle common errors
    if (error.response?.status === 500) {
      console.error("Server Error - Check backend logs");
    } else if (error.response?.status === 404) {
      console.error("Endpoint not found");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("Backend server is not running");
    }
    
    return Promise.reject(error);
  }
);

// Dashboard API functions
export const dashboardAPI = {
  /**
   * Get all GCP projects
   */
  getProjects: async (): Promise<GCPProject[]> => {
    const response = await api.get<GCPProject[]>("/dashboard/projects");
    return response.data;
  },

  /**
   * Get all investigation sessions
   */
  getSessions: async (): Promise<Session[]> => {
    const response = await api.get<Session[]>("/dashboard/sessions");
    return response.data;
  },

  /**
   * Start a new investigation session for a project
   */
  startSession: async (projectId: string): Promise<StartSessionResponse> => {
    const response = await api.post<StartSessionResponse>("/dashboard/start-session", {
      projectId: projectId
    });
    return response.data;
  },
};

// Logs API functions
export const logsAPI = {
  /**
   * Get logs with optional filters
   * @param startMinutesAgo - How many minutes ago to start fetching from (default: 60)
   * @param endMinutesAgo - How many minutes ago to end fetching (default: 0 = now)
   * @param severity - Log severity filter (optional)
   */
  getLogs: async (
    startMinutesAgo: number = 60,
    endMinutesAgo: number = 0,
    severity?: string
  ): Promise<LogsResponse> => {
    const params = new URLSearchParams({
      start_minutes_ago: startMinutesAgo.toString(),
      end_minutes_ago: endMinutesAgo.toString(),
    });
    
    if (severity) {
      params.append('severity', severity);
    }

    const response = await api.get<LogsResponse>(`/logs?${params.toString()}`);
    return response.data;
  },

  /**
   * Get recent logs (last hour)
   */
  getRecentLogs: async (): Promise<LogsResponse> => {
    return logsAPI.getLogs(60, 0);
  },

  /**
   * Get error logs only
   */
  getErrorLogs: async (): Promise<LogsResponse> => {
    return logsAPI.getLogs(60, 0, 'ERROR');
  },
};

// Explain API functions
export const explainAPI = {
  /**
   * Get AI explanation for a log message
   * @param logMessage - The log message to explain
   * @param projectDescription - Description of the project context
   */
  explainLog: async (
    logMessage: string, 
    projectDescription: string
  ): Promise<ExplainResponse> => {
    const response = await api.post<ExplainResponse>("/explain", {
      log_message: logMessage,
      project_description: projectDescription
    });
    return response.data;
  },
};

// Backward compatibility exports
export const getProjects = dashboardAPI.getProjects;
export const getSessions = dashboardAPI.getSessions;
export const startSession = dashboardAPI.startSession;
export const getLogs = logsAPI.getLogs;

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    await api.get("/");
    return true;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
};

// Export default axios instance for custom requests
export default api;