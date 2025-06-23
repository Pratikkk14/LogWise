# backend/data/mock_data.py
def insert_session(new_session):
    sessions.insert(0, new_session)

projects = [
    {
        "id": "proj-1",
        "name": "Production API",
        "projectId": "my-app-prod-123456",
        "lastAnalyzed": "2 hours ago",
        "status": "active"
    },
    {
        "id": "proj-2",
        "name": "Staging Environment",
        "projectId": "my-app-staging-789012",
        "lastAnalyzed": "1 day ago",
        "status": "active"
    },
    {
        "id": "proj-3",
        "name": "Development Logs",
        "projectId": "my-app-dev-345678",
        "lastAnalyzed": "3 days ago",
        "status": "inactive"
    }
]

sessions = [
    {
        "id": "sess-1",
        "name": "API Error Investigation",
        "timeRange": "2024-06-19 14:00 - 16:30",
        "status": "completed",
        "project": "Production API"
    },
    {
        "id": "sess-2",
        "name": "Performance Analysis",
        "timeRange": "2024-06-18 09:15 - 11:45",
        "status": "in-progress",
        "project": "Staging Environment"
    }
]
