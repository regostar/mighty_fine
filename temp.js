const WebSocket = require('ws');
const loremChunks = require('../utils/loreumGen');

// Configuration constants
const MAX_USAGE = 60000;           // 60 seconds in ms - bonus 
const AUDIO_PACKET_DURATION = 100; // Each packet represents 100ms of audio
const CAPTION_INTERVAL = 1000;     // Send a caption every 1000ms

// In-memory store for tracking usage per client (by token)
const usageStore = {};

/**
 * Returns the current usage (in milliseconds) for a given token.
 * @param {string} token - The client session token.
 */
function getUsage(token) {
  return usageStore[token] || 0;
}

/**
 * Sets up the WebSocket server on the given HTTP server.
 * @param {http.Server} server - The HTTP server.
 */
function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

// ws/captioning.js
wss.on('connection', (ws, req) => {
  // First, try to get the token from the query parameters
  let token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');

  // If the token isn't in the query, try to get it from the subprotocol header (Postman may send it here)
  if (!token) {
    token = req.headers['sec-websocket-protocol'];
    // If it's an array (sometimes multiple protocols are sent), take the first one
    if (Array.isArray(token)) {
      token = token[0];
    }
  }

  // If still no token, close the connection
  if (!token) {
    ws.send(JSON.stringify({ error: 'No token provided' }));
    return ws.close();
  }

  // Proceed with the rest of your connection setup
  let chunkIndex = 0;
  const captionInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const caption = loremChunks[chunkIndex % loremChunks.length];
      ws.send(JSON.stringify({ caption }));
      chunkIndex++;
    }
  }, CAPTION_INTERVAL);

  ws.on('message', async (message) => {
    try {
      const updatedUsage = await incrementUsage(token, AUDIO_PACKET_DURATION);
      if (updatedUsage > MAX_USAGE) {
        ws.send(JSON.stringify({ error: 'Usage limit exceeded. Disconnecting.' }));
        ws.close();
      } else {
        console.log(`Token "${token}": Received audio packet. Total usage: ${updatedUsage} ms.`);
      }
    } catch (err) {
      console.error("Error updating usage:", err);
    }
  });

  ws.on('close', () => {
    clearInterval(captionInterval);
  });
});


module.exports = {
  setupWebSocket,
  getUsage
};
