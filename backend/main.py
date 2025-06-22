from fastapi import FastAPI
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow requests from your React frontend (e.g. localhost:3000)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add production frontend URL here if deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # <- frontend URLs
    allow_credentials=True,
    allow_methods=["*"],            # <- allow all methods like POST, GET, etc.
    allow_headers=["*"],            # <- allow all headers including Authorization
)

# Include routes
from routes.logs import router as logs_router
from routes.explain import router as explain_router

app.include_router(logs_router, prefix="/logs")
app.include_router(explain_router, prefix="/explain")
