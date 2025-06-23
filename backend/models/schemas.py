from pydantic import BaseModel
from typing import List

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

