// Simple API test file for c0lornote
// Run with: node test-api.js

const http = require('http');

const BASE_URL = 'http://localhost:5000';
let authToken = null;

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🎨 Testing c0lornote API\n');

  try {
    // Test 1: Health check
    console.log('Test 1: Health Check');
    const health = await makeRequest('GET', '/api/health');
    console.log(`Status: ${health.status}`);
    console.log(`Response:`, health.data);
    console.log(health.status === 200 ? '✓ PASSED\n' : '✗ FAILED\n');

    // Test 2: Welcome endpoint
    console.log('Test 2: Welcome Endpoint');
    const welcome = await makeRequest('GET', '/');
    console.log(`Status: ${welcome.status}`);
    console.log(`Response:`, welcome.data);
    console.log(welcome.status === 200 ? '✓ PASSED\n' : '✗ FAILED\n');

    // Test 3: Register user
    console.log('Test 3: Register User');
    const registerData = {
      username: 'testuser_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      displayName: 'Test User',
    };
    const register = await makeRequest('POST', '/api/auth/register', registerData);
    console.log(`Status: ${register.status}`);
    console.log(`Response:`, register.data);
    if (register.status === 201 && register.data.token) {
      authToken = register.data.token;
      console.log('✓ PASSED\n');
    } else {
      console.log('✗ FAILED\n');
      return;
    }

    // Test 4: Get user profile
    console.log('Test 4: Get User Profile');
    const profile = await makeRequest('GET', '/api/users/me', null, authToken);
    console.log(`Status: ${profile.status}`);
    console.log(`Response:`, profile.data);
    console.log(profile.status === 200 ? '✓ PASSED\n' : '✗ FAILED\n');

    // Test 5: Create a note
    console.log('Test 5: Create Note');
    const noteData = {
      content: 'This is a test note! 🎨',
      color: '#333333',
      backgroundColor: '#FFD700',
      tags: ['test'],
    };
    const createNote = await makeRequest('POST', '/api/notes', noteData, authToken);
    console.log(`Status: ${createNote.status}`);
    console.log(`Response:`, createNote.data);
    const noteId = createNote.data._id;
    console.log(createNote.status === 201 ? '✓ PASSED\n' : '✗ FAILED\n');

    // Test 6: Get public notes
    console.log('Test 6: Get Public Notes');
    const publicNotes = await makeRequest('GET', '/api/notes/public');
    console.log(`Status: ${publicNotes.status}`);
    console.log(`Found ${publicNotes.data.length} public notes`);
    console.log(publicNotes.status === 200 ? '✓ PASSED\n' : '✗ FAILED\n');

    // Test 7: Like a note
    if (noteId) {
      console.log('Test 7: Like Note');
      const like = await makeRequest('POST', `/api/notes/${noteId}/like`, null, authToken);
      console.log(`Status: ${like.status}`);
      console.log(`Response:`, like.data);
      console.log(like.status === 200 ? '✓ PASSED\n' : '✗ FAILED\n');
    }

    console.log('🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\nMake sure the server is running with: npm run dev');
  }
}

runTests();
