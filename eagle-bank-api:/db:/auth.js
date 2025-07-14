

const jwt = require("jsonwebtoken"); // Import the JWT library to verify tokens
const JWT_SECRET = process.env.JWT_SECRET; // Get the secret key from environment variables

// Middleware to protect routes by verifying JWT tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // Get the 'Authorization' header
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from 'Bearer <token>'

  if (!token) {
    // If no token is provided, respond with 401 Unauthorized
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token using the secret key
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // If verification fails (e.g., expired or invalid), respond with 403 Forbidden
      return res.status(403).json({ message: "Invalid token" });
    }

    // If valid, attach user info from token to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = authenticateToken; // Export middleware for use in routes
