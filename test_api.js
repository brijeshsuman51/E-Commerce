const http = require('http');

async function testImageUpload() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/media/image/create',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('Response:', response);

          // Check if it's mock data
          if (response.public_id === 'mock_public_id') {
            console.log('✅ Mock data detected correctly');
          } else {
            console.log('❌ Expected mock data but got real data');
          }
          resolve();
        } catch (error) {
          console.error('❌ Error parsing response:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      reject(error);
    });

    req.end();
  });
}

testImageUpload().catch(console.error);