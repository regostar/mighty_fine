//usage tracking and business logic\


const redisClient = require('../db/redis');

/**
 * Retrieves the current usage (in ms) for the given token.
 */
async function getUsage(token) {
  const usage = await redisClient.get(token);
  return usage ? parseInt(usage, 10) : 0;
}

/**
 * Increments the usage by a specified amount (in ms) for the given token.
 */
async function incrementUsage(token, ms) {
  await redisClient.incrBy(token, ms);
}

/**
 * Optionally, you can add a function to reset usage (helpful for tests).
 */
async function resetUsage(token) {
  await redisClient.set(token, 0);
}

module.exports = {
  getUsage,
  incrementUsage,
  resetUsage,
};

