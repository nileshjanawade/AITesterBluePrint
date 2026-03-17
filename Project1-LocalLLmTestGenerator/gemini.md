# Project Constitution: Local LLM Test Case Generator

## 1. Data Schemas

### TestCase (The core unit of work)
```json
{
  "id": "TC001",
  "title": "Verify Login with Valid Credentials",
  "description": "Ensure user can log in with correct username and password.",
  "preconditions": "User is on the login page.",
  "steps": [
    "Enter valid username",
    "Enter valid password",
    "Click 'Login' button"
  ],
  "expected_result": "User is redirected to the dashboard.",
  "priority": "High"
}
```

### TestCaseSuite (The collection)
```json
{
  "suite_name": "Login Functionality Tests",
  "cases": [ ...array of TestCase... ]
}
```

## 2. Behavioral Rules
- **Reliability First**: Prioritize deterministic outputs over speed.
- **Local Execution**: All LLM inference must happen via local Ollama instance (`llama3.1` or `llama3.2`).
- **Structured Output**: Test cases must be generated in the defined JSON format.
- **UI Focus**: Provide a clean Chat Interface for the user.

## 3. Architectural Invariants
- **Model**: Ollama (`llama3.1` / `llama3.2`).
- **Language**: Python.
- **Framework**: Streamlit (for UI).
- **Structure**: A.N.T. 3-layer architecture (Adapter, Nexus, Tool).
