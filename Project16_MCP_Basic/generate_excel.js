const ExcelJS = require('exceljs');

async function createExcelFile() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Test Execution');

  // Define Columns
  worksheet.columns = [
    { header: 'Test Case ID', key: 'id', width: 15 },
    { header: 'Summary', key: 'summary', width: 40 },
    { header: 'Preconditions', key: 'preconditions', width: 35 },
    { header: 'Test Steps', key: 'steps', width: 50 },
    { header: 'Test Data', key: 'data', width: 35 },
    { header: 'Expected Result', key: 'expected', width: 45 },
    { header: 'Actual Result', key: 'actual', width: 30 },
    { header: 'Status (Pass/Fail)', key: 'status', width: 20 },
    { header: 'Screenshot Path', key: 'screenshot', width: 30 },
    { header: 'Execution Timestamp', key: 'timestamp', width: 25 },
  ];

  // Add Test Cases
  worksheet.addRows([
    {
      id: 'TC01',
      summary: 'Verify successful login with valid credentials (Positive Scenario)',
      preconditions: 'User has a valid registered account and is on the login page (https://app.vwo.com/#/login).',
      steps: '1. Enter the valid registered email address in the "Email address" field.\\n2. Enter the valid password associated with the account in the "Password" field.\\n3. Click on the "Sign in" button.',
      data: 'Email: valid.user@company.com\\nPassword: ValidPassword123!',
      expected: 'The user is successfully authenticated and redirected to the VWO application dashboard.',
      actual: '',
      status: '',
      screenshot: '',
      timestamp: ''
    },
    {
      id: 'TC02',
      summary: 'Verify login fails with a valid email but an incorrect password (Negative Scenario)',
      preconditions: 'User has a valid registered account and is on the login page.',
      steps: '1. Enter the valid registered email address in the "Email address" field.\\n2. Enter an incorrect password that does not belong to the account.\\n3. Click on the "Sign in" button.',
      data: 'Email: valid.user@company.com\\nPassword: WrongPassword999!',
      expected: 'Login fails. The system displays an error notification (e.g., "Your email, password, IP address or location did not match").',
      actual: '',
      status: '',
      screenshot: '',
      timestamp: ''
    },
    {
      id: 'TC03',
      summary: 'Verify login fails when using an invalid email format (Negative Scenario)',
      preconditions: 'User is on the login page.',
      steps: '1. Enter an improperly formatted string missing the @ symbol or domain in the "Email address" field.\\n2. Enter any password in the "Password" field.\\n3. Click on the "Sign in" button.',
      data: 'Email: invalidemailformat.com\\nPassword: AnyPassword1!',
      expected: 'Login is blocked. A frontend validation error message is displayed directly beneath the email input field.',
      actual: '',
      status: '',
      screenshot: '',
      timestamp: ''
    },
    {
      id: 'TC04',
      summary: 'Verify login behavior when using international characters (Arabic/Chinese) in the email field (Edge Case)',
      preconditions: 'User is on the login page.',
      steps: '1. Enter an email address containing non-ASCII international characters in the "Email address" field.\\n2. Enter any password in the "Password" field.\\n3. Click on the "Sign in" button.',
      data: 'Email: اختبار@domain.com (or 测试@domain.com)\\nPassword: AnyPassword1!',
      expected: 'Login fails. The application handles the international characters gracefully without crashing and displays a standard invalid credentials or invalid format notification.',
      actual: '',
      status: '',
      screenshot: '',
      timestamp: ''
    },
    {
      id: 'TC05',
      summary: 'Verify login fails when using unregistered dummy credentials (Negative Scenario)',
      preconditions: 'User is on the login page.',
      steps: '1. Enter an unregistered dummy email address in the "Email address" field.\\n2. Enter a dummy password in the "Password" field.\\n3. Click on the "Sign in" button.',
      data: 'Email: dummy.user.doesnotexist@domain.com\\nPassword: DummyPassword123!',
      expected: 'Login fails. The system securely denies access and displays the standard error notification to prevent user enumeration.',
      actual: '',
      status: '',
      screenshot: '',
      timestamp: ''
    }
  ]);

  // Format header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Enable text wrapping for better readability
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
    });
  });

  await workbook.xlsx.writeFile('login_test_cases.xlsx');
  console.log('Excel file generated: login_test_cases.xlsx');
}

createExcelFile().catch(console.error);
