import sys
import os
import pandas as pd

# Add project root to sys.path to allow importing backend module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import streamlit as st
from backend import generator
import json

# --- CONFIGURATION & STYLING ---
st.set_page_config(
    page_title="TestGen.AI", 
    page_icon="⚡", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Premium Feel
st.markdown("""
<style>
    /* Global Font & Theme */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    /* Main Container Padding */
    .block-container {
        padding-top: 2rem;
        padding-bottom: 5rem;
    }

    /* Headers */
    h1, h2, h3 {
        color: #f0f2f6; /* Off-white for dark mode */
        font-weight: 700;
    }

    /* Test Case Card Styling */
    .test-card {
        background-color: #262730;
        border: 1px solid #464b5d;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        transition: transform 0.2s;
    }
    .test-card:hover {
        border-color: #ff4b4b; /* Streamlit Red accent */
    }
    
    /* Metrics / Status */
    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .status-high { background-color: #ff4b4b; color: white; }
    .status-medium { background-color: #ffa421; color: black; }
    .status-low { background-color: #21c354; color: black; }

</style>
""", unsafe_allow_html=True)

# --- SIDEBAR ---
with st.sidebar:
    st.title("⚡ TestGen.AI")
    st.caption("Local LLM Test Automation Blueprint")
    
    st.divider()
    
    st.header("⚙️ Configuration")
    
    # Dynamically fetch available models
    try:
        import ollama
        models_response = ollama.list()
        available_models = [m.model for m in models_response.models]
        if not available_models:
            available_models = ["gemma3:1b", "llama3.2", "llama3.1", "mistral"]
            st.warning("No models found. Please run: `ollama pull gemma3:1b`")
    except Exception as e:
        available_models = ["gemma3:1b", "llama3.2", "llama3.1", "mistral"]
        st.warning(f"Could not fetch models: {e}")
    
    selected_model = st.selectbox("🤖 Local Model", available_models, index=0)
    
    # Status Indicator
    if st.button("🔌 Check Connection", use_container_width=True):
        with st.spinner(f"Pinging {selected_model}..."):
            status = generator.check_ollama(selected_model)
            if status:
                st.toast(f"Connected to {selected_model}")
                st.success("System Online")
            else:
                st.toast(f"Connection Failed: {selected_model}")
                st.error("Model Offline")
    
    st.divider()
    st.markdown("### 📝 Instructions")
    st.markdown("""
    1. Select your local Ollama model.
    2. Type a feature description below.
    3. Review and download the generated test plan.
    """)

# --- MAIN INTERFACE ---
st.title("Test Case Generator")
st.markdown("Turning requirements into structured **QA Test Suites** strictly using your local LLM.")

# Initialize Chat
if "messages" not in st.session_state:
    st.session_state.messages = []

# Render Chat History
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        if message["role"] == "user":
            st.markdown(message["content"])
        else:
            # Re-render structured content if it exists in history
            # For simplicity in history, we just show the summary text
            if isinstance(message["content"], str):
                 st.markdown(message["content"])

# Input Handling
if prompt := st.chat_input("What feature are we testing today? (e.g., 'User Registration with E-mail verification')"):
    
    # 1. User Message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # 2. Assistant Generation
    with st.chat_message("assistant"):
        placeholder = st.empty()
        with st.spinner(f"🧠 {selected_model} is analyzing requirements..."):
            try:
                # Core Logic Call
                response_data = generator.generate_test_cases(prompt, model=selected_model)
                
                # --- RENDERING THE PAYLOAD ---
                suite_name = response_data.get('suite_name', 'Untitled Test Suite')
                cases = response_data.get('cases', [])
                
                st.subheader(f"📋 {suite_name}")
                st.caption(f"Generated {len(cases)} test cases based on: '{prompt}'")
                
                # Tabbed View for Better UX
                tab_visual, tab_json, tab_csv = st.tabs(["👁️ Visual Cards", "💻 JSON", "📄 Table Export"])
                
                with tab_visual:
                    for case in cases:
                        priority_color = "status-low"
                        p = case.get('priority', 'Medium').lower()
                        if 'high' in p: priority_color = "status-high"
                        elif 'medium' in p: priority_color = "status-medium"
                        
                        with st.expander(f"{case.get('id')} - {case.get('title')}"):
                            st.markdown(f"**Description:** {case.get('description')}")
                            st.markdown(f"**Preconditions:** `{case.get('preconditions')}`")
                            
                            col1, col2 = st.columns(2)
                            with col1:
                                st.markdown("**Steps:**")
                                for i, step in enumerate(case.get('steps', [])):
                                    st.markdown(f"{i+1}. {step}")
                            with col2:
                                st.markdown("**Expected Result:**")
                                st.info(case.get('expected_result'))
                                st.markdown(f"**Priority:** <span class='status-badge {priority_color}'>{case.get('priority')}</span>", unsafe_allow_html=True)

                with tab_json:
                    st.json(response_data)

                with tab_csv:
                    # Convert to DataFrame for easy export
                    df = pd.DataFrame(cases)
                    st.dataframe(df)
                    csv = df.to_csv(index=False).encode('utf-8')
                    st.download_button(
                        label="⬇️ Download CSV",
                        data=csv,
                        file_name=f"test_cases_{suite_name.replace(' ', '_')}.csv",
                        mime="text/csv"
                    )
                
                # Save just the summary to history to keep it clean, 
                # but in a real app we might store the full object.
                st.session_state.messages.append({"role": "assistant", "content": f"✅ Generated Test Suite: **{suite_name}** ({len(cases)} cases). See detailed view above."})
                
            except Exception as e:
                st.error(f"❌ Custom Error: {str(e)}")
