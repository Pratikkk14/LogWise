import os
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key) # type: ignore

print("🔑 GEMINI_API_KEY =", os.getenv("GEMINI_API_KEY"))


model = genai.GenerativeModel('gemini-2.0-flash') # type: ignore

def get_llm_explanation(log_message: str, project_description: str) -> str:
    prompt = f"""
    You are a cloud debugging assistant.
    
    Context: The project is described as follows:
    "{project_description}"
    
    A log was generated with the following message:
    "{log_message}"
    
    Explain in simple terms what this log means. Identify if it suggests 
    an error, performance issue, or normal operation. 
    Be concise and developer-friendly.
    """
    
    response = model.generate_content(prompt)
    return response.text