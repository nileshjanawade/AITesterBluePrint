import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Send,
  Settings,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  ChevronRight,
  ChevronDown,
  Database,
  ShieldCheck,
  Zap,
  LayoutGrid,
  FileJson,
  Table as TableIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_BASE = "http://localhost:8000";

function App() {
  const [requirement, setRequirement] = useState("");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("gemma3:1b");
  const [loading, setLoading] = useState(false);
  const [testSuite, setTestSuite] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("visual");
  const [expandedCases, setExpandedCases] = useState({});

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API_BASE}/models`);
      setModels(res.data.models);
      if (res.data.models.length > 0) {
        // Prefer llama if available, else first in list
        const preferred = res.data.models.find(m => m.includes("llama")) || res.data.models[0];
        setSelectedModel(preferred);
      }
    } catch (err) {
      console.error("Failed to fetch models", err);
      setError("Could not connect to backend server. Make sure it's running.");
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!requirement.trim()) return;

    setLoading(true);
    setTestSuite(null);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE}/generate`, {
        requirement,
        model: selectedModel
      });
      setTestSuite(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const downloadCSV = () => {
    if (!testSuite) return;
    const headers = ["ID", "Title", "Description", "Preconditions", "Steps", "Expected Result", "Priority"];
    const rows = testSuite.cases.map(c => [
      c.id,
      c.title,
      c.description,
      c.preconditions,
      c.steps.join('; '),
      c.expected_result,
      c.priority
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `test_suite_${testSuite.suite_name.replace(/\s+/g, '_')}.csv`);
    link.click();
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Zap className="logo-icon" size={28} />
          <h1 className="logo-text">TestGen.AI</h1>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <label><Settings size={16} /> Configuration</label>
            <div className="select-wrapper">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="nav-section instructions">
            <label><AlertCircle size={16} /> Instructions</label>
            <ul>
              <li>Enter feature requirements</li>
              <li>Select your local LLM</li>
              <li>Generate B.L.A.S.T. suite</li>
              <li>Export to CSV or JSON</li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="status-indicator">
            <div className={`dot ${models.length > 0 ? 'online' : 'offline'}`}></div>
            <span>{models.length > 0 ? 'System Online' : 'System Offline'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-title">
            <h2>Test Case Generator</h2>
            <p>Convert requirements into structured QA test suites locally.</p>
          </div>
        </header>

        <section className="input-section">
          <form onSubmit={handleGenerate} className="requirement-form">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="What feature are we testing today? (e.g., 'User Registration with E-mail verification')"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !requirement.trim()} className="generate-btn">
                {loading ? <div className="spinner"></div> : <Send size={20} />}
              </button>
            </div>
          </form>
        </section>

        <section className="results-section">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-message"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          {loading && !testSuite && (
            <div className="loading-state">
              <div className="brain-spinner">
                <Database size={48} className="brain-icon" />
              </div>
              <h3>Analyzing Requirements...</h3>
              <p>{selectedModel} is thinking...</p>
            </div>
          )}

          {testSuite && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="test-suite-viewer"
            >
              <div className="suite-header">
                <div>
                  <h3>{testSuite.suite_name}</h3>
                  <p>{testSuite.cases.length} test cases generated</p>
                </div>
                <div className="tabs">
                  <button
                    className={activeTab === 'visual' ? 'active' : ''}
                    onClick={() => setActiveTab('visual')}
                  >
                    <LayoutGrid size={16} /> Visual
                  </button>
                  <button
                    className={activeTab === 'json' ? 'active' : ''}
                    onClick={() => setActiveTab('json')}
                  >
                    <FileJson size={16} /> JSON
                  </button>
                  <button onClick={downloadCSV} className="export-btn">
                    <Download size={16} /> Export CSV
                  </button>
                </div>
              </div>

              <div className="suite-content">
                {activeTab === 'visual' && (
                  <div className="cases-list">
                    {testSuite.cases.map(case_item => (
                      <div key={case_item.id} className="case-card">
                        <div
                          className="case-card-header"
                          onClick={() => toggleExpand(case_item.id)}
                        >
                          <div className="case-title-row">
                            <span className="case-id">{case_item.id}</span>
                            <span className="case-title">{case_item.title}</span>
                          </div>
                          <div className="case-meta">
                            <span className={`priority-badge ${case_item.priority.toLowerCase()}`}>
                              {case_item.priority}
                            </span>
                            {expandedCases[case_item.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedCases[case_item.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="case-card-body"
                            >
                              <div className="case-detail">
                                <label>Description</label>
                                <p>{case_item.description}</p>
                              </div>
                              <div className="case-detail">
                                <label>Preconditions</label>
                                <code>{case_item.preconditions}</code>
                              </div>
                              <div className="case-grid">
                                <div className="case-detail">
                                  <label>Steps</label>
                                  <ol>
                                    {case_item.steps.map((step, idx) => (
                                      <li key={idx}>{step}</li>
                                    ))}
                                  </ol>
                                </div>
                                <div className="case-detail">
                                  <label>Expected Result</label>
                                  <div className="expected-result-box">
                                    <CheckCircle2 size={16} />
                                    <span>{case_item.expected_result}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'json' && (
                  <div className="json-viewer">
                    <pre>{JSON.stringify(testSuite, null, 2)}</pre>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {!loading && !testSuite && !error && (
            <div className="empty-state">
              <ShieldCheck size={64} strokeWidth={1} />
              <h3>Ready to Generate</h3>
              <p>Type your requirements above and let the local LLM build your test suite.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
