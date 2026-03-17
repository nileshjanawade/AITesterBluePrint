# VWO Test Automation: Full Process Documentation

This document provides a step-by-step guide on how we built the VWO Login Test Automation from scratch, including the prompts used and the technical workflow. Use this as a blueprint for your future projects.

---

## Phase 1: Test Case Generation
**Goal:** Generate 5 high-quality manual test cases in JIRA format.

### Step-by-Step Details:
1.  **Identify Requirements:** Focus on both positive (happy path) and negative (error handling) scenarios.
2.  **Define Target URL:** `https://app.vwo.com/#/login`.
3.  **Prompt Used:**
    > *"ROLE: You are a QA Lead with 10+ years of experience. INSTRUCTION: Generate detailed manual test cases for the Login functionality of https://app.vwo.com. Create exactly FIVE test cases covering: 1 Valid Login, 2 Invalid password, 3 Invalid email format, 4 Arabic/Chinese characters, 5 Dummy credentials. FORMAT: ID, Summary, Preconditions, Steps, Data, Expected Result."*

---

## Phase 2: Excel Execution Sheet Creation
**Goal:** Convert manual test cases into a structured Excel file for automation.

### Step-by-Step Details:
1.  **Define Structure:** Create columns for ID, Summary, Data, Expected, Actual, Status, Screenshot, and Timestamp.
2.  **Automation Script:** Used the `exceljs` library in Node.js to programmatically create the `.xlsx` file.
3.  **Prompt Used:**
    > *"Task: Convert the generated test cases into an Excel test execution file named 'login_test_cases.xlsx'. Include columns: ID, Summary, Preconditions, Steps, Test Data, Expected Result, Actual Result, Status (Pass/Fail), Screenshot Path, and Execution Timestamp."*

---

## Phase 3: Automated Execution (Playwright)
**Goal:** Run the test cases automatically and capture outcomes.

### Step-by-Step Details:
1.  **Setup Playwright:** Initialize a Node.js project with `playwright` and `chromium`.
2.  **Logic:** The script reads the Excel file, navigates to the URL for each test case, enters data from the "Test Data" column, and clicks "Sign in".
3.  **Forced Failure:** To demonstrate bug tracking, we forced TC04 to return a "Fail" status.
4.  **Screenshot Capture:** Used `page.screenshot()` only if the status was "Fail".

---

## Phase 4: JIRA Bug Creation
**Goal:** Automatically log a professional bug for the failed test case.

### Step-by-Step Details:
1.  **Structure:** Use a standard bug template (Description, Steps to Reproduce, Expected, Actual, and Evidence).
2.  **JIRA MCP Tool:** Used `createJiraIssue` to send the payload to the Cloud ID and Project.
3.  **Prompt Used:**
    > *"Create a professional JIRA bug for TC04. Include ID, Severity, Steps to Reproduce, Expected vs Actual results, and reference the screenshot path in the description."*

---

## Phase 5: Premium HTML Reporting
**Goal:** Create a visual executive dashboard.

### Step-by-Step Details:
1.  **Styling:** Used modern CSS (Google Fonts 'Inter', Dark Mode, Gradients) for a premium feel.
2.  **Dynamic Content:** Linked the failed test ID to the JIRA Bug ID generated in Phase 4.
3.  **Prompt Used:**
    > *"Generate a beautiful, premium HTML report from the execution results. Use a dark-mode dashboard style, highlight Pass/Fail with badges, embed screenshot thumbnails, and mention the JIRA Bug ID for the failed cases."*

---

## Tips for Your Next Project 🚀
- **Prompt Engineering:** Always define the **ROLE** (QA Manager, Developer) before the task.
- **Traceability:** Always include the **Test Case ID** in your JIRA titles and Screenshots to link them back to the original plan.
- **Wait Strategies:** Use `page.waitForSelector()` instead of fixed timeouts to make your automation faster and more stable.
- **Reporting:** A visual HTML report is often more valuable to stakeholders than a simple terminal log or Excel file.
