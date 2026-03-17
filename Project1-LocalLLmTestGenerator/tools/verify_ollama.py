
import ollama
import sys

def verify_ollama_setup():
    print("Initiating Ollama Handshake...")
    
    # 1. Check if model is pulled
    try:
        models = ollama.list()
        print(f"Connected to Ollama. Found {len(models.models)} models.")
        
        target_model = "llama3.2"
        model_names = [m.model for m in models.models]
        
        # Check for full name or partial match (e.g. llama3.2:latest)
        found = any(target_model in name for name in model_names)
        
        if not found:
            print(f"Warning: Target model '{target_model}' not found in {model_names}")
            # Try to find ANY available model to verify connection
            if models.models:
                fallback = models.models[0].model
                print(f"Falling back to available model: '{fallback}' for connection test.")
                target_model = fallback
            else:
                print(f"No models found. Please run: ollama pull {target_model}")
                return False
        else:
            print(f"Target model '{target_model}' is present.")

        # 2. Test Generation
        print(f"Testing generation with '{target_model}'...")
        response = ollama.chat(model=target_model, messages=[
          {
            'role': 'user',
            'content': 'Say "Hello, World!" if you are working.'
          },
        ])
        print(f"Model Response: {response['message']['content']}")
        print("Handshake Complete. System is ready for Phase 3.")
        return True

    except Exception as e:
        print(f"Handshake Failed: {e}")
        return False

if __name__ == "__main__":
    success = verify_ollama_setup()
    sys.exit(0 if success else 1)
