# Ledger API

A RESTful API for managing financial accounts, recurring transfers, reporting, and transaction audit trails, built with Node.js, Express, and MongoDB.

## Features

- User registration, login, and logout with JWT authentication
- Cookie-based and Bearer token auth support
- Role-based access control with `USER`, `ADMIN`, and `SYSTEM`
- Account creation and balance tracking
- Fund transfers between accounts
- Transaction ownership enforcement (only account owner can debit)
- Idempotent transaction handling
- Transaction status API (`PENDING`, `COMPLETED`, `FAILED`, `REVERSED`)
- Transaction reversal (within 1 minute for initiator)
- Daily fraud controls:
    - Max single transaction: INR 50,000
    - Daily limit: INR 100,000
- Account freeze/unfreeze controls
- System-level initial fund injection
- Scheduled recurring transactions (`DAILY`, `WEEKLY`, `MONTHLY`)
- Transaction categories (`FOOD`, `RENT`, `SALARY`, `TRANSFER`, `OTHER`)
- Monthly analytics summary reporting
- Audit logging for LOGIN, TRANSFER, FREEZE, UNFREEZE, and REVERSAL actions
- Rate limiting on auth and transaction endpoints
- Email notifications via Nodemailer
- Token blacklisting on logout
- Swagger API documentation at `/api-docs`

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express v5
- **Database:** MongoDB (Mongoose)
- **Auth:** JSON Web Tokens (jsonwebtoken) + bcryptjs
- **Rate Limiting:** express-rate-limit
- **Scheduling:** node-cron
- **Email:** Nodemailer
- **Other:** cookie-parser, dotenv, swagger-ui-express

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)

### Installation

```bash
git clone <repo-url>
cd ledger
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server runs on **port 3000** by default.

### API Docs

After starting the server, open:

`http://localhost:3000/api-docs`

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint            | Auth     | Description          |
|--------|---------------------|----------|----------------------|
| POST   | `/api/auth/register` | None    | Register a new user  |
| POST   | `/api/auth/login`    | None    | Login and get token  |
| POST   | `/api/auth/logout`   | Required | Logout and blacklist token |

**Rate limit:** 20 requests per minute on register and login.

---

### Accounts — `/api/accounts`

| Method | Endpoint                          | Auth     | Description                  |
|--------|-----------------------------------|----------|------------------------------|
| POST   | `/api/accounts`                   | Required | Create a new account         |
| GET    | `/api/accounts`                   | Required | Get all accounts for the user |
| GET    | `/api/accounts/balance/:accountId` | Required | Get balance of an account    |
| PATCH  | `/api/accounts/:id/freeze`        | ADMIN    | Freeze an account            |
| PATCH  | `/api/accounts/:id/unfreeze`      | ADMIN    | Unfreeze an account          |

---

### Transactions — `/api/transactions`

| Method | Endpoint                            | Auth          | Description                        |
|--------|-------------------------------------|---------------|------------------------------------|
| POST   | `/api/transactions`                 | Required      | Transfer funds between accounts    |
| POST   | `/api/transactions/system/initial-fund` | SYSTEM Only | Inject initial funds into an account |
| GET    | `/api/transactions/my-transactions` | Required      | Get logged-in user's transactions  |
| GET    | `/api/transactions/category/:category` | Required   | Get transactions by category       |
| GET    | `/api/transactions/:id/status`      | Required      | Get transaction status             |
| POST   | `/api/transactions/:id/reverse`     | Required      | Reverse a completed transaction    |

#### Transaction Query Options

- `page`, `limit`
- `status`
- `category`
- `startDate`, `endDate`
- `sortBy=amount|createdAt`
- `sortOrder=asc|desc`

#### Transaction Categories

- `FOOD`
- `RENT`
- `SALARY`
- `TRANSFER`
- `OTHER`

### Transaction Rules

- Allowed statuses: `PENDING`, `COMPLETED`, `FAILED`, `REVERSED`
- Allowed categories: `FOOD`, `RENT`, `SALARY`, `TRANSFER`, `OTHER`
- Max per transaction: `50000`
- Daily total limit per source account: `100000`
- If daily cap is crossed, API returns: `Daily limit exceeded`
- Reversal is allowed only for the transaction initiator and only within 1 minute

### Scheduled Transactions — `/api/scheduled-transactions`

| Method | Endpoint                              | Auth     | Description                         |
|--------|---------------------------------------|----------|-------------------------------------|
| POST   | `/api/scheduled-transactions`         | Required | Create a recurring transfer         |
| GET    | `/api/scheduled-transactions/my-schedules` | Required | List your scheduled transfers   |

Supported recurrence values:
- `DAILY`
- `WEEKLY`
- `MONTHLY`

### Reports — `/reports`

| Method | Endpoint                     | Auth     | Description                          |
|--------|------------------------------|----------|--------------------------------------|
| GET    | `/reports/monthly-summary`   | Required | Monthly credit/debit summary         |

### Admin — `/admin`

| Method | Endpoint                 | Auth  | Description                     |
|--------|--------------------------|-------|---------------------------------|
| GET    | `/admin/audit-logs`      | ADMIN | View audit logs                 |

#### Audit Log Actions

- `LOGIN`
- `TRANSFER`
- `FREEZE`
- `UNFREEZE`
- `REVERSAL`

---

## Project Structure

```
server.js                    # Entry point
src/
├── app.js                   # Express app setup & route mounting
├── config/
│   ├── db.js                # MongoDB connection
│   └── swagger.js           # OpenAPI document config
├── controller/
│   ├── authController.js
│   ├── accountController.js
│   ├── transactionController.js
│   ├── Freeze_UnfreezeController.js
│   ├── scheduledTransactionController.js
│   ├── auditLogController.js
│   └── reportsController.js
├── middleware/
│   ├── authMiddleware.js    # JWT auth + role guards
│   └── rateLimitMiddleware.js
├── models/
│   ├── userModel.js
│   ├── accountModel.js
│   ├── transactionModel.js
│   ├── ledgerModel.js
│   ├── scheduledTransactionModel.js
│   ├── auditLogModel.js
│   └── blacklistModel.js
├── routes/
│   ├── authRoutes.js
│   ├── accountRoutes.js
│   ├── transactionRoutes.js
│   ├── scheduledTransactionRoutes.js
│   ├── Freeze_UnfreezeRoutes.js
│   ├── adminRoutes.js
│   └── reportsRoutes.js
└── services/
    ├── emailService.js
    ├── auditLogService.js
    └── scheduledTransactionService.js
```

## License

ISC

Last Updated: 3 April 2026
