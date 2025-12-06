// Health check utility for c0lornote
// Usage: node health-check.js

const http = require('http');

const checks = [
  {
    name: 'Backend Server',
    url: 'http://localhost:5000/api/health',
    required: true,
  },
  {
    name: 'MongoDB Connection',
    url: 'http://localhost:5000/api/health',
    required: true,
  },
  {
    name: 'Frontend Server',
    url: 'http://localhost:3000',
    required: false,
  },
];

function checkEndpoint(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const req = http.request(
      {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: 'GET',
        timeout: 5000,
      },
      (res) => {
        resolve({
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
        });
      }
    );

    req.on('error', () => {
      resolve({ status: 0, ok: false });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, ok: false });
    });

    req.end();
  });
}

async function runHealthChecks() {
  console.log('🏥 c0lornote Health Check\n');
  console.log('=' .repeat(50));

  let allPassed = true;

  for (const check of checks) {
    process.stdout.write(`Checking ${check.name}... `);
    const result = await checkEndpoint(check.url);

    if (result.ok) {
      console.log('✓ OK');
    } else {
      console.log('✗ FAILED');
      if (check.required) {
        allPassed = false;
      }
    }
  }

  console.log('=' .repeat(50));

  if (allPassed) {
    console.log('\n✨ All systems operational!\n');
    process.exit(0);
  } else {
    console.log('\n❌ Some services are down. Please check:\n');
    console.log('1. Is MongoDB running? (mongod)');
    console.log('2. Is the backend server running? (npm run dev)');
    console.log('3. Is the frontend server running? (cd client && npm run dev)\n');
    process.exit(1);
  }
}

runHealthChecks();
