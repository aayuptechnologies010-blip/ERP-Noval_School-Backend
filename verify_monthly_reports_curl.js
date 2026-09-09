// Test script for verifying all 9 Monthly Salary Report endpoints
const http = require('http');

const baseURL = 'http://localhost:5000/api/salary-structure';

const endpoints = [
  { name: 'Employee Type wise Report', path: '/employee-type-wise-report?monthYear=Aug-2026' },
  { name: 'Estimated Salary Report', path: '/estimated-salary-report' },
  { name: 'Department wise Report', path: '/department-wise-report?monthYear=Aug-2026' },
  { name: 'Consolidated Salary Statement', path: '/consolidated-salary-statement?monthYear=Aug-2026' },
  { name: 'Gross Salary Report', path: '/gross-salary-report?monthYear=Aug-2026' },
  { name: 'Month Wise Salary Report', path: '/month-wise-salary-report' },
  { name: 'Monthly Summary Report', path: '/monthly-summary-report?monthYear=Aug-2026' },
  { name: 'Head Wise Gross Salary Report', path: '/head-wise-gross-salary-report?monthYear=Aug-2026' },
  { name: 'Staff Statement', path: '/staff-statement?monthYear=Aug-2026' }
];

function fetchEndpoint(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data), raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', err => reject(err));
  });
}

async function runVerification() {
  console.log('====================================================');
  console.log('STARTING CURL/HTTP VERIFICATION FOR 9 SALARY REPORTS');
  console.log('====================================================\n');

  let passed = 0;

  for (const ep of endpoints) {
    const fullUrl = `${baseURL}${ep.path}`;
    try {
      const res = await fetchEndpoint(fullUrl);
      const containsAyup = res.raw && res.raw.includes('Ayup');

      if (res.status === 200 && containsAyup) {
        console.log(`✅ [PASS] ${ep.name}`);
        console.log(`   URL: ${fullUrl}`);
        console.log(`   Status: ${res.status}, Contains "Ayup": YES\n`);
        passed++;
      } else {
        console.log(`❌ [FAIL] ${ep.name}`);
        console.log(`   URL: ${fullUrl}`);
        console.log(`   Status: ${res.status}, Contains "Ayup": ${containsAyup}`);
        console.log(`   Raw Preview: ${res.raw ? res.raw.slice(0, 150) : 'No data'}\n`);
      }
    } catch (e) {
      console.log(`❌ [ERROR] ${ep.name}: ${e.message}\n`);
    }
  }

  console.log('====================================================');
  console.log(`RESULTS: ${passed} / ${endpoints.length} ENDPOINTS PASSED`);
  console.log('====================================================');

  if (passed === endpoints.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification();
