import ollama
import json
import time

def check_ollama(model_name="llama3.2"):
    """
    Checks if Ollama is accessible and the model is available.
    Returns True ONLY if connection works and model is listable (or fuzzy match).
    """
    try:
        models = ollama.list()
        available_models = [m.model for m in models.models]
        
        # Check for exact or partial match (e.g., 'gemma3:1b' matching 'gemma3:1b:latest')
        if any(model_name in m for m in available_models):
            return True
            
        print(f"WARNING: Model '{model_name}' not found. Available: {available_models}")
        return False
    except Exception as e:
        print(f"ERROR: Ollama connection error: {e}")
        return False

def generate_test_cases(requirement, model="llama3.2"):
    """
    Generates structured test cases for the given requirement using Ollama.
    Implements SOP logic: Validation -> Execution -> Retry -> Parsing.
    """
    if not requirement or not requirement.strip():
        raise ValueError("Requirement cannot be empty.")

    prompt = f"""
    You are a QA Expert. Generate a comprehensive test suite for the following requirement:
    "{requirement}"
    
    Return the result strictly as a valid JSON object matching this structure:
    {{
      "suite_name": "Title of the test suite",
      "cases": [
        {{
          "id": "TC001",
          "title": "Test Case Title",
          "description": "Brief description",
          "preconditions": "Any setup required",
          "steps": ["Step 1", "Step 2"],
          "expected_result": "What should happen",
          "priority": "High/Medium/Low"
        }}
      ]
    }}
    """

    max_retries = 2
    for attempt in range(max_retries):
        try:
            response = ollama.chat(
                model=model,
                messages=[{'role': 'user', 'content': prompt}],
                format='json', 
                options={'temperature': 0.2} 
            )
            
            content = response['message']['content']
            data = json.loads(content)
            
            # Simple Schema Validation
            if "cases" not in data or not isinstance(data["cases"], list):
                if attempt < max_retries - 1:
                    print(f"WARNING: Invalid structure received, retrying... (Attempt {attempt+1})")
                    continue
                else:
                    raise ValueError("LLM returned invalid JSON structure (missing 'cases' list).")
            
            return data
            
        except json.JSONDecodeError:
            if attempt < max_retries - 1:
                print(f"WARNING: JSON Decode Error, retrying... (Attempt {attempt+1})")
                continue
            raise Exception("Failed to parse JSON response from LLM.")
        except Exception as e:
            raise Exception(f"Generation failed: {str(e)}")
