// Entry point of app

const http = require('http');
const app = require('./app');
const { setupWebSocket } = require('./ws/captioning');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Setup WebSocket server on top of the same HTTP server
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});