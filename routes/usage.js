/**
 * routes/usage.js
 *
 * Exports an Express router that handles GET requests to /usage.
 * Also provides an in-memory usage store (Map) and exports it.
 */

const express = require('express');
const router = express.Router();

// In-memory usage tracker: Map<token, number>
const usageData = new Map();

/**
 * GET /usage?token=abc
 * Responds with the current usage in milliseconds for the given token.
 */
router.get('/', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token parameter' });
  }
  const usage = usageData.get(token) || 0;
  res.json({ token, usage });
});

module.exports = router;

// Also export usageData so other modules can update usage
module.exports.usageData = usageData;
