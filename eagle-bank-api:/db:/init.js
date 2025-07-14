

const sqlite3 = require("sqlite3").verbose(); // Enable verbose logging for SQLite
const path = require("path");                 // Node.js path utility for resolving file paths

// Create or open a SQLite database file named 'eagle_bank.db'
const db = new sqlite3.Database(path.resolve(__dirname, "eagle_bank.db"));

// Initialize the database schema
function initDB() {
  db.serialize(() => {
    // 📅 Create 'users' table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);

    // 💳 Create 'accounts' table with reference to 'users'
    db.run(`CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      balance INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // 💵 Create 'transactions' table with reference to 'accounts'
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      description TEXT,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    )`);
  });
}

// Export the database instance and init function
module.exports = {
  db,
  initDB
};
