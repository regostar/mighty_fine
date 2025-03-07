
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../db/redis');

/**
 * Creates a new client record with a generated token.
 *
 * @param {string} name  - The client's name.
 * @param {string} email - The client's email.
 * @returns {Object}     - The newly created client object.
 */
async function createClient(name, email) {
  // Generate a new token using UUID.
  const token = uuidv4();

  // Create client details.
  const clientData = {
    token,
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  // Save client details in Redis under a key (e.g., "client:<token>").
  await redisClient.set(`client:${token}`, JSON.stringify(clientData));

  // Optionally, initialize usage to 0 for this client.
  await redisClient.set(token, 0);

  return clientData;
}

module.exports = {
  createClient,
};
