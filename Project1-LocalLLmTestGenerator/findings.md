# Findings & Research

## Constraints
- **Model**: Preference `llama3.1` or `llama3.2`.
- **Constraint**: `llama3.2` pull is currently very slow (est 2h).
- **Fallback**: Can fallback to `gemma3:1b` for immediate testing if needed.
- **Integration**: Local Ollama only.
- **UI**: Streamlit chat interface required.

## Discoveries
### Ollama Python API
- **Installation**: `pip install ollama`
- **Structured Output**: Confirmed via `format` parameter.
- **Key Method**: `ollama.chat`.

### Phase 2: Link
- Python dependencies (`ollama`, `streamlit`) are installing.
- Ollama connection is being verified.
