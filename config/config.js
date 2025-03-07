
// One place to change all configuration settings
require('dotenv').config();

// config/config.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  MAX_USAGE_MS: process.env.MAX_USAGE_MS ? parseInt(process.env.MAX_USAGE_MS, 10) : 60000,
  CAPTION_INTERVAL_MS: process.env.CAPTION_INTERVAL_MS ? parseInt(process.env.CAPTION_INTERVAL_MS, 10) : 1000,
  AUDIO_PACKET_MS: process.env.AUDIO_PACKET_MS ? parseInt(process.env.AUDIO_PACKET_MS, 10) : 100,
};
