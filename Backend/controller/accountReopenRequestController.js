const mongoose = require('mongoose');
const accountModel = require('../models/accountModel');
const accountReopenRequestModel = require('../models/accountReopenRequestModel');
const auditLogService = require('../services/auditLogService');

async function requestAccountReopen(req, res) {
    try {
        if (req.user.role !== 'USER') {
            return res.status(403).json({
                status: 'failed',
                message: 'Only USER accounts can request account reopening'
            });
        }

        const { id } = req.params;
        const { reason } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'failed',
                message: 'Invalid account id'
            });
        }

        const account = await accountModel.findById(id);

        if (!account) {
            return res.status(404).json({
                status: 'failed',
                message: 'Account not found'
            });
        }

        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'failed',
                message: 'You can only request reopening for your own account'
            });
        }

        if (account.status !== 'CLOSED') {
            return res.status(400).json({
                status: 'failed',
                message: 'Only closed accounts can be reopened'
            });
        }

        const pendingRequest = await accountReopenRequestModel.findOne({
            accountId: account._id,
            requestedBy: req.user._id,
            status: 'pending'
        });

        if (pendingRequest) {
            return res.status(409).json({
                status: 'failed',
                message: 'A pending reopen request already exists for this account'
            });
        }

        const reopenRequest = await accountReopenRequestModel.create({
            accountId: account._id,
            requestedBy: req.user._id,
            status: 'pending',
            reason: reason || null
        });

        return res.status(201).json({
            status: 'success',
            message: 'Account reopen request submitted successfully',
            reopenRequest
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to submit account reopen request'
        });
    }
}

async function getAllReopenRequests(req, res) {
    try {
        const reopenRequests = await accountReopenRequestModel
            .find({})
            .populate('accountId')
            .populate('requestedBy', 'name email role')
            .populate('reviewedBy', 'name email role')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            status: 'success',
            reopenRequests
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to fetch account reopen requests'
        });
    }
}

async function approveReopenRequest(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'failed',
                message: 'Invalid reopen request id'
            });
        }

        const reopenRequest = await accountReopenRequestModel.findById(id);

        if (!reopenRequest) {
            return res.status(404).json({
                status: 'failed',
                message: 'Reopen request not found'
            });
        }

        if (reopenRequest.status !== 'pending') {
            return res.status(400).json({
                status: 'failed',
                message: 'Reopen request is already reviewed'
            });
        }

        const account = await accountModel.findById(reopenRequest.accountId);

        if (!account) {
            return res.status(404).json({
                status: 'failed',
                message: 'Account not found for this reopen request'
            });
        }

        if (account.status !== 'CLOSED') {
            return res.status(400).json({
                status: 'failed',
                message: 'Only closed accounts can be reopened'
            });
        }

        account.status = 'ACTIVE';
        await account.save();

        reopenRequest.status = 'approved';
        reopenRequest.reviewedBy = req.user._id;
        reopenRequest.reviewedAt = new Date();
        await reopenRequest.save();

        await auditLogService.logAuditEvent({
            userId: req.user._id,
            actionType: 'REOPEN',
            metadata: {
                accountId: account._id,
                reopenRequestId: reopenRequest._id,
                previousStatus: 'CLOSED',
                newStatus: 'ACTIVE'
            }
        });

        return res.status(200).json({
            status: 'success',
            message: 'Reopen request approved and account reopened successfully',
            reopenRequest,
            account
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to approve reopen request'
        });
    }
}

async function rejectReopenRequest(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'failed',
                message: 'Invalid reopen request id'
            });
        }

        const reopenRequest = await accountReopenRequestModel.findById(id);

        if (!reopenRequest) {
            return res.status(404).json({
                status: 'failed',
                message: 'Reopen request not found'
            });
        }

        if (reopenRequest.status !== 'pending') {
            return res.status(400).json({
                status: 'failed',
                message: 'Reopen request is already reviewed'
            });
        }

        reopenRequest.status = 'rejected';
        reopenRequest.reviewedBy = req.user._id;
        reopenRequest.reviewedAt = new Date();
        await reopenRequest.save();

        return res.status(200).json({
            status: 'success',
            message: 'Reopen request rejected successfully',
            reopenRequest
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to reject reopen request'
        });
    }
}

async function getMyReopenRequests(req, res) {
    try {
        if (req.user.role !== 'USER') {
            return res.status(403).json({
                status: 'failed',
                message: 'Only USER accounts can access personal reopen requests'
            });
        }

        const reopenRequests = await accountReopenRequestModel
            .find({ requestedBy: req.user._id })
            .populate('accountId')
            .populate('reviewedBy', 'name email role')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            status: 'success',
            reopenRequests
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to fetch your reopen requests'
        });
    }
}

module.exports = {
    requestAccountReopen,
    getAllReopenRequests,
    approveReopenRequest,
    rejectReopenRequest,
    getMyReopenRequests
};
