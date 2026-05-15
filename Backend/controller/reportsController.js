const accountModel = require('../models/accountModel');
const ledgerModel = require('../models/ledgerModel');
const transactionModel = require('../models/transactionModel');

async function getMonthlySummary(req, res) {
    try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const userAccounts = await accountModel
            .find({ user: req.user._id })
            .select('_id')
            .lean();

        const accountIds = userAccounts.map((account) => account._id);

        if (accountIds.length === 0) {
            return res.status(200).json({
                total_credit: 0,
                total_debit: 0,
                transaction_count: 0
            });
        }

        const creditDebitResult = await ledgerModel.aggregate([
            {
                $match: {
                    account: { $in: accountIds },
                    createdAt: { $gte: monthStart, $lt: nextMonthStart }
                }
            },
            {
                $group: {
                    _id: null,
                    total_credit: {
                        $sum: {
                            $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0]
                        }
                    },
                    total_debit: {
                        $sum: {
                            $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0]
                        }
                    }
                }
            }
        ]);

        const transactionCountResult = await transactionModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart, $lt: nextMonthStart },
                    $or: [
                        { fromaccount: { $in: accountIds } },
                        { toaccount: { $in: accountIds } }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    transaction_count: { $sum: 1 }
                }
            }
        ]);

        const totals = creditDebitResult[0] || { total_credit: 0, total_debit: 0 };
        const txCount = transactionCountResult[0]?.transaction_count || 0;

        return res.status(200).json({
            total_credit: totals.total_credit,
            total_debit: totals.total_debit,
            transaction_count: txCount
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to generate monthly summary',
            status: 'failed'
        });
    }
}

async function getDashboardAnalytics(req, res) {
    try {
        const userAccounts = await accountModel
            .find({ user: req.user._id })
            .select('_id')
            .lean();

        const accountIds = userAccounts.map(a => a._id);

        if (accountIds.length === 0) {
            return res.status(200).json({
                incomeExpense: [],
                spending: [],
                savings: []
            });
        }

        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        // 1. Income vs Expense (Last 6 months)
        const incomeExpenseResult = await ledgerModel.aggregate([
            {
                $match: {
                    account: { $in: accountIds },
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    income: {
                        $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] }
                    },
                    expense: {
                        $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const incomeExpense = incomeExpenseResult.map(r => ({
            name: `${months[r._id.month - 1]}`,
            income: r.income,
            expense: r.expense
        }));

        // 2. Spending Analytics
        const spendingResult = await transactionModel.aggregate([
            {
                $match: {
                    fromaccount: { $in: accountIds }
                }
            },
            {
                $group: {
                    _id: "$category",
                    value: { $sum: "$amount" }
                }
            }
        ]);

        const spending = spendingResult.map(r => ({
            name: r._id,
            value: r.value
        })).filter(r => r.value > 0);

        // 3. Savings Growth
        let cumulativeBalance = 0;
        const savings = incomeExpenseResult.map(r => {
            cumulativeBalance += (r.income - r.expense);
            return {
                name: `${months[r._id.month - 1]}`,
                balance: cumulativeBalance > 0 ? cumulativeBalance : 0
            };
        });

        return res.status(200).json({
            incomeExpense,
            spending,
            savings
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch analytics",
            error: error.message
        });
    }
}

module.exports = {
    getMonthlySummary,
    getDashboardAnalytics
};
