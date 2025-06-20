# 📂 Project Folder Structure
```bash
logwise/
├── backend/
│   ├── main.py                # FastAPI app
│   ├── gcp_logs.py            # Logging API logic
│   ├── llm_explainer.py       # OpenAI/Gemini integration
│   ├── session_manager.py     # Save/load investigations
│   └── requirements.txt
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
│   └── tailwind.config.js
│   └── package.json
├── README.md
```
# LogWise
A Logging platform that will help developer in efficient logging of the gcp
