const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/top10', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.player_name, COUNT(c.catch_id) AS total_catches
      FROM monster_catchestbl c
      JOIN playerstbl p ON c.player_id = p.player_id
      GROUP BY p.player_id, p.player_name
      ORDER BY total_catches DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;