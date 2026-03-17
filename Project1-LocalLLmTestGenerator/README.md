# 🧪 Local LLM Test Case Generator

A secure, local-first application that generates professional QA test suites from feature requirements using **React**, **FastAPI**, and **Ollama**. No data leaves your machine.

---

## 🏗️ Architecture Diagram

```mermaid
flowchart TB
    Start([👤 User Opens App]) --> UI[⚛️ React Frontend<br/>localhost:5173]
    UI --> Input{User Enters<br/>Feature Requirement}
    
    Input -->|API Call| FastAPI[⚡ FastAPI Backend<br/>localhost:8000]
    FastAPI -->|HTTP Request| Ollama[🦙 Ollama API<br/>localhost:11434]
    
    subgraph Local_Machine[🖥️ Local Machine - No Internet Required]
        Ollama -->|Load Model| Model{🧠 LLM Model<br/>gemma3:1b/llama3.2}
        Model -->|Generate| Response[📄 JSON Response]
        Response -->|Validate Schema| Check{Valid JSON?}
        Check -->|No| Retry[🔄 Retry Logic<br/>Max 2 attempts]
        Retry --> Model
        Check -->|Yes| Return[✅ Return Test Suite]
    end
    
    Return --> FastAPI
    FastAPI --> UI
    
    UI --> Display[🎨 Render UI Components]
    
    Display --> Tab1[👁️ Visual Cards View]
    Display --> Tab2[💻 JSON View]
    Display --> Export[📊 CSV Export]
    
    Tab1 --> End([✨ User Reviews Results])
    Tab2 --> End
    Export --> End
    
    style Local_Machine fill:#1a1a2e,stroke:#16213e,stroke-width:3px
    style Model fill:#0f3460,stroke:#e94560,stroke-width:2px
    style End fill:#16213e,stroke:#e94560,stroke-width:2px
```

---

## 🚀 Features
- **Modern React UI**: High-performance, responsive interface built with Vite and Framer Motion.
- **FastAPI Layer**: Dedicated backend for efficient model management and generation logic.
- **100% Local**: Uses Ollama API; no cloud tokens or internet required.
- **Structured Output**: Generates strict JSON for reliable parsing.
- **Multi-Model Support**: Switch between `gemma3:1b`, `llama3.2`, `mistral`, etc.
- **Export Ready**: Download test cases as **CSV** or view as **JSON**.

## 📂 Project Structure
```bash
Project1-LocalTestCaseGenerator/
├── architecture/         # SOPs and Logic Blueprints
├── backend/              # FastAPI Server & Core Logic
│   ├── main.py           # API Endpoints
│   ├── generator.py      # Ollama interaction logic
│   └── requirements.txt  # Python dependencies
├── frontend-react/       # Modern React UI (Vite)
│   ├── src/
│   │   ├── App.jsx       # Main UI Component
│   │   └── App.css       # Premium Styling
│   └── package.json
├── tools/                # Utility Scripts
└── README.md             # Documentation
```

## 🛠️ Prerequisites
1.  **Ollama**: [Download Ollama](https://ollama.com/) and run it.
2.  **Pull a Model**:
    ```bash
    ollama pull gemma3:1b
    ```
3.  **Python 3.10+** & **Node.js 18+**

## ⚡ Quick Start

### 1. Setup Backend
```bash
# In the project root
pip install -r backend/requirements.txt
uvicorn backend.main:app --port 8000
```

### 2. Setup Frontend
```bash
# In a new terminal
cd frontend-react
npm install
npm run dev
```

### 3. Generate Tests
- Open `http://localhost:5173`.
- Select your model in the sidebar.
- Type a requirement and get your test suite!

---

## 🛡️ License
MIT
