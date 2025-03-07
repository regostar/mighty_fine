
// One place to change all configuration settings

module.exports = {
    MAX_USAGE_MS: 60000,      // Maximum allowed usage: 60 seconds
    CAPTION_INTERVAL_MS: 1000, // Send caption every 1 second
    AUDIO_PACKET_MS: 100,      // Each message counts as 100ms
    PORT: process.env.PORT || 3000,
  };
  