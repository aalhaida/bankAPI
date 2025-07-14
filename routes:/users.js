

const express = require("express");             // Import Express framework for routing
const db = require("../db/init");               // Import the database instance
const auth = require("../middleware/auth");     // Import JWT auth middleware
const router = express.Router();                 // Create a router instance

// 📅 Fetch the authenticated user's own details
router.get("/:userId", auth, (req, res) => {
  // Check if the requested user ID matches the one in the JWT token
  if (req.params.userId !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  // Retrieve user details from the database
  db.get(`SELECT id, name, email FROM users WHERE id = ?`, [req.params.userId], (err, user) => {
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user); // Return user info
  });
});

module.exports = router;
