from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Add parent directory to path to import generator
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend import generator
import ollama

app = FastAPI(title="TestGen.AI API")

# Enable CORS for React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequirementRequest(BaseModel):
    requirement: str
    model: str = "gemma3:1b"

class TestCase(BaseModel):
    id: str
    title: str
    description: str
    preconditions: str
    steps: List[str]
    expected_result: str
    priority: str

class TestSuiteResponse(BaseModel):
    suite_name: str
    cases: List[TestCase]

@app.get("/models")
async def get_models():
    """Lists available Ollama models."""
    try:
        models_response = ollama.list()
        return {"models": [m.model for m in models_response.models]}
    except Exception as e:
        # Fallback if Ollama is not reachable or list fails
        return {"models": ["gemma3:1b", "llama3.2", "llama3.1", "mistral"], "warning": str(e)}

@app.post("/generate", response_model=TestSuiteResponse)
async def generate_tests(request: RequirementRequest):
    """Generates test cases from a requirement."""
    try:
        data = generator.generate_test_cases(request.requirement, model=request.model)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
