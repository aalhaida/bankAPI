

const express = require("express"); // Import Express framework for routing
const jwt = require("jsonwebtoken"); // Import JSON Web Token library
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
// (Removed duplicate imports and redeclarations. These are already declared below.)

// Import necessary libraries
const express = require("express");             // Express framework to handle routing
const jwt = require("jsonwebtoken");            // JWT library to create and verify tokens
const bcrypt = require("bcryptjs");             // Bcrypt for securely hashing passwords
const db = require("../db/init");               // SQLite database instance
const { v4: uuidv4 } = require("uuid");         // UUID generator to create unique user IDs

const router = express.Router();                // Create an Express router instance
const JWT_SECRET = process.env.JWT_SECRET;      // Get secret key from environment for signing JWTs

//  Register a new user
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;                      // Extract user info from request body
  const id = "usr-" + uuidv4().slice(0, 6);                         // Generate short unique user ID (e.g. usr-abc123)
  const hashed = bcrypt.hashSync(password, 10);                    // Hash the password with 10 salt rounds

  // Insert new user into the users table
  db.run(
    `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
    [id, name, email, hashed],
    function (err) {
      if (err) return res.status(400).json({ message: err.message }); // Handle duplicate or invalid input
      res.status(201).json({ id, name, email });                      // Return newly created user info (excluding password)
    }
  );
});

//  Log in and issue a JWT token
router.post("/login", (req, res) => {
  const { email, password } = req.body;                             // Extract login credentials

  // Retrieve user by email from the database
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    // If user doesn't exist or password is incorrect, return Unauthorized
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Sign a JWT containing the user ID and email
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token });                                            // Return token to client
  });
});

// Export the router so it can be mounted in app.js
module.exports = router;

