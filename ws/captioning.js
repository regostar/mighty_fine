// ws/captioning.js
const WebSocket = require('ws');
const { CAPTION_INTERVAL_MS, AUDIO_PACKET_MS, MAX_USAGE_MS } = require('../config/config');
const { incrementUsage, getUsage } = require('../services/usageService');
const { sendCaption } = require('../services/captionService');

/**
 * Sets up the WebSocket server attached to the HTTP server.
 */
function setupCaptioning(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    // Log the connection
    console.log('New WebSocket connection:', req.url);
    
    // Parse token from query parameters
    const params = new URLSearchParams(req.url.replace(/^.*\?/, ''));
    const token = params.get('token') || 'anonymous';

    // Initialize usage for this token if not already present
    if (getUsage(token) === 0) {
      console.log(`Initializing usage for token: ${token}`);
    }

    // Set up a caption interval to simulate captioning every CAPTION_INTERVAL_MS
    const captionInterval = setInterval(() => {
      if (getUsage(token) >= MAX_USAGE_MS) {
        ws.send(JSON.stringify({ error: 'Captioning time limit exceeded.' }));
        ws.close();
        clearInterval(captionInterval);
      } else {
        sendCaption(ws);
      }
    }, CAPTION_INTERVAL_MS);

    // Handle incoming messages (simulate 100ms audio packets)
    ws.on('message', (msg) => {
      // For each message, increment usage by AUDIO_PACKET_MS
      incrementUsage(token, AUDIO_PACKET_MS);

      // If usage exceeds limit after increment, send error and close connection
      if (getUsage(token) >= MAX_USAGE_MS) {
        ws.send(JSON.stringify({ error: 'Captioning time limit exceeded.' }));
        ws.close();
        clearInterval(captionInterval);
      }
    });

    ws.on('close', () => {
      clearInterval(captionInterval);
      console.log(`Connection closed for token: ${token}`);
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  });
}

module.exports = {
  setupCaptioning,
};
