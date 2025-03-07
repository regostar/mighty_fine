
const express = require('express');
const router = express.Router();
const { createClient } = require('../services/clientService');

/**
 * POST /clients
 * Expects JSON body with "name" and "email" fields.
 * Returns the newly created client data including token.
 */
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  
  try {
    const client = await createClient(name, email);
    return res.status(201).json(client);
  } catch (err) {
    console.error('Error creating client:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
