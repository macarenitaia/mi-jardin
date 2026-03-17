import fetch from 'node-fetch';

async function test() {
  try {
    console.log('[TEST] Init local API...');
    
    // A tiny valid 1x1 transparent PNG pixel in base64
    const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    
    const response = await fetch('http://localhost:3000/api/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 })
    });
    
    const data = await response.json();
    console.log('[TEST] Response status:', response.status);
    console.log('[TEST] Response data:', data);
  } catch (err) {
    console.error('[TEST] Failed request:', err);
  }
}

test();
