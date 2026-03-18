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
        { name: "Account Controls" }
    ],
    paths: {
        "/": {
            get: {
                summary: "Health route",
                responses: {
                    "200": { description: "Welcome response" }
                }
            }
        },
        "/api/accounts": {
            get: {
                tags: ["Accounts"],
                summary: "Get logged-in user accounts",
                responses: {
                    "200": { description: "Accounts fetched" },
                    "401": { description: "Unauthorized" }
                }
            },
            post: {
                tags: ["Accounts"],
                summary: "Create account",
                responses: {
                    "201": { description: "Account created" },
                    "401": { description: "Unauthorized" }
                }
            }
        },
        "/api/accounts/balance/{accountId}": {
            get: {
                tags: ["Accounts"],
                summary: "Get account balance",
                parameters: [
                    {
                        in: "path",
                        name: "accountId",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": { description: "Balance fetched" },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Account not found" }
                }
            }
        },
        "/api/accounts/{id}/freeze": {
            patch: {
                tags: ["Account Controls"],
                summary: "Freeze account",
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": { description: "Account frozen" },
                    "400": { description: "Bad request" },
                    "404": { description: "Account not found" }
                }
            }
        },
        "/api/accounts/{id}/unfreeze": {
            patch: {
                tags: ["Account Controls"],
                summary: "Unfreeze account",
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": { description: "Account unfrozen" },
                    "400": { description: "Bad request" },
                    "404": { description: "Account not found" }
                }
            }
        },
        "/api/transactions": {
            post: {
                tags: ["Transactions"],
                summary: "Create transaction",
                responses: {
                    "201": { description: "Transaction created" },
                    "400": { description: "Validation error" },
                    "401": { description: "Unauthorized" }
                }
            }
        },
        "/api/transactions/my-transactions": {
            get: {
                tags: ["Transactions"],
                summary: "Get my transactions",
                responses: {
                    "200": { description: "Transactions fetched" },
                    "401": { description: "Unauthorized" }
                }
            }
        },
        "/api/transactions/{id}/status": {
            get: {
                tags: ["Transactions"],
                summary: "Get transaction status",
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": { description: "Status fetched" },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Transaction not found" }
                }
            }
        },
        "/api/transactions/{id}/reverse": {
            post: {
                tags: ["Transactions"],
                summary: "Reverse transaction",
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": { description: "Transaction reversed" },
                    "400": { description: "Reversal validation failed" },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Transaction not found" }
                }
            }
        }
    }
};

module.exports = swaggerDocument;
