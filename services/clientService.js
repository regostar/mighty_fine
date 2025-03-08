const { v4: uuidv4 } = require('uuid');
const redisClient = require('../db/redis');

/**
 * Creates a new client record with a generated token.
 *
 * @param {string} name  - The client's name.
 * @param {string} email - The client's email.
 * @returns {Object}     - The newly created client object.
 * @throws {Error}       - If client creation fails.
 */
async function createClient(name, email) {
  try {
    if (!name || !email) {
      throw new Error('Name and email are required.');
    }
    
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

    // Initialize usage to 0 for this client.
    await redisClient.set(token, 0);

    return clientData;
  } catch (err) {
    console.error('Error creating client:', err);
    throw new Error('Failed to create client. Please try again later.');
  }
}

module.exports = {
  createClient,
};
