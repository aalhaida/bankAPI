
const app = require("./app"); // Import the Express app (configured in app.js)
const dotenv = require("dotenv"); // Load environment variables from .env file

dotenv.config(); // Initialize dotenv to read .env contents

const PORT = process.env.PORT || 3000; // Get PORT from .env or default to 3000

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});