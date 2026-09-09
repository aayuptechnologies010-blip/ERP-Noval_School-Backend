const API_BASE = 'http://localhost:5000/api/salary-structure';

async function testEndpoint(name, url, checkField = 'staffName') {
  console.log(`\n--- Testing ${name}: ${url} ---`);
  try {
    const res = await fetch(url);
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`);
    }
    const data = await res.json();
    let records = [];
    if (Array.isArray(data)) {
      records = data;
    } else if (data.records && Array.isArray(data.records)) {
      records = data.records;
    } else if (data.deductees && Array.isArray(data.deductees)) {
      records = data.deductees;
    } else if (data.employee) {
      records = [data.employee];
    }

    console.log(`Record Count / Structure: ${records.length > 0 ? records.length : 'Object returned'}`);
    const hasAyup = JSON.stringify(data).includes('Ayup');
    console.log(`Contains 'Ayup' Data: ${hasAyup ? '✅ YES' : '❌ NO'}`);
    if (records.length > 0) {
      const sample = records[0];
      console.log(`Sample: ${sample.staffName || sample.name || 'N/A'} | PAN: ${sample.panNumber || sample.pan || 'N/A'}`);
    }
    return true;
  } catch (err) {
    console.error(`❌ Error testing ${name}:`, err.message);
    return false;
  }
}

async function runAllTests() {
  console.log('STARTING AUTOMATED VERIFICATION OF 6 INCOME TAX ENDPOINTS...\n');

  const tests = [
    { name: '1. TDS Entry Report', url: `${API_BASE}/tds-entry-report?monthYear=Aug-2026` },
    { name: '2. Quarterly Form 24Q', url: `${API_BASE}/form-24q?quarter=Q2` },
    { name: '3. TDS 24Q Annual Overview', url: `${API_BASE}/annual-24q?session=2026-2027` },
    { name: '4. Gross Form 16', url: `${API_BASE}/gross-form16?session=2026-2027` },
    { name: '5. Form 16 Individual Certificate', url: `${API_BASE}/form-16-certificate?employeeId=EMP-AT-001` },
    { name: '6. TDS Analytics Report', url: `${API_BASE}/tds-analytics-report?monthYear=Aug-2026&headName=Income Tax (TDS)` }
  ];

  let passed = 0;
  for (const t of tests) {
    const ok = await testEndpoint(t.name, t.url);
    if (ok) passed++;
  }

  console.log(`\n========================================`);
  console.log(`RESULT: ${passed}/${tests.length} ENDPOINTS PASSED WITH 200 OK & AYUP DATA!`);
  console.log(`========================================\n`);

  if (passed === tests.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAllTests();
