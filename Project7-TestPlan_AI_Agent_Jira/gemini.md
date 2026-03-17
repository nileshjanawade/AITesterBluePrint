# 📜 gemini.md — Project Constitution
# Project 7: AI Agent Jira Test Plan

> **STATUS:** 🔴 INCOMPLETE — Awaiting Phase 1 Discovery Answers
> **Last Updated:** 2026-02-21
> **Framework:** B.L.A.S.T. | Architecture: A.N.T. (3-Layer)

---

> ⚠️ **THIS FILE IS LAW.**
> No schema, rule, or architecture change is valid until it is reflected here.
> No code in `tools/` shall deviate from the schemas defined below.

---

## 1. 🎯 Project North Star

> *(To be defined after Phase 1 Discovery Questions)*

**Goal:** Build an AI-powered test plan agent that reads Jira project data and
automatically generates, organizes, and delivers structured test plans.

---

## 2. 📐 Data Schema (Input / Output Shapes)

> ⚠️ **CODING IS BLOCKED** until this section is confirmed by the user.

### 2.1 Input Payload (Raw)

```json
{
  "jira_project_key": "STRING — e.g., 'PROJ'",
  "sprint_id": "STRING | NULL — specific sprint, or null for all",
  "issue_types": ["Story", "Bug", "Task"],
  "filter_labels": ["STRING"],
  "jira_base_url": "STRING — e.g., 'https://yourorg.atlassian.net'",
  "jira_user_email": "STRING",
  "jira_api_token": "STRING — from .env"
}
```

### 2.2 Processed Output Payload

```json
{
  "test_plan": {
    "project_key": "STRING",
    "sprint": "STRING",
    "generated_at": "ISO8601 timestamp",
    "test_cases": [
      {
        "jira_issue_id": "STRING — e.g., 'PROJ-123'",
        "summary": "STRING",
        "issue_type": "STRING",
        "priority": "STRING",
        "test_objective": "STRING — AI-generated",
        "preconditions": ["STRING"],
        "test_steps": [
          {
            "step_number": "INTEGER",
            "action": "STRING",
            "expected_result": "STRING"
          }
        ],
        "acceptance_criteria": ["STRING"],
        "test_category": "STRING — e.g., Functional / Regression / Smoke"
      }
    ]
  },
  "delivery": {
    "method": "STRING — e.g., Jira | Slack | Email | Google Sheets",
    "destination": "STRING — channel, email, sheet URL etc.",
    "status": "SUCCESS | FAILED",
    "delivered_at": "ISO8601 timestamp"
  }
}
```

> **NOTE:** These schemas are DRAFT placeholders. They will be locked after
> Phase 1 Discovery Answers are received and confirmed.

---

## 3. 📏 Behavioral Rules

> Rules governing how the system must act. Updated only when a new rule is added.

| # | Rule | Description |
|---|------|-------------|
| R1 | Data-First | No tool in `tools/` is written before the schema above is confirmed |
| R2 | No Guessing | System never guesses at business logic. If ambiguous, it halts and asks. |
| R3 | Atomic Tools | Each Python script in `tools/` does exactly one thing |
| R4 | Self-Annealing | On any error: Analyze → Patch → Test → Update `architecture/` SOP |
| R5 | Ephemeral Intermediates | All intermediate data goes in `.tmp/` only |
| R6 | Payload is Law | A task is only "Done" when the payload reaches its cloud destination |
| R7 | Constitution First | Any schema or rule change must be reflected here before code changes |

---

## 4. 🏛️ Architectural Invariants

| Layer | Location | Rule |
|-------|----------|------|
| Layer 1 — Architecture | `architecture/` | SOPs in Markdown. Updated before code changes. |
| Layer 2 — Navigation | Agent (this system) | Routes data. Does not perform tasks itself. |
| Layer 3 — Tools | `tools/` | Deterministic Python. Atomic & testable. No business logic assumptions. |

---

## 5. 🔌 Integrations (Draft)

> *(To be confirmed in Phase 1 Discovery)*

| Service | Purpose | Credentials Location | Status |
|---------|---------|---------------------|--------|
| Jira | Source of Truth (Issues/Sprints) | `.env` → `JIRA_API_TOKEN`, `JIRA_BASE_URL`, `JIRA_EMAIL` | ⬜ Not Verified |
| *(TBD)* | Delivery channel | `.env` | ⬜ Not Confirmed |

---

## 6. 📁 File Structure

```
Project7-TestPlan_AI_Agent_Jira/
├── gemini.md               # ← YOU ARE HERE | Project Constitution & Law
├── task_plan.md            # Phase checklist & goals
├── findings.md             # Research, discoveries, constraints
├── progress.md             # Execution log, errors, test results
├── B.L.A.S.T.md            # Framework protocol reference
├── .env                    # API Keys/Secrets (created in Phase 2)
├── architecture/           # Layer 1: SOPs (created in Phase 3)
├── tools/                  # Layer 3: Python scripts (created in Phase 3)
└── .tmp/                   # Ephemeral workbench (created in Phase 3)
```

---

## 7. 🔧 Maintenance Log

> *(Finalized in Phase 5 — Trigger)*

| Date | Change | Reason | Updated By |
|------|--------|--------|------------|
| 2026-02-21 | Initial constitution created | Phase 0 Initialization | System Pilot |

---

*End of Project Constitution — gemini.md is law.*
