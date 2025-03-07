// tests/integration/usage.test.js

const request = require('supertest');
const http = require('http');
const app = require('../app');
const { usageStore } = require('../services/usageService');
const { setupCaptioning } = require('../ws/captioning');

let server;

beforeAll((done) => {
  // Create a server instance and attach the WebSocket logic.
  server = http.createServer(app);
  setupCaptioning(server);
  // Listen on a random available port.
  server.listen(0, done);
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  // Clear the in-memory usage store before each test.
  usageStore.clear();
});

describe('REST /usage Endpoint', () => {
  it('should return 0 usage for a new token', async () => {
    const token = 'abc';
    const response = await request(server).get(`/usage?token=${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token, usage: 0 });
  });

  it('should reflect increased usage after WebSocket messages', async () => {
    const token = 'test123';
    // Open a WebSocket connection and send one message.
    const WebSocket = require('ws');
    const port = server.address().port;
    const ws = new WebSocket(`ws://localhost:${port}?token=${token}`);

    // Wait for the connection to open, then send a message.
    await new Promise((resolve, reject) => {
      ws.on('open', () => {
        ws.send('audio packet');
        resolve();
      });
      ws.on('error', reject);
    });

    // Allow some time for the server to process the message.
    await new Promise((r) => setTimeout(r, 300));

    // Verify that the usage has been incremented by 100ms.
    const response = await request(server).get(`/usage?token=${token}`);
    expect(response.status).toBe(200);
    expect(response.body.usage).toBe(100);

    ws.close();
  });
});
