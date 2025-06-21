from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Query
from google.cloud import logging_v2
from datetime import datetime, timedelta, timezone
import os

app = FastAPI()

client = logging_v2.Client()

@app.get("/logs")
def get_logs(
    start_minutes_ago: int = Query(60),
    end_minutes_ago: int = Query(0),
    severity: str = Query(None)
):
    """Fetch Logs from Google Cloud Logging"""
    now = datetime.now(timezone.utc)
    start_time = now - timedelta(minutes=start_minutes_ago)
    end_time = now - timedelta(minutes=end_minutes_ago)
    
    filter_parts = [
    f'timestamp >= "{start_time.strftime("%Y-%m-%dT%H:%M:%SZ")}"',
    ]
    
    if severity:
        filter_parts.append(f'severity="{severity}"')
        
    filter_str = " AND ".join(filter_parts)
    
    print(filter_str) # Debugging filter string
    
    entries = client.list_entries(
        filter_=filter_str,
        order_by=logging_v2.DESCENDING
        )
    
    logs = []
    for entry in entries:
        logs.append(
            {
                "timestamp": str(entry.timestamp),
                "severity": entry.severity,
                "message": entry.payload if isinstance(entry.payload, str) else str(entry.payload),
                "resource_type": entry.resource.type,
                "resource_labels": entry.resource.labels
            }
        )
    return {"logs":logs}        