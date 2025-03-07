
const redis = require('redis');
const { REDIS_URL } = require('../config/config');

const client = redis.createClient({
  url: REDIS_URL,
});

client.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis (this returns a promise)
client.connect().catch(err => console.error('Redis connection error:', err));

module.exports = client;
