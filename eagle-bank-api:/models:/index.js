

const db = require("../db/init"); // Import the database connection instance
const { v4: uuidv4 } = require("uuid"); // Import UUID generator for creating unique IDs

// Function to create a new user in the database
const createUser = (name, email, hashedPassword) => {
  const id = "usr-" + uuidv4().slice(0, 6); // Generate a unique user ID prefixing with 'usr-'
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`, // SQL query to insert new user
      [id, name, email, hashedPassword], // Bind parameters to prevent SQL injection
      function (err) {
        if (err) return reject(err); // Reject promise if there's an error
        resolve({ id, name, email }); // Return user data on success
      }
    );
  });
};

// Function to fetch a user by their email address
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE email = ?`, // SQL query to fetch user by email
      [email],
      (err, row) => {
        if (err) return reject(err); // Reject if error occurs
        resolve(row); // Return user row if found
      }
    );
  });
};

// Function to fetch a user by ID
const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE id = ?`, // SQL query to fetch user by ID
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

// Export the functions for use in routes/controllers
module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
