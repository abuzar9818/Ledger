const budgetModel = require('../models/budgetModel');
const transactionModel = require('../models/transactionModel');
const accountModel = require('../models/accountModel');
const mongoose = require('mongoose');

// Helper to get current YYYY-MM period
function getCurrentPeriod() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

async function upsertBudget(req, res) {
    try {
        const { category, limit, period } = req.body;
        
        if (!category || limit === undefined) {
            return res.status(400).json({ error: "Category and limit are required" });
        }

        const normalizedCategory = String(category).toUpperCase();
        const activePeriod = period || getCurrentPeriod();

        const budget = await budgetModel.findOneAndUpdate(
            { user: req.user._id, category: normalizedCategory, period: activePeriod },
            { limit: Number(limit) },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ message: "Budget updated successfully", budget });
    } catch (error) {
        console.error("Failed to upsert budget:", error);
        res.status(500).json({ error: "Failed to update budget" });
    }
}

async function getBudgetProgress(req, res) {
    try {
        const { period } = req.query;
        const activePeriod = period || getCurrentPeriod();

        // 1. Fetch user's budgets for the period
        const budgets = await budgetModel.find({ user: req.user._id, period: activePeriod }).lean();
        
        // 2. Fetch user's accounts to calculate outgoing transactions
        const userAccounts = await accountModel.find({ user: req.user._id }).select('_id');
        const accountIds = userAccounts.map(acc => acc._id);

        if (accountIds.length === 0) {
            // User has no accounts, return budgets with 0 spent
            const progress = budgets.map(b => ({ ...b, spent: 0, percentage: 0 }));
            return res.status(200).json({ period: activePeriod, budgets: progress });
        }

        // 3. Calculate start and end dates for the period string (YYYY-MM)
        const [year, month] = activePeriod.split('-');
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // 4. Aggregate actual spending per category
        const spendingAgg = await transactionModel.aggregate([
            {
                $match: {
                    fromaccount: { $in: accountIds },
                    status: 'COMPLETED',
                    createdAt: { $gte: startDate, $lte: endDate },
                    category: { $in: ["FOOD", "RENT", "OTHER", "TRANSFER"] } // Filter for budgetable categories
                }
            },
            {
                $group: {
                    _id: "$category",
                    spent: { $sum: "$amount" }
                }
            }
        ]);

        const spendingMap = spendingAgg.reduce((acc, curr) => {
            acc[curr._id] = curr.spent;
            return acc;
        }, {});

        // 5. Merge budgets with spending data
        const ALL_CATEGORIES = ["FOOD", "RENT", "OTHER", "TRANSFER"];
        const progress = ALL_CATEGORIES.map(cat => {
            const budget = budgets.find(b => b.category === cat);
            const limit = budget ? budget.limit : 0;
            const spent = spendingMap[cat] || 0;
            const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : (spent > 0 ? 100 : 0);

            return {
                category: cat,
                limit,
                spent,
                percentage,
                period: activePeriod,
                isExceeded: spent > limit && limit > 0
            };
        });

        res.status(200).json({ period: activePeriod, budgets: progress });
    } catch (error) {
        console.error("Failed to fetch budget progress:", error);
        res.status(500).json({ error: "Failed to fetch budget progress" });
    }
}

module.exports = {
    upsertBudget,
    getBudgetProgress
};
