// Verification and cURL Test Script for Ayup Tech Data Import & All 7 Monthly Reports
const http = require('http');

const API_BASE = 'http://localhost:5000/api/salary-structure';

function postRequest(url, data = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(body), raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(body), raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('================================================================');
  console.log('STEP 1: IMPORTING AYUP TECH DATA VIA cURL / HTTP POST ENDPOINT');
  console.log('================================================================\n');

  try {
    const importRes = await postRequest(`${API_BASE}/import-ayup-tech-data`);
    console.log(`Status: ${importRes.status}`);
    console.log('Response:', JSON.stringify(importRes.json || importRes.raw, null, 2));

    if (importRes.status !== 200) {
      console.error('Failed to import Ayup Tech data!');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error importing data:', err);
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('STEP 2: TESTING DYNAMIC FILTER OPTIONS ENDPOINT');
  console.log('================================================================\n');

  try {
    const filterRes = await getRequest(`${API_BASE}/monthly-reports-filter-options`);
    console.log(`Filter Options Status: ${filterRes.status}`);
    if (filterRes.json) {
      console.log('Departments:', filterRes.json.departments);
      console.log('Designations:', filterRes.json.designations);
      console.log('Staff Types:', filterRes.json.staffTypes);
      console.log('Salary Accounts:', filterRes.json.salaryAccounts);
      console.log('Banks:', filterRes.json.banks);
      console.log('Months:', filterRes.json.months);
      console.log('Total Employees in dropdown:', (filterRes.json.employees || []).length);
    }
  } catch (err) {
    console.error('Error fetching filter options:', err.message);
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('STEP 3: VERIFYING ALL 7 MONTHLY SALARY REPORT ENDPOINTS');
  console.log('================================================================\n');

  const reports = [
    { name: '1. Department wise Report', path: '/department-wise-report?monthYear=Aug-2026' },
    { name: '2. Consolidated Salary Statement', path: '/consolidated-salary-statement?monthYear=Aug-2026' },
    { name: '3. Gross Salary Report', path: '/gross-salary-report?monthYear=Aug-2026' },
    { name: '4. Month Wise Salary Report', path: '/month-wise-salary-report' },
    { name: '5. Monthly Summary Report', path: '/monthly-summary-report?monthYear=Aug-2026' },
    { name: '6. Head Wise Gross Salary Report', path: '/head-wise-gross-salary-report?monthYear=Aug-2026' },
    { name: '7. Staff Statement', path: '/staff-statement?monthYear=Aug-2026' }
  ];

  let allPassed = true;

  for (const rep of reports) {
    try {
      const url = `${API_BASE}${rep.path}`;
      const res = await getRequest(url);
      const containsAyup = res.raw && res.raw.includes('Ayup');

      if (res.status === 200 && containsAyup) {
        console.log(`✅ [PASS] ${rep.name}`);
        console.log(`   URL: ${url}`);
        console.log(`   Status: ${res.status}, Ayup Tech Data: Found\n`);
      } else {
        console.log(`❌ [FAIL] ${rep.name}`);
        console.log(`   URL: ${url}`);
        console.log(`   Status: ${res.status}, Contains Ayup: ${containsAyup}\n`);
        allPassed = false;
      }
    } catch (e) {
      console.log(`❌ [ERROR] ${rep.name}: ${e.message}\n`);
      allPassed = false;
    }
  }

  console.log('================================================================');
  if (allPassed) {
    console.log('🎉 ALL AYUP TECH DATA IMPORT & 7 REPORT ENDPOINTS VERIFIED 100%!');
    console.log('================================================================');
    process.exit(0);
  } else {
    console.log('⚠️ SOME ENDPOINTS FAILED VERIFICATION');
    console.log('================================================================');
    process.exit(1);
  }
}

run();
