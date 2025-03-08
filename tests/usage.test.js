const request = require('supertest');
const app = require('../app');
const { createClient } = require('../services/clientService');
const redisClient = require('../db/redis');

describe('GET /usage', () => {
  let token;

  afterEach(async () => {
    // Cleanup Redis keys for the client token created in each test.
    if (token) {
      await redisClient.del(token);
      await redisClient.del(`client:${token}`);
      token = null;
    }
  });

  afterAll(async () => {
    // Close the Redis client after tests.
    await redisClient.quit();
  });

  it('returns 0 usage for a new client', async () => {
    const client = await createClient('Usage Tester', 'usage@example.com');
    token = client.token;
    const res = await request(app).get(`/usage?token=${token}`);
    expect(res.status).toBe(200);
    expect(res.body.usage).toBe(0);
  });

  it('returns an error for invalid token', async () => {
    const res = await request(app).get('/usage?token=invalidtoken');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Client not found' });
  });
});
