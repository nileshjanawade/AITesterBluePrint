# QA Automation & Testing Progress Report

## 1. Tool Configuration & Strategy
As a QA Automation Architect, the following tools have been configured and verified for this workflow:
* **Playwright MCP:** Enabled for browser automation and UI execution. Responsible for launching browser sessions, executing UI steps, and capturing screenshots when a test case fails.
* **JIRA MCP:** Enabled for defect creation and issue tracking. Configured to automatically log bugs for failed test cases.
* **Reporting:** Execution reports and screenshots are captured locally, and their paths or contents are attached/referenced in the JIRA ticket for traceability.

---

## 2. Manual Test Cases Designed
The following 5 test cases have been designed for the Login functionality at `https://app.vwo.com` as requested.

### Test Case 1: Valid Login
* **Test Case ID:** TC01
* **Summary:** Verify successful login with valid credentials (Positive Scenario)
* **Preconditions:** User has a valid registered account and is on the login page (`https://app.vwo.com/#/login`).
* **Test Steps:**
  1. Enter the valid registered email address in the "Email address" field.
  2. Enter the valid password associated with the account in the "Password" field.
  3. Click on the "Sign in" button.
* **Test Data:** 
  * Email: `valid.user@company.com` 
  * Password: `ValidPassword123!`
* **Expected Result:** The user is successfully authenticated and redirected to the VWO application dashboard.

### Test Case 2: Invalid password
* **Test Case ID:** TC02
* **Summary:** Verify login fails with a valid email but an incorrect password (Negative Scenario)
* **Preconditions:** User has a valid registered account and is on the login page.
* **Test Steps:**
  1. Enter the valid registered email address in the "Email address" field.
  2. Enter an incorrect password that does not belong to the account.
  3. Click on the "Sign in" button.
* **Test Data:** 
  * Email: `valid.user@company.com` 
  * Password: `WrongPassword999!`
* **Expected Result:** Login fails. The system displays an error notification (e.g., *"Your email, password, IP address or location did not match"*).

### Test Case 3: Invalid email format
* **Test Case ID:** TC03
* **Summary:** Verify login fails when using an invalid email format (Negative Scenario)
* **Preconditions:** User is on the login page.
* **Test Steps:**
  1. Enter an improperly formatted string missing the `@` symbol or domain in the "Email address" field.
  2. Enter any password in the "Password" field.
  3. Click on the "Sign in" button.
* **Test Data:** 
  * Email: `invalidemailformat.com` 
  * Password: `AnyPassword1!`
* **Expected Result:** Login is blocked. A frontend validation error message is displayed directly beneath the email input field.

### Test Case 4: Login using Arabic or Chinese characters
* **Test Case ID:** TC04
* **Summary:** Verify login behavior when using international characters (Arabic/Chinese) in the email field (Edge Case)
* **Preconditions:** User is on the login page.
* **Test Steps:**
  1. Enter an email address containing non-ASCII international characters in the "Email address" field.
  2. Enter any password in the "Password" field.
  3. Click on the "Sign in" button.
* **Test Data:** 
  * Email: `اختبار@domain.com` (or `测试@domain.com`) 
  * Password: `AnyPassword1!`
* **Expected Result:** Login fails. The application handles the international characters gracefully without crashing and displays a standard invalid credentials or invalid format notification.

### Test Case 5: Dummy username and password login
* **Test Case ID:** TC05
* **Summary:** Verify login fails when using unregistered dummy credentials (Negative Scenario)
* **Preconditions:** User is on the login page.
* **Test Steps:**
  1. Enter an unregistered dummy email address in the "Email address" field.
  2. Enter a dummy password in the "Password" field.
  3. Click on the "Sign in" button.
* **Test Data:** 
  * Email: `dummy.user.doesnotexist@domain.com` 
  * Password: `DummyPassword123!`
* **Expected Result:** Login fails. The system securely denies access and displays the standard error notification to prevent user enumeration.
