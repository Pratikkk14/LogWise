from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from models.schemas import Session, LogsResponse
from data import mock_data
from services.gcp_logging import fetch_logs

router = APIRouter()

@router.get("/{session_id}", response_model=Session)
def get_session(session_id: str):
    for s in mock_data.sessions:
        if s["id"] == session_id:
            return s
    raise HTTPException(status_code=404, detail="Session not found")

@router.get("/{session_id}/logs", response_model=LogsResponse)
def get_session_logs(
    session_id: str,
    start_minutes_ago: int = Query(60, ge=0),
    end_minutes_ago: int = Query(0, ge=0),
    severity: Optional[str] = Query(None),
):
    # verify session exists
        if not any(s["id"] == session_id for s in mock_data.sessions):
            raise HTTPException(status_code=404, detail="Session not found")
        # delegate to your existing GCP fetcher
        return fetch_logs(start_minutes_ago, end_minutes_ago, severity)
    