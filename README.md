logwise/
├── backend/
│   ├── main.py                  # Entry point: FastAPI app, loads routers
│   ├── routes/
│   │   ├── logs.py              # /logs endpoint logic
│   │   └── explain.py           # /explain endpoint logic
│   ├── services/
│   │   ├── gcp_logging.py       # GCP log fetching logic
│   │   └── llm_explainer.py     # Gemini LLM logic
│   ├── models/
│   │   └── schemas.py           # Pydantic models for request/response
│   ├── utils/
│   │   └── session_manager.py   # (Optional) Save/load past investigations
│   ├── .env                     # Env vars like API keys
│   ├── requirements.txt         # Updated dependency list
│   └── README.md                # Backend-specific README (optional)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Investigation.tsx
│   │   │   └── SessionViewer.tsx
│   │   ├── components/
│   │   │   ├── LogCard.tsx
│   │   │   ├── LogTable.tsx
│   │   │   └── ExplainPanel.tsx
│   │   └── App.tsx
│   ├── tailwind.config.js
│   └── package.json
├── README.md                    # Project-level README
