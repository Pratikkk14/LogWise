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
│
├── frontend/
│   └── logwise-frontend/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   ├── LogCard.tsx
│       │   │   ├── LogTable.tsx
│       │   │   └── ExplainPanel.tsx
│       │   ├── pages/
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Investigation.tsx
│       │   │   └── SessionViewer.tsx
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html             # KEEP — required by Vite
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── .env                   # VITE_API_URL, etc.
│       ├── tailwind.config.js     # Optional if using Tailwind CSS
│       └── README.md              # Optional: frontend structure
│
├── venv/                          # Python virtual environment
├── .gitignore
├── README.md                      # Root README for contributors
├── LICENSE
