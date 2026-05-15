const express = require('express');
const router = express.Router();
const fraudRepository = require('../repositories/fraudRepository');

router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const rows = await fraudRepository.queryFraudEvents({ limit, offset });
    res.json({ data: rows });
  } catch (error) {
    console.error("History API Error:", error);
    res.status(500).json({ error: "Failed to fetch fraud history" });
  }
});

module.exports = router;
