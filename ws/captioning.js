
const WebSocket = require('ws');
const { CAPTION_INTERVAL_MS, AUDIO_PACKET_MS, MAX_USAGE_MS } = require('../config/config');
const { getUsage, incrementUsage } = require('../services/usageService');
const { sendCaption } = require('../services/captionService');

/**
 * Sets up the WebSocket server attached to the HTTP server.
 */
function setupCaptioning(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection:', req.url);

    // Parse token from query parameters (e.g., ws://localhost:3000?token=abc)
    const params = new URLSearchParams(req.url.replace(/^.*\?/, ''));
    const token = params.get('token') || 'anonymous';

    // Set up a caption interval to simulate captioning every CAPTION_INTERVAL_MS
    const captionInterval = setInterval(async () => {
      try {
        const usage = await getUsage(token);
        if (usage >= MAX_USAGE_MS) {
          ws.send(JSON.stringify({ error: 'Captioning time limit exceeded.' }));
          ws.close();
          clearInterval(captionInterval);
        } else {
          sendCaption(ws);
        }
      } catch (err) {
        // If an error occurs (e.g., invalid token), send error and close connection
        ws.send(JSON.stringify({ error: err.message }));
        ws.close();
        clearInterval(captionInterval);
      }
    }, CAPTION_INTERVAL_MS);

    // Handle incoming messages (simulate each message as 100ms of audio)
    ws.on('message', async () => {
      try {
        await incrementUsage(token, AUDIO_PACKET_MS);
        const usage = await getUsage(token);
        if (usage >= MAX_USAGE_MS) {
          ws.send(JSON.stringify({ error: 'Captioning time limit exceeded.' }));
          ws.close();
          clearInterval(captionInterval);
        }
      } catch (err) {
        // On error (like an invalid token), send error message and close connection
        ws.send(JSON.stringify({ error: err.message }));
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

module.exports = { setupCaptioning };
