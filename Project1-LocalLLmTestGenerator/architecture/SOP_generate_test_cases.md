# SOP: Generate Test Cases

## Goal
Generate a structured, comprehensive test suite for a given feature requirement using a local LLM.

## Inputs
- **Requirement**: Text string describing the feature (e.g., "Login page with 2FA").
- **Model**: The identifier of the Ollama model to use (e.g., "gemma3:1b", "llama3.2").

## Process Logic
1.  **Validation**: Ensure the requirement is not empty.
2.  **Prompt Engineering**:
    *   Role: QA Automation Expert.
    *   Constraint: Return STRICT JSON.
    *   Context: Include the specific JSON schema structure required.
3.  **Execution**:
    *   Call Ollama API with `model`, `messages`, and `format='json'`.
    *   Set `temperature=0.2` for deterministic behavior.
4.  **Parsing**:
    *   Parse the JSON response.
    *   Validate keys: `suite_name`, `cases` (list).
    *   For each case, ensure: `id`, `title`, `steps`, `expected_result`.
5.  **Output**: Return the verified Python Dictionary / JSON.

## Edge Cases
- **Model Offline**: Return specific error "Model not connected".
- **Invalid JSON**: If LLM returns malformed JSON, retry once or return "Generation failed".
- **Empty Response**: Handle gracefully.
