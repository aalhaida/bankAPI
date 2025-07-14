#  Eagle Bank API

A secure and lightweight RESTful API for managing users, accounts, and transactions — built with Node.js, Express, SQLite, and JWT authentication.

---

##  Features

- User registration and secure login with hashed passwords
- JWT-based authentication middleware
- CRUD operations for accounts and transactions
- SQLite database (no external dependencies)
- Fully documented OpenAPI spec (`openapi.yaml`)
- Modular architecture with routing and middleware
- Unit tests with `jest` / `supertest` or `pytest` (if Python is used)

---

##  Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (file-based)
- **Auth**: JWT (`jsonwebtoken`) + Bcrypt for password hashing
- **UUIDs**: `uuid` package for unique resource IDs
- **Testing**: Jest or Pytest (depending on language)

---

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/eagle-bank-api.git
cd eagle-bank-api
