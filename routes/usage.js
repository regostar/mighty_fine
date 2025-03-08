/**
 *
 * Exports an Express router that handles GET requests to /usage.
 * Also provides an in-memory usage store (Map) and exports it.
 */


const express = require('express');
const router = express.Router();
const { getUsage } = require('../services/usageService');

/**
 * GET /usage?token=abc
 * Returns current usage in milliseconds for the given token.
 */
router.get('/', async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token parameter' });
  }
  
  try {
    const usage = await getUsage(token);
    return res.json({ token, usage });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;