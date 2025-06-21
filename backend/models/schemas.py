from pydantic import BaseModel

class ExplainRequest(BaseModel):
    log_message: str
    project_description: str



