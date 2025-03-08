const request = require('supertest');
const app = require('../app');
const redisClient = require('../db/redis');

describe('POST /clients', () => {
  let clientToken;

  afterEach(async () => {
    // Remove the token usage key and client record key from Redis after each test
    if (clientToken) {
      await redisClient.del(clientToken);
      await redisClient.del(`client:${clientToken}`);
      clientToken = null;
    }
  });

  afterAll(async () => {
    // Ensure the Redis client is closed after all tests in this file.
    await redisClient.quit();
  });

  it('creates a new client successfully', async () => {
    const res = await request(app)
      .post('/clients')
      .send({ name: 'Test User', email: 'test@example.com' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.name).toBe('Test User');
    expect(res.body.email).toBe('test@example.com');

    // Save the generated token for cleanup
    clientToken = res.body.token;
  });

  it('fails without name and email', async () => {
    const res = await request(app).post('/clients').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Name and email are required.' });
  });
});
