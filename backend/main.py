from fastapi import FastAPI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Include routes
from routes.logs import router as logs_router
# from routes.explain import router as explain_router

app.include_router(logs_router, prefix="/logs")
# app.include_router(explain_router, prefix="/explain")
