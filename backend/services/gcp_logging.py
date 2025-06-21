from google.cloud import logging_v2
from datetime import datetime, timedelta, timezone

client = logging_v2.Client()

def fetch_logs(start_minutes_ago: int, end_minutes_ago: int, severity: str):
    now = datetime.now(timezone.utc)
    start_time = now - timedelta(minutes=start_minutes_ago)
    end_time = now - timedelta(minutes=end_minutes_ago)

    filter_parts = [
    f'timestamp >= "{start_time.strftime("%Y-%m-%dT%H:%M:%SZ")}"',
    f'timestamp <= "{end_time.strftime("%Y-%m-%dT%H:%M:%SZ")}"',
    ]
    
    if severity:
        filter_parts.append(f'severity="{severity}"')

    filter_str = " AND ".join(filter_parts)
    
    entries = client.list_entries(
        filter_=filter_str, 
        order_by=logging_v2.DESCENDING
        )

    logs = []
    for entry in entries:
        logs.append({
            "timestamp": str(entry.timestamp),
            "severity": entry.severity,
            "message": entry.payload,
            "resource_type": entry.resource.type,
            "labels": entry.labels,
        })

    return {"logs": logs}
