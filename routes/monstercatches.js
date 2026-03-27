const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { player_id, monster_id } = req.query;

    // Check if both IDs exist to avoid empty/bad queries
    if (!player_id || !monster_id) {
      return res.status(400).json({ message: "Missing player_id or monster_id" });
    }

    const [list] = await pool.query(
      `SELECT * FROM monster_catchestbl WHERE player_id=? AND monster_id=?`, 
      [player_id, monster_id]
    );

    // Return an object instead of a naked number for better frontend handling
    res.json({ count: list.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // 1. Move from req.query to req.body
    const { player_id, monster_id, latitude, longitude } = req.body;

    // 2. Standardized INSERT into the correct table
    await pool.query(
      `INSERT INTO monster_catchestbl 
      (player_id, monster_id, location_id, latitude, longitude, catch_Datetime)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [player_id, monster_id, 2, latitude, longitude, new Date()] 
    );

    res.status(201).json({ success: true, message: 'Catch recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
