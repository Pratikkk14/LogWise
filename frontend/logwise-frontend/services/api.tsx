import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const getProjects = () => api.get("/projects");
export const getSessions = () => api.get("/sessions");
export const startSession = (projectId: number) => api.post("/start-session", { project_id: projectId });
export const getLogs = () => api.get("/logs");
