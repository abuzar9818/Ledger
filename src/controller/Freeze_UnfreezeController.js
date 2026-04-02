const Account = require("../models/accountModel");
const mongoose = require("mongoose");
const auditLogService = require('../services/auditLogService');

// Freeze Account
exports.freezeAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid account id" });
    }

    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.status === "CLOSED") {
      return res.status(400).json({ message: "Closed account cannot be frozen" });
    }

    account.status = "FROZEN";
    await account.save();

    await auditLogService.logAuditEvent({
      userId: req.user._id,
      actionType: 'FREEZE',
      metadata: {
        accountId: account._id,
        previousStatus: 'ACTIVE',
        newStatus: 'FROZEN'
      }
    });

    res.status(200).json({
      message: "Account frozen successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unfreeze Account
exports.unfreezeAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid account id" });
    }

    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.status !== "FROZEN") {
      return res.status(400).json({ message: "Account is not frozen" });
    }

    account.status = "ACTIVE";
    await account.save();

    await auditLogService.logAuditEvent({
      userId: req.user._id,
      actionType: 'UNFREEZE',
      metadata: {
        accountId: account._id,
        previousStatus: 'FROZEN',
        newStatus: 'ACTIVE'
      }
    });

    res.status(200).json({
      message: "Account unfrozen successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};