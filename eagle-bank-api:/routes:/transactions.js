

const express = require("express");               // Import Express for route handling
const db = require("../db/init");                 // Import SQLite database connection
const { v4: uuidv4 } = require("uuid");           // Import UUID generator for unique transaction IDs
const router = express.Router();                   // Create a router instance

// 💸 Create a transaction for a given account
router.post("/:accountId/transactions", (req, res) => {
  const accountId = req.params.accountId;                       // Get account ID from URL
  const userId = req.user.id;                                   // Get user ID from JWT
  const { amount, description } = req.body;                     // Get transaction details from request body
  const id = "txn-" + uuidv4().slice(0, 6);                      // Generate unique transaction ID

  // Validate that account belongs to the user
  db.get(`SELECT * FROM accounts WHERE id = ? AND user_id = ?`, [accountId, userId], (err, account) => {
    if (!account) return res.status(404).json({ message: "Account not found or access denied" });

    // Update balance and insert transaction
    const newBalance = account.balance + amount;                // Calculate new balance
    db.serialize(() => {
      db.run(`UPDATE accounts SET balance = ? WHERE id = ?`, [newBalance, accountId]);
      db.run(
        `INSERT INTO transactions (id, account_id, amount, description) VALUES (?, ?, ?, ?)`,
        [id, accountId, amount, description],
        function (err) {
          if (err) return res.status(400).json({ message: err.message });
          res.status(201).json({ id, account_id: accountId, amount, description });
        }
      );
    });
  });
});

// 📊 Retrieve all transactions for a given account
router.get("/:accountId/transactions", (req, res) => {
  const accountId = req.params.accountId;          // Get account ID from URL
  const userId = req.user.id;                      // Get user ID from JWT

  // Validate account ownership
  db.get(`SELECT * FROM accounts WHERE id = ? AND user_id = ?`, [accountId, userId], (err, account) => {
    if (!account) return res.status(404).json({ message: "Account not found or access denied" });

    // Fetch all transactions for the account
    db.all(`SELECT * FROM transactions WHERE account_id = ?`, [accountId], (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    });
  });
});

module.exports = router;