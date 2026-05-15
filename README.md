# Ledger

Ledger is a full-stack banking-style project with a Node.js/Express/MongoDB backend and a React + Vite frontend.

## Overview

The project includes:

- Backend API for account management, transfers, scheduled payments, audit logging, and admin approval workflows
- Frontend client for authentication, dashboard, transfers, and transaction history

The API supports three actor types:

- `USER` for normal customer flows
- `ADMIN` for review, control, and approval operations
- `SYSTEM` for internal automation such as scheduled transaction execution

The backend is structured for production-style workflows: authenticated access, role checks, rate limiting, audit trails, and approval-based account lifecycle changes.

## Key Features

- JWT-based authentication with bearer token and cookie support
- Role-based authorization with `USER`, `ADMIN`, and `SYSTEM`
- Account creation and balance tracking
- Manual transfers between accounts with ownership validation
- Scheduled recurring transfers with `DAILY`, `WEEKLY`, and `MONTHLY` recurrence
- Transaction status lookup and reversal support
- Daily transfer controls and idempotency support
- Account freeze and unfreeze controls for admins
- Account closure request workflow with admin approval or rejection
- Account reopen request workflow for closed accounts with admin-only approval
- Monthly summary reporting
- Audit logging for security-sensitive actions
- Token blacklisting on logout
- Rate limiting on auth and transaction-heavy routes
- Swagger documentation at `/api-docs`

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose
- **Authentication:** jsonwebtoken, bcryptjs
- **Scheduling:** node-cron
- **Rate limiting:** express-rate-limit
- **Email:** Nodemailer
- **Docs:** swagger-ui-express
- **Utilities:** dotenv, cookie-parser, morgan

## Project Setup

### Prerequisites

- Node.js 18 or newer
- MongoDB instance or Atlas connection

### Install Dependencies

```bash
npm install
npm install --prefix Frontend
```

### Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
MAX_REQUESTS_PER_MINUTE=20
LOGIN_RATE_LIMIT=5
TRANSACTION_RATE_LIMIT=5
```

Create `Frontend/.env` (optional, for custom API URL):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Run the Project

```bash
# From project root: run backend + frontend together
npm run dev
```

### Run Services Separately

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# Backend production
npm start
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`

## Frontend-Backend Connection

- Frontend Axios base URL is configured in `Frontend/services/axiosInstance.js`
- It uses `VITE_API_BASE_URL`, with fallback `http://localhost:3000/api`
- Backend CORS origin is configured in `Backend/app.js` using `FRONTEND_URL` (fallback: `http://localhost:5173`)

## Frontend Updates

- **Summary:** The frontend has been recently updated with multiple new and changed components across the `components`, `pages`, and `routes` areas (admin, dashboard, auth, and settings). Core stack updates include React (v19), Vite (v8), and Tailwind CSS (v3.x).
- **Notable dependencies:** `axios`, `react-router-dom`, `framer-motion`, `recharts`, `jspdf`, `html2canvas`.
- **Run (development):** From project root run `npm run dev` (starts backend + frontend) or run frontend only:

```bash
npm install --prefix Frontend
npm run dev:frontend
```

- **Build / Preview (frontend):**

```bash
npm run build --prefix Frontend
npm run preview --prefix Frontend
```

- **Notes:** If you've made specific component-level changes you'd like reflected verbatim in this README (new pages, routes, or public endpoints used by the frontend), share the list and I will insert a concise changelog here.

### API Documentation

Open:

```text
http://localhost:3000/api-docs
```

## API Routes

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive a token |
| POST | `/api/auth/logout` | Authenticated | Log out and blacklist the token |

### Accounts — `/api/accounts`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/accounts` | USER | Create a new account |
| GET | `/api/accounts` | USER | List the logged-in user’s accounts |
| GET | `/api/accounts/balance/:accountId` | USER | Fetch balance for a specific account |

### Account Controls — `/api`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| PATCH | `/api/accounts/:id/freeze` | ADMIN | Freeze an account |
| PATCH | `/api/accounts/:id/unfreeze` | ADMIN | Unfreeze an account |

### Transactions — `/api/transactions`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/transactions` | USER | Create a transfer transaction |
| POST | `/api/transactions/system/initial-fund` | ADMIN | Inject initial funds into an account |
| GET | `/api/transactions/my-transactions` | USER | List the current user’s transactions |
| GET | `/api/transactions/category/:category` | USER | Filter transactions by category |
| GET | `/api/transactions/:id/status` | USER | Check a transaction status |
| POST | `/api/transactions/:id/reverse` | USER | Reverse an eligible transaction |

Supported transaction statuses:

- `PENDING`
- `COMPLETED`
- `FAILED`
- `REVERSED`

Supported transaction categories:

- `FOOD`
- `RENT`
- `SALARY`
- `TRANSFER`
- `OTHER`

### Scheduled Transactions — `/api/scheduled-transactions`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/scheduled-transactions` | USER | Create a recurring transfer |
| GET | `/api/scheduled-transactions/my-schedules` | USER | List the user’s scheduled transfers |
| PUT | `/api/scheduled-transactions/:id` | USER | Edit a future pending scheduled transfer |
| PATCH | `/api/scheduled-transactions/:id/cancel` | USER | Cancel a future pending scheduled transfer |

Supported recurrence values:

- `DAILY`
- `WEEKLY`
- `MONTHLY`

Scheduled transfer lifecycle notes:

- Only schedules owned by the current user can be edited or cancelled.
- Only `PENDING` schedules with `nextRunAt` in the future are eligible for edit/cancel actions.

### Reports — `/api/reports`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/reports/monthly-summary` | USER | Get monthly debit/credit summary |

### Admin — `/admin`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/admin/audit-logs` | ADMIN | View audit logs |

### Account Closure Requests — `/api/account-closure-requests`

Users cannot close accounts directly. They can submit a closure request, and admins review it.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/accounts/:id/close-request` | USER | Request closure for one of the user’s own accounts |
| GET | `/accounts/my-close-requests` | USER | View the user’s own closure requests |
| GET | `/admin/close-requests` | ADMIN | View all closure requests |
| PATCH | `/admin/close-request/:id/approve` | ADMIN | Approve a closure request and close the account |
| PATCH | `/admin/close-request/:id/reject` | ADMIN | Reject a closure request |

### Account Reopen Requests — `/api/account-reopen-requests`

Users cannot reopen closed accounts directly. They submit a reopen request, and only admins can approve it.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/accounts/:id/reopen-request` | USER | Request reopening of a closed account |
| GET | `/accounts/my-reopen-requests` | USER | View the user’s own reopen requests |
| GET | `/admin/reopen-requests` | ADMIN | View all reopen requests |
| PATCH | `/admin/reopen-request/:id/approve` | ADMIN | Approve a reopen request and reactivate the account |
| PATCH | `/admin/reopen-request/:id/reject` | ADMIN | Reject a reopen request |

## Approval Workflows

### Close Account

1. User submits a closure request for one of their own accounts.
2. Admin reviews the request.
3. On approval, the account status changes to `CLOSED`.
4. On rejection, the request is marked as `rejected`.

### Reopen Account

1. User submits a reopen request for a closed account they own.
2. Admin reviews the request.
3. On approval, the account status changes to `ACTIVE`.
4. On rejection, the request is marked as `rejected`.

## Authentication Notes

- Requests can use either `Authorization: Bearer <token>` or the auth cookie.
- `SYSTEM` users are blocked from normal login flows.
- Admin-only routes are protected by the existing role middleware.

## Rate Limiting

- Auth routes use the configured login rate limit.
- Transaction and scheduled-transfer routes use the transaction rate limit.
- `SYSTEM` traffic is excluded from rate limiting.

## Project Structure

```text
server.js
Backend/
├── app.js
├── config/
│   ├── db.js
│   └── swagger.js
├── controller/
│   ├── Freeze_UnfreezeController.js
│   ├── accountClosureRequestController.js
│   ├── accountController.js
│   ├── accountReopenRequestController.js
│   ├── auditLogController.js
│   ├── authController.js
│   ├── reportsController.js
│   ├── scheduledTransactionController.js
│   └── transactionController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── rateLimitMiddleware.js
│   └── roleMiddleware.js
├── models/
│   ├── accountClosureRequestModel.js
│   ├── accountModel.js
│   ├── accountReopenRequestModel.js
│   ├── auditLogModel.js
│   ├── blacklistModel.js
│   ├── ledgerModel.js
│   ├── scheduledTransactionModel.js
│   ├── transactionModel.js
│   └── userModel.js
├── routes/
│   ├── accountClosureRequestRoutes.js
│   ├── accountReopenRequestRoutes.js
│   ├── accountRoutes.js
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── Freeze_UnfreezeRoutes.js
│   ├── reportsRoutes.js
│   ├── scheduledTransactionRoutes.js
│   └── transactionRoutes.js
└── services/
    ├── auditLogService.js
    ├── emailService.js
    └── scheduledTransactionService.js
```

## Notes for Development

- MongoDB must be available before starting the scheduler.
- Scheduled transfers run from the service layer, not through API routes.
- Audit logs are written for sensitive actions including transfer, freeze, unfreeze, reversal, and reopen approval.

## License

ISC

Last Updated: 16 May 2026

**API Documentation (Swagger)**: The backend exposes interactive API docs at `/api-docs` when the server is running. If you need the raw OpenAPI JSON, fetch `/api-docs/swagger.json` or visit the UI at `http://localhost:3000/api-docs`.
