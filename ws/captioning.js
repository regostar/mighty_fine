/**
 * ws/captioning.js
 *
 * Sets up a WebSocket server that:
 *  - Receives audio packets (each message = 100ms).
 *  - Tracks usage in usageData (from usage.js).
 *  - Sends random "lorem ipsum" captions every second.
 *  - Enforces a 60-second limit per token.
 */

const WebSocket = require('ws');
const { usageData } = require('../routes/usage');
const { generateLoremIpsum } = require('../utils/loreumGen');

const MAX_USAGE = 60000; // 60 seconds

/**
 * Attach WebSocket server to the given HTTP server.
 */
function setupCaptioning(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket connected');
    // Parse the "token" query param (e.g., ws://localhost:3000?token=abc)
    const params = new URLSearchParams(req.url.replace(/^.*\?/, ''));
    const token = params.get('token') || 'anonymous';
    console.log("1");
    // Initialize usage if not present
    if (!usageData.has(token)) {
      usageData.set(token, 0);
    }
    console.log("2");
    // Send simulated captions every second
    const captionInterval = setInterval(() => {
      const usage = usageData.get(token) || 0;
      if (usage >= MAX_USAGE) {
        console.log(":wsx")
        ws.send(JSON.stringify({ error: 'Captioning time limit exceeded.' }));
        ws.close();
        clearInterval(captionInterval);
      } else {
        ws.send(JSON.stringify({ caption: generateLoremIpsum() }));
      }
    }, 1000);
    console.log("3");
    // Each incoming message = 100ms of audio
    ws.on('message', () => {
      console.log("4")
      let currentUsage = usageData.get(token) || 0;
      currentUsage += 100;
      usageData.set(token, currentUsage);

      if (currentUsage >= MAX_USAGE) {
        ws.send(JSON.stringify({ error: 'Captioning time limit exceeded.' }));
        ws.close();
        clearInterval(captionInterval);
      }
    });

    // Cleanup on close
    ws.on('close', () => {
      console.log('WebSocket disconnected');
      clearInterval(captionInterval);
    });
  });
}

module.exports = { setupCaptioning };
