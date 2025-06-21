from fastapi import APIRouter, Query
from services.gcp_logging import fetch_logs

router = APIRouter()

@router.get("")
def get_logs(
    start_minutes_ago: int = Query(60),
    end_minutes_ago: int = Query(0),
    severity: str = Query(None)
    ):
    return fetch_logs(start_minutes_ago, end_minutes_ago, severity)
