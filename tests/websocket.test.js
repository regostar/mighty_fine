const WebSocket = require('ws');
const http = require('http');
const app = require('../app');
const { setupCaptioning } = require('../ws/captioning');
const { createClient } = require('../services/clientService');
const { getUsage } = require('../services/usageService');
const redisClient = require('../db/redis');

jest.setTimeout(20000);  // 20 seconds, sufficient for async tests

let server, port, token;

beforeAll((done) => {
  server = http.createServer(app);
  setupCaptioning(server);
  server.listen(0, () => {
    port = server.address().port;
    done();
  });
});

afterAll(async () => {
  await redisClient.quit();
  server.close();
});

beforeEach(async () => {
  const client = await createClient('WebSocket Tester', 'ws@example.com');
  token = client.token;
});

afterEach(async () => {
  await redisClient.del(token);
  await redisClient.del(`client:${token}`);
});

describe('WebSocket captioning', () => {
  test('should connect and receive captions', async () => {
    const ws = new WebSocket(`ws://localhost:${port}?token=${token}`);

    await new Promise((resolve, reject) => {
      let captionsReceived = 0;

      ws.on('open', () => {
        ws.send('audio_packet');
      });

      ws.on('message', (data) => {
        const msg = JSON.parse(data);
        if (msg.caption) captionsReceived++;
        if (captionsReceived >= 2) {
          ws.close();
          resolve();
        }
      });

      ws.on('close', resolve);
      ws.on('error', reject);
    });
  });

  test('should increment usage correctly', async () => {
    const ws = new WebSocket(`ws://localhost:${port}?token=${token}`);

    await new Promise((resolve, reject) => {
      ws.on('open', () => {
        ws.send('audio_packet'); //100ms
        ws.send('audio_packet'); //200ms
        setTimeout(resolve, 500);
      });

      ws.on('error', reject);
    });

    const usage = await getUsage(token);
    expect(usage).toBe(200);

    ws.close();
  });

  test('should handle invalid token gracefully', async () => {
    const invalidToken = 'invalid-token';
    const ws = new WebSocket(`ws://localhost:${port}?token=${invalidToken}`);

    await new Promise((resolve, reject) => {
      ws.on('message', (data) => {
        const msg = JSON.parse(data);
        expect(msg).toHaveProperty('error', 'Client not found');
      });

      ws.on('close', resolve);
      ws.on('error', reject);
    });
  });

  test('should disconnect when usage exceeds limit', async () => {
    const ws = new WebSocket(`ws://localhost:${port}?token=${token}`);

    await new Promise((resolve, reject) => {
      ws.on('open', () => {
        for (let i = 0; i <= 600; i++) {
          ws.send('audio_packet');
        }
      });

      ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        if (data.error === 'Captioning time limit exceeded.') {
          expect(data.error).toBe('Captioning time limit exceeded.');
          ws.close();
          resolve();
        }
      });

      ws.on('close', resolve);
      ws.on('error', reject);
    });

    const usage = await getUsage(token);
    expect(usage).toBeGreaterThanOrEqual(60000);
  });
});
