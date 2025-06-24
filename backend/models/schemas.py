from pydantic import BaseModel
from typing import List, Any, Dict, Optional

class ExplainRequest(BaseModel):
    log_message: str
    project_description: str

class GCPProject(BaseModel):
    id: str
    name: str
    projectId: str
    lastAnalyzed: str
    status: str

class Session(BaseModel):
    id: str
    name: str
    timeRange: str
    status: str
    project: str

class StartSessionRequest(BaseModel):
    projectId: str

class StartSessionResponse(BaseModel):
    sessionId: str

class LogEntry(BaseModel):
    timestamp: str
    severity: str
    message: Any
    resource_type: str
    labels: Dict[str, str]

class LogsResponse(BaseModel):
    logs: List[LogEntry]