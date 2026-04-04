const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Ledger API",
        version: "1.0.0",
        description: "API documentation for the Ledger backend"
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local development server"
        }
    ],
    tags: [
        { name: "Auth" },
        { name: "Accounts" },
        { name: "Transactions" },
        { name: "Scheduled Transactions" },
        { name: "Reports" },
        { name: "Admin" },
        { name: "Account Controls" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    error: { type: "string" },
                    status: { type: "string" }
                }
            },
            User: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    role: { type: "string", example: "USER" }
                }
            },
            AuthResponse: {
                type: "object",
                properties: {
                    user: { $ref: "#/components/schemas/User" },
                    message: { type: "string" },
                    status: { type: "string" },
                    token: { type: "string" }
                }
            },
            Account: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    user: { type: "string" },
                    status: {
                        type: "string",
                        enum: ["ACTIVE", "FROZEN", "CLOSED"]
                    },
                    currency: { type: "string", example: "INR" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            AccountListResponse: {
                type: "object",
                properties: {
                    accounts: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Account" }
                    }
                }
            },
            AccountBalanceResponse: {
                type: "object",
                properties: {
                    accountId: { type: "string" },
                    balance: { type: "number" }
                }
            },
            Transaction: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    fromaccount: { type: "string" },
                    toaccount: { type: "string" },
                    status: {
                        type: "string",
                        enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"]
                    },
                    amount: { type: "number" },
                    category: {
                        type: "string",
                        enum: ["FOOD", "RENT", "SALARY", "TRANSFER", "OTHER"]
                    },
                    dailyvolume: { type: "number" },
                    idempotencykey: { type: "string" },
                    reversedTransaction: { type: ["string", "null"] },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            TransactionResponse: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    transaction: { $ref: "#/components/schemas/Transaction" }
                }
            },
            TransactionListResponse: {
                type: "object",
                properties: {
                    totalRecords: { type: "number" },
                    totalPages: { type: "number" },
                    currentPage: { type: "number" },
                    transactions: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Transaction" }
                    }
                }
            },
            TransactionStatusResponse: {
                type: "object",
                properties: {
                    transactionId: { type: "string" },
                    status: {
                        type: "string",
                        enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"]
                    }
                }
            },
            ReversalResponse: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    reversalTx: { $ref: "#/components/schemas/Transaction" }
                }
            },
            ScheduledTransaction: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    userId: { type: "string" },
                    fromaccount: { type: "string" },
                    toaccount: { type: "string" },
                    amount: { type: "number" },
                    recurrence: {
                        type: "string",
                        enum: ["DAILY", "WEEKLY", "MONTHLY"]
                    },
                    status: {
                        type: "string",
                        enum: ["PENDING", "PAUSED", "CANCELLED"]
                    },
                    nextRunAt: { type: "string", format: "date-time" },
                    lastRunAt: { type: ["string", "null"], format: "date-time" },
                    lastError: { type: ["string", "null"] },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            ScheduledTransactionResponse: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    status: { type: "string" },
                    scheduledTransaction: { $ref: "#/components/schemas/ScheduledTransaction" }
                }
            },
            ScheduledTransactionListResponse: {
                type: "object",
                properties: {
                    status: { type: "string" },
                    schedules: {
                        type: "array",
                        items: { $ref: "#/components/schemas/ScheduledTransaction" }
                    }
                }
            },
            MonthlySummaryResponse: {
                type: "object",
                properties: {
                    total_credit: { type: "number" },
                    total_debit: { type: "number" },
                    transaction_count: { type: "number" }
                }
            },
            AuditLog: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    userId: { type: "string" },
                    actionType: {
                        type: "string",
                        enum: ["LOGIN", "TRANSFER", "FREEZE", "UNFREEZE", "REVERSAL"]
                    },
                    timestamp: { type: "string", format: "date-time" },
                    metadata: { type: "object", additionalProperties: true }
                }
            },
            AuditLogListResponse: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    totalRecords: { type: "number" },
                    totalPages: { type: "number" },
                    currentPage: { type: "number" },
                    logs: {
                        type: "array",
                        items: { $ref: "#/components/schemas/AuditLog" }
                    }
                }
            }
        }
    },
    paths: {
        "/": {
            get: {
                tags: ["Auth"],
                summary: "Health route",
                responses: {
                    "200": {
                        description: "Welcome response"
                    }
                }
            }
        },
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "email", "password"],
                                properties: {
                                    name: { type: "string" },
                                    email: { type: "string", format: "email" },
                                    password: { type: "string", minLength: 6 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "User registered",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AuthResponse" }
                            }
                        }
                    },
                    "422": {
                        description: "Email already exists",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Log in a user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "User logged in",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AuthResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Invalid credentials",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "404": {
                        description: "User not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Log out the current user",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "User logged out"
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/accounts": {
            get: {
                tags: ["Accounts"],
                summary: "Get logged-in user accounts",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Accounts fetched",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AccountListResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ["Accounts"],
                summary: "Create a new account",
                security: [{ bearerAuth: [] }],
                responses: {
                    "201": {
                        description: "Account created",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        account: { $ref: "#/components/schemas/Account" }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/accounts/balance/{accountId}": {
            get: {
                tags: ["Accounts"],
                summary: "Get account balance",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "accountId",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Balance fetched",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AccountBalanceResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "404": {
                        description: "Account not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/accounts/{id}/freeze": {
            patch: {
                tags: ["Account Controls"],
                summary: "Freeze an account",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Account frozen",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        account: { $ref: "#/components/schemas/Account" }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description: "Bad request",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "404": {
                        description: "Account not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/accounts/{id}/unfreeze": {
            patch: {
                tags: ["Account Controls"],
                summary: "Unfreeze an account",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Account unfrozen",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        account: { $ref: "#/components/schemas/Account" }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description: "Bad request",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "404": {
                        description: "Account not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/transactions": {
            post: {
                tags: ["Transactions"],
                summary: "Create a transaction",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["fromAccount", "toAccount", "amount", "idempotencyKey"],
                                properties: {
                                    fromAccount: { type: "string" },
                                    toAccount: { type: "string" },
                                    amount: { type: "number" },
                                    idempotencyKey: { type: "string" },
                                    category: {
                                        type: "string",
                                        enum: ["FOOD", "RENT", "SALARY", "TRANSFER", "OTHER"]
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Transaction created",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/TransactionResponse" }
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "404": {
                        description: "Account not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/transactions/system/initial-fund": {
            post: {
                tags: ["Transactions"],
                summary: "Create an initial fund transfer",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["toAccount", "amount", "idempotencyKey"],
                                properties: {
                                    toAccount: { type: "string" },
                                    amount: { type: "number" },
                                    idempotencyKey: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Initial fund created",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/TransactionResponse" }
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "500": {
                        description: "Initial fund failed",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/transactions/my-transactions": {
            get: {
                tags: ["Transactions"],
                summary: "Get the current user's transactions",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "query", name: "page", schema: { type: "integer", minimum: 1 } },
                    { in: "query", name: "limit", schema: { type: "integer", minimum: 1 } },
                    {
                        in: "query",
                        name: "status",
                        schema: { type: "string", enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"] }
                    },
                    {
                        in: "query",
                        name: "category",
                        schema: { type: "string", enum: ["FOOD", "RENT", "SALARY", "TRANSFER", "OTHER"] }
                    },
                    { in: "query", name: "startDate", schema: { type: "string", format: "date-time" } },
                    { in: "query", name: "endDate", schema: { type: "string", format: "date-time" } },
                    {
                        in: "query",
                        name: "sortBy",
                        schema: { type: "string", enum: ["amount", "createdAt"] }
                    },
                    { in: "query", name: "sortOrder", schema: { type: "string", enum: ["asc", "desc"] } }
                ],
                responses: {
                    "200": {
                        description: "Transactions fetched",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/TransactionListResponse" }
                            }
                        }
                    },
                    "400": {
                        description: "Invalid filters",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/transactions/category/{category}": {
            get: {
                tags: ["Transactions"],
                summary: "Get transactions by category",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "category",
                        required: true,
                        schema: { type: "string", enum: ["FOOD", "RENT", "SALARY", "TRANSFER", "OTHER"] }
                    },
                    { in: "query", name: "page", schema: { type: "integer", minimum: 1 } },
                    { in: "query", name: "limit", schema: { type: "integer", minimum: 1 } }
                ],
                responses: {
                    "200": {
                        description: "Transactions fetched",
                        content: {
                            "application/json": {
                                schema: {
                                    allOf: [
                                        { $ref: "#/components/schemas/TransactionListResponse" },
                                        {
                                            type: "object",
                                            properties: {
                                                category: { type: "string" }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    "400": {
                        description: "Invalid category",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/transactions/{id}/status": {
            get: {
                tags: ["Transactions"],
                summary: "Get transaction status",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Status fetched",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/TransactionStatusResponse" }
                            }
                        }
                    },
                    "400": {
                        description: "Invalid transaction id",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "404": {
                        description: "Transaction not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/transactions/{id}/reverse": {
            post: {
                tags: ["Transactions"],
                summary: "Reverse a transaction",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Transaction reversed",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ReversalResponse" }
                            }
                        }
                    },
                    "400": {
                        description: "Reversal validation failed",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "404": {
                        description: "Transaction not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/scheduled-transactions": {
            post: {
                tags: ["Scheduled Transactions"],
                summary: "Create a scheduled transaction",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["fromAccount", "toAccount", "amount", "recurrence"],
                                properties: {
                                    fromAccount: { type: "string" },
                                    toAccount: { type: "string" },
                                    amount: { type: "number" },
                                    recurrence: {
                                        type: "string",
                                        enum: ["DAILY", "WEEKLY", "MONTHLY"]
                                    },
                                    startDate: { type: "string", format: "date-time" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Scheduled transaction created",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ScheduledTransactionResponse" }
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "404": {
                        description: "Account not found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/api/scheduled-transactions/my-schedules": {
            get: {
                tags: ["Scheduled Transactions"],
                summary: "Get the current user's scheduled transactions",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Scheduled transactions fetched",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ScheduledTransactionListResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/reports/monthly-summary": {
            get: {
                tags: ["Reports"],
                summary: "Get monthly account summary",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Summary fetched",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MonthlySummaryResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        },
        "/admin/audit-logs": {
            get: {
                tags: ["Admin"],
                summary: "Get audit logs",
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "query", name: "page", schema: { type: "integer", minimum: 1 } },
                    { in: "query", name: "limit", schema: { type: "integer", minimum: 1 } },
                    {
                        in: "query",
                        name: "actionType",
                        schema: { type: "string", enum: ["LOGIN", "TRANSFER", "FREEZE", "UNFREEZE", "REVERSAL"] }
                    },
                    { in: "query", name: "startDate", schema: { type: "string", format: "date-time" } },
                    { in: "query", name: "endDate", schema: { type: "string", format: "date-time" } },
                    { in: "query", name: "userId", schema: { type: "string" } }
                ],
                responses: {
                    "200": {
                        description: "Audit logs fetched",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AuditLogListResponse" }
                            }
                        }
                    },
                    "400": {
                        description: "Invalid filter",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    },
                    "403": {
                        description: "Forbidden",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ErrorResponse" }
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = swaggerDocument;
