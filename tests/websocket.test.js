// tests/integration/websocket.test.js

const WebSocket = require('ws');
const http = require('http');
const app = require('../app');
const { setupCaptioning } = require('../ws/captioning');
const { usageStore } = require('../services/usageService');
const request = require('supertest');

let server;
let port;

beforeAll((done) => {
  // Create a server instance and attach the WebSocket logic.
  server = http.createServer(app);
  setupCaptioning(server);
  // Listen on a random available port.
  server.listen(0, () => {
    port = server.address().port;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  usageStore.clear();
});

describe('WebSocket Captioning', () => {
  it('should send caption messages at regular intervals', (done) => {
    const token = 'wsTest1';
    const ws = new WebSocket(`ws://localhost:${port}?token=${token}`);
    let captionsReceived = 0;

    ws.on('open', () => {
      // No need to send any message; we just expect periodic captions.
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.caption) {
        captionsReceived++;
      }
      if (captionsReceived === 2) {
        // Received two caption messages: test passed.
        ws.close();
        done();
      }
    });

    ws.on('error', (err) => {
      ws.close();
      done(err);
    });
  });

  it('should increment usage per audio packet sent', (done) => {
    const token = 'wsTest2';
    const ws = new WebSocket(`ws://localhost:${port}?token=${token}`);

    ws.on('open', () => {
      // Send one audio packet (which counts as 100ms).
      ws.send('audio packet');
    });

    // Wait a bit to ensure the message is processed.
    setTimeout(async () => {
      const response = await request(server).get(`/usage?token=${token}`);
      expect(response.status).toBe(200);
      expect(response.body.usage).toBe(100);
      ws.close();
      done();
    }, 300);
  });

  it('should disconnect the client when usage exceeds limit', (done) => {
    const token = 'wsTest3';
    const ws = new WebSocket(`ws://localhost:${port}?token=${token}`);

    ws.on('open', () => {
      // Rapidly send messages to exceed the limit.
      // The limit is 60000ms so 600 messages should do it.
      let count = 0;
      const interval = setInterval(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          clearInterval(interval);
          return;
        }
        ws.send('audio packet');
        count++;
        if (count >= 610) {
          clearInterval(interval);
        }
      }, 1);
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.error && msg.error === 'Captioning time limit exceeded.') {
        // We expect to receive an error message and then the connection closes.
        expect(msg.error).toBe('Captioning time limit exceeded.');
        done();
      }
    });

    ws.on('close', () => {
      // If the connection is closed without an error message, we can finish the test.
      // (The test will have already been marked as done if error message was received.)
    });

    ws.on('error', (err) => {
      // Report errors if any.
      done(err);
    });
  });
});
