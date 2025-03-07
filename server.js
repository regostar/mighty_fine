/**
 * server.js
 *
 * Entry point: creates the HTTP server, attaches the WebSocket server,
 * and starts listening on a specified port (default: 3000).
 */

// server.js
const http = require('http');
const app = require('./app');
const { setupCaptioning } = require('./ws/captioning');
const { PORT } = require('./config/config');

// Create HTTP server from the Express app
const server = http.createServer(app);

// Setup WebSocket for captioning on the same server
setupCaptioning(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
