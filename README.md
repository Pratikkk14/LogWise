.
├── backend/                                                                                                   
│   ├── accounts/                                                                                            
│   │   ├── cloud-fundamental-workshop-f46754ecb2ba.json                                                 
│   │   └── logwise-service-account.json                                                                   
│   ├── models/                                                                                             
│   │   └── schemas.py                                                                                    
│   ├── routes/                                                                                            
│   │   ├── dashboard.py                                                                                   
│   │   ├── explain.py                                                                                        
│   │   ├── investigation.py                                                                               
│   │   └── logs.py                                                                                        
│   ├── services/                                                                                          
│   │   ├── bigquery_service.py                                                                               
│   │   ├── gcp_logging.py                                                                                  
│   │   ├── llm_explainer.py                                                                                 
│   │   └── storage_service.py                                                                              
│   ├── .env                                                                                                 
│   ├── .gitignore                                                                                           
│   ├── cloud_config.py                                                                                     
│   ├── main.py                                                                                             
│   ├── requirements.txt                                                                                     
│   └── temp.py                                                                                               
├── frontend/                                                                                               
│   └── logwise-frontend/                                                                                    
│       ├── .env                                                                                               
│       ├── .gitignore                                                                                     
│       ├── eslint.config.js                                                                                   
│       ├── index.html                                                                                   
│       ├── node_modules/                                                                                     
│       ├── package-lock.json                                                                           
│       ├── package.json                                                                            
│       ├── public/                                                                                      
│       │   └── vite.svg                                                                                
│       ├── README.md                                                                                        
│       ├── services/                                                                                    
│       │   └── api.tsx                                                                                  
│       ├── src/                                                                                            
│       │   ├── App.css                                                                                
│       │   ├── App.tsx                                                                               
│       │   ├── assets/                                                                                    
│       │   │   └── react.svg                                                                             
│       │   ├── components/                                                                                   
│       │   │   ├── APITester.tsx                                                                       
│       │   │   ├── FloatingActionButton.tsx                                                                   
│       │   │   ├── GCPProjectCard.tsx                                                                       
│       │   │   ├── SessionCard.tsx                                                   
│       │   │   ├── SessionList.tsx                                                        
│       │   │   ├── topNavBar.tsx                                                         
│       │   │   └── useChartData.tsx                                                                  
│       │   ├── index.css                                                                                     
│       │   ├── main.tsx                                                                              
│       │   ├── pages/                                                                        
│       │   │   ├── Dashboard.tsx                                                                      
│       │   │   ├── GCPProjectConnectionForm.tsx                                                    
│       │   │   └── InvestigationSession.tsx                                                          
│       │   ├── services/                                                                             
│       │   │   └── api.tsx                                                                          
│       │   └── vite-env.d.ts                                                                       
│       ├── tsconfig.app.json                                                                            
│       ├── tsconfig.json                                                                              
│       ├── tsconfig.node.json                                                                          
│       └── vite.config.ts                                                                                
├── .git/                                                                                         
├── .gitignore                                                                                  
├── LICENSE                                                                
├── README.md                                                                                        
├── requirements.txt                                                                                    
└── venv/                                                                             

# 🔍 LogWise - AI-Powered GCP Log Investigation Platform

**LogWise** is a developer-first platform for investigating, understanding, and documenting logs from Google Cloud Platform (GCP). It combines powerful log filtering, AI-based explanations, and session tracking to help users debug cloud infrastructure efficiently.

Although LogWise currently runs locally, the platform is fully integrated with real GCP services, making it cloud-ready and deployment-optimized.

---

## 📌 Key Highlights

- AI explanations using **Google Gemini (via Vertex AI)**
- Real GCP log retrieval via **Cloud Logging API**
- Connected project and session management using **BigQuery**
- Secure **service key upload and storage** in Google Cloud Storage
- Secrets handled securely via **Secret Manager**

> 🔧 All major GCP integrations are complete. Only frontend/backend deployment and full mock-to-live data transition are pending, covered under future scope.

---

## 💡 Features

- 🧠 Click-to-explain AI log interpretation
- ⏱️ Time- and severity-based filtering
- 📊 Dynamic log visualization charts
- 💬 Optional user notes on explained logs
- 💾 Persistent session saving and retrieval (per project)

---

## 🛠️ Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Frontend  | React + TypeScript + Tailwind CSS |
| Backend   | FastAPI (Python)                  |
| Database  | BigQuery                          |
| AI        | Google Gemini (via Vertex AI)     |
| Storage   | Google Cloud Storage              |
| Secrets   | Secret Manager                    |

---

## ☁️ GCP Integration Overview

| Component              | GCP Service             | Purpose                                                                  |
|------------------------|-------------------------|--------------------------------------------------------------------------|
| 🧠 AI Log Explanation | Vertex AI (Gemini)       | Use Gemini 2.0 Flash for log interpretation                             |
| 📊 Project/Sessions   | BigQuery                 | Store project metadata and user sessions                                |
| 🔐 Secret Management  | Secret Manager           | Secure Gemini API key handling                                          |
| 🧾 Key File Storage   | Cloud Storage            | Store uploaded service key JSON files                                   |
| 🌐 Frontend Hosting   | Firebase Hosting *(planned)* | Planned hosting for React frontend                                 |
| 🔙 Backend             | Cloud Run *(planned)*   | Host the FastAPI backend                                                 |

> ✅ Cloud service integrations are functional and tested.  
> 🚫 Hosting not yet configured — part of future scope.

---

## 🔌 Backend API Routes (Updated)

### 📁 `/dashboard` Endpoints

| Route                         | Method | Description |
|------------------------------|--------|-------------|
| `/projects`                  | GET    | Fetch list of connected GCP projects (currently returns mock data) |
| `/sessions`                  | GET    | Fetch list of investigation sessions (mock data) |
| `/start-session`             | POST   | Start a new session for a project (returns generated session ID) |

### 📁 `/logs`

| Route   | Method | Description |
|---------|--------|-------------|
| `/logs` | POST   | Fetch logs from GCP using filters (time, severity, service) |

### 📁 `/explain`

| Route      | Method | Description |
|------------|--------|-------------|
| `/explain` | POST   | Use Gemini to explain the meaning and context of a selected log |

### 📁 `/investigation`

| Route                                        | Method | Description |
|---------------------------------------------|--------|-------------|
| `/save-session`                             | POST   | Save a session (AI explanation + optional user comment) to BigQuery |
| `/sessions/{project_id}`                    | GET    | Retrieve all sessions for a specific GCP project |
| `/session/{project_id}/{session_id}`        | GET    | Get detailed data for a specific session |

---

## 🗃️ BigQuery Tables

### 📁 Dataset: `logwise_data`

| Table               | Purpose |
|---------------------|---------|
| `projects`          | Store connected GCP project metadata |
| `sessions`          | Tracks each investigation session |
| `session_comments`  | Stores AI explanations and user comments per session |

---

## 🔄 Session Workflow

- Session is created **only when the user saves a log explanation**.
- Every session is tied to a `project_id` and gets an auto-incrementing `session_id`.
- Saved sessions are stored in BigQuery with explanation + optional comment.
- Uses IAM role managers to ensure only authorized users can access the data.

---

## 🧪 Local Development with GCP Services

> While the system is not yet deployed, it uses **live GCP services** from your local environment.

### ✅ Requirements

- Python 3.10+
- Node.js + npm
- GCP Project with:
  - Vertex AI API enabled
  - BigQuery dataset and tables created
  - Cloud Storage bucket for service keys
  - Secret Manager storing Gemini API key

---

## ⚙️ Local Setup

### 🔹 Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### 🔹 Frontend
```
cd frontend/logwise-frontend
npm install
npm run dev
```

### 🚀 Future Scope
The following enhancements are planned and can serve as future milestones:

🚀 Deploy frontend to Firebase Hosting or Cloud Run

🚀 Deploy backend to Cloud Run with Docker

📄 Export session logs and explanations to PDF for reporting