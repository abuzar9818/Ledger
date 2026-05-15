const accountModel = require('../models/accountModel');
const userModel = require('../models/userModel');

async function getPendingAccounts(req, res) {
    try {
        const pendingAccounts = await accountModel.find({ status: "PENDING" }).populate("user", "name email");
        
        return res.status(200).json({
            pendingAccounts
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch pending accounts",
            error: error.message
        });
    }
}

async function updateAccountStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["ACTIVE", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Can only be ACTIVE or REJECTED"
            });
        }

        const account = await accountModel.findById(id);

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        if (account.status !== "PENDING") {
            return res.status(400).json({
                message: `Cannot update status of a ${account.status} account`
            });
        }

        account.status = status;
        await account.save();

        return res.status(200).json({
            message: `Account has been ${status}`,
            account
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update account status",
            error: error.message
        });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await userModel.find().select('-password');
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
}

async function getAllAccounts(req, res) {
    try {
        const accounts = await accountModel.find().populate("user", "name email");
        return res.status(200).json({ accounts });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch accounts",
            error: error.message
        });
    }
}

async function updateUserRole(req, res) {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["USER", "ADMIN"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.systemUser) return res.status(403).json({ message: "Cannot modify system user" });

        user.role = role;
        await user.save();

        return res.status(200).json({ message: `User promoted to ${role}`, user });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update user role", error: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.systemUser) return res.status(403).json({ message: "Cannot delete system user" });

        // Check if user has active accounts
        const userAccounts = await accountModel.find({ user: id });
        const hasActiveAccounts = userAccounts.some(acc => acc.status === "ACTIVE" || acc.status === "FROZEN");

        if (hasActiveAccounts) {
            return res.status(400).json({ 
                message: "Cannot delete user with active or frozen accounts. Close the accounts first." 
            });
        }

        await userModel.findByIdAndDelete(id);

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
}

module.exports = {
    getPendingAccounts,
    updateAccountStatus,
    getAllUsers,
    getAllAccounts,
    updateUserRole,
    deleteUser
};
