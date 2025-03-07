// websocket captioning logic

const { generateLoremIpsum } = require('../utils/loremGen');

function sendCaption(ws) {
  // Generate a random caption and send it over the WebSocket
  const caption = generateLoremIpsum();
  ws.send(JSON.stringify({ caption }));
}

module.exports = {
  sendCaption,
};
