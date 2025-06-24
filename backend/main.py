from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Include routes
from routes.dashboard import router as dashboard_route
from routes.logs import router as logs_router
from routes.explain import router as explain_router
from routes.investigation import router as investigation_router

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:8000",
    # Add production frontend URL here if deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # <- frontend URLs
    allow_credentials=True,
    allow_methods=["*"],            # <- allow all methods like POST, GET, etc.
    allow_headers=["*"],            # <- allow all headers including Authorization
)

# Register routers
app.include_router(logs_router, prefix="/logs")
app.include_router(explain_router, prefix="/explain")
app.include_router(dashboard_route, prefix="/dashboard")
app.include_router(investigation_router, prefix="/investigation")