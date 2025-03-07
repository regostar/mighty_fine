/**
 * server.js
 *
 * Entry point: creates the HTTP server, attaches the WebSocket server,
 * and starts listening on a specified port (default: 3000).
 */

const http = require('http');
const app = require('./app');
const { setupCaptioning } = require('./ws/captioning');

// Create HTTP server from the Express app
const server = http.createServer(app);

// Attach WebSocket logic
setupCaptioning(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
