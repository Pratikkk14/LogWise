# backend/routes/dashboard.py

from typing import List
from fastapi import APIRouter
from uuid import uuid4
from models.schemas import GCPProject, Session, StartSessionRequest, StartSessionResponse
from data import mock_data

router = APIRouter()

@router.get("/projects", response_model=List[GCPProject])
def get_projects():
    return mock_data.projects

@router.get("/sessions", response_model=List[Session])
def get_sessions():
    return mock_data.sessions

@router.post("/start-session", response_model=StartSessionResponse)
def start_session(req: StartSessionRequest):
    session_id = str(uuid4())
    new_session = {
        "id": session_id,
        "name": f"New Investigation for {req.projectId}",
        "timeRange": "2025-06-22 10:00 - 12:00",
        "status": "in-progress",
        "project": req.projectId
    }
    mock_data.insert_session(new_session)  # or use insert_session()
    return {"sessionId": session_id}
