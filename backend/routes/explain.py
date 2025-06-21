from fastapi import APIRouter, HTTPException
from models.schemas import ExplainRequest
from services.llm_explainer import get_llm_explanation

router = APIRouter()

@router.post("")
def explain_log(req: ExplainRequest):
    try:
        explanation = get_llm_explanation(req.log_message, req.project_description)
        return {"explanation": explanation}
    except Exception as e:
        print("🔥 Gemini Error:", e) 
        raise HTTPException(status_code=500, detail=str(e))
