

const express = require("express");             // Express framework for routing
const db = require("../db/init");               // SQLite database instance
const { v4: uuidv4 } = require("uuid");         // UUID generator
const router = express.Router();                 // Create a router instance

// 💳 Create a new account for the authenticated user
router.post("/", (req, res) => {
  const userId = req.user.id;                                  // Extract user ID from JWT token
  const id = "acc-" + uuidv4().slice(0, 6);                    // Generate unique account ID
  const { type } = req.body;                                   // Account type (e.g., checking, savings)

  // Insert the account into the database
  db.run(
    `INSERT INTO accounts (id, user_id, type, balance) VALUES (?, ?, ?, 0)`,
    [id, userId, type],
    function (err) {
      if (err) return res.status(400).json({ message: err.message });
      res.status(201).json({ id, user_id: userId, type, balance: 0 });
    }
  );
});

// 📈 Get all accounts for the authenticated user
router.get("/", (req, res) => {
  const userId = req.user.id; // Extract user ID from token

  // Retrieve all accounts owned by the user
  db.all(`SELECT * FROM accounts WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

module.exports = router;
