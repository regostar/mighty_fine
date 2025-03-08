
const redisClient = require('../db/redis');

/**
 * Validates if a client exists for the given token.
 * Throws an error if not found.
 *
 * @param {string} token - The client's token.
 */
async function validateClient(token) {
  const client = await redisClient.get(`client:${token}`);
  if (!client) {
    throw new Error('Client not found');
  }
}

/**
 * Retrieves the current usage (in ms) for the given token.
 *
 * @param {string} token - The client's token.
 * @returns {number} - The usage in milliseconds.
 */
async function getUsage(token) {
  await validateClient(token);
  const usage = await redisClient.get(token);
  console.log(parseInt(usage, 10));
  return usage ? parseInt(usage, 10) : 0;
}

/**
 * Increments the usage by a specified amount (in ms) for the given token.
 *
 * @param {string} token - The client's token.
 * @param {number} ms - The milliseconds to add.
 */
async function incrementUsage(token, ms) {
  await validateClient(token);
  await redisClient.incrBy(token, ms);
}

/**
 * Resets the usage for a given token.
 *
 * @param {string} token - The client's token.
 */
async function resetUsage(token) {
  await validateClient(token);
  await redisClient.set(token, 0);
}

module.exports = {
  getUsage,
  incrementUsage,
  resetUsage,
};
