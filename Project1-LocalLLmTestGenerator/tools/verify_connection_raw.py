
import urllib.request
import json
import sys

# Force UTF-8 stdout if possible, or just avoid emojis
sys.stdout.reconfigure(encoding='utf-8')

def check_connection():
    url = "http://localhost:11434/api/tags"
    print(f"Checking connection to {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                print("Connection Successful!")
                # Extract simple names
                model_names = [m.get('name', 'unknown') for m in data.get('models', [])]
                print(f"Available Models: {model_names}")
                return True
            else:
                print(f"Connection Status: {response.status}")
                return False
    except Exception as e:
        print(f"Connection Failed: {e}")
        return False

if __name__ == "__main__":
    if check_connection():
        sys.exit(0)
    else:
        sys.exit(1)
