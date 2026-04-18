const mongoose = require('mongoose');
const accountModel = require('../models/accountModel');
const accountClosureRequestModel = require('../models/accountClosureRequestModel');

async function requestAccountClosure(req, res) {
    try {
        if (req.user.role !== 'USER') {
            return res.status(403).json({
                status: 'failed',
                message: 'Only USER accounts can request account closure'
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
                message: 'You can only request closure for your own account'
            });
        }

        if (account.status === 'CLOSED') {
            return res.status(400).json({
                status: 'failed',
                message: 'Account is already closed'
            });
        }

        const pendingRequest = await accountClosureRequestModel.findOne({
            accountId: account._id,
            requestedBy: req.user._id,
            status: 'pending'
        });

        if (pendingRequest) {
            return res.status(409).json({
                status: 'failed',
                message: 'A pending closure request already exists for this account'
            });
        }

        const closureRequest = await accountClosureRequestModel.create({
            accountId: account._id,
            requestedBy: req.user._id,
            status: 'pending',
            reason: reason || null
        });

        return res.status(201).json({
            status: 'success',
            message: 'Account closure request submitted successfully',
            closureRequest
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to submit account closure request'
        });
    }
}

async function getAllClosureRequests(req, res) {
    try {
        const closureRequests = await accountClosureRequestModel
            .find({})
            .populate('accountId')
            .populate('requestedBy', 'name email role')
            .populate('reviewedBy', 'name email role')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            status: 'success',
            closureRequests
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to fetch account closure requests'
        });
    }
}

async function approveClosureRequest(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'failed',
                message: 'Invalid closure request id'
            });
        }

        const closureRequest = await accountClosureRequestModel.findById(id);

        if (!closureRequest) {
            return res.status(404).json({
                status: 'failed',
                message: 'Closure request not found'
            });
        }

        if (closureRequest.status !== 'pending') {
            return res.status(400).json({
                status: 'failed',
                message: 'Closure request is already reviewed'
            });
        }

        const account = await accountModel.findById(closureRequest.accountId);

        if (!account) {
            return res.status(404).json({
                status: 'failed',
                message: 'Account not found for this closure request'
            });
        }

        if (account.status === 'CLOSED') {
            return res.status(400).json({
                status: 'failed',
                message: 'Account is already closed'
            });
        }

        account.status = 'CLOSED';
        await account.save();

        closureRequest.status = 'approved';
        closureRequest.reviewedBy = req.user._id;
        closureRequest.reviewedAt = new Date();
        await closureRequest.save();

        return res.status(200).json({
            status: 'success',
            message: 'Closure request approved and account closed successfully',
            closureRequest,
            account
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to approve closure request'
        });
    }
}

async function rejectClosureRequest(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'failed',
                message: 'Invalid closure request id'
            });
        }

        const closureRequest = await accountClosureRequestModel.findById(id);

        if (!closureRequest) {
            return res.status(404).json({
                status: 'failed',
                message: 'Closure request not found'
            });
        }

        if (closureRequest.status !== 'pending') {
            return res.status(400).json({
                status: 'failed',
                message: 'Closure request is already reviewed'
            });
        }

        closureRequest.status = 'rejected';
        closureRequest.reviewedBy = req.user._id;
        closureRequest.reviewedAt = new Date();
        await closureRequest.save();

        return res.status(200).json({
            status: 'success',
            message: 'Closure request rejected successfully',
            closureRequest
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to reject closure request'
        });
    }
}

async function getMyClosureRequests(req, res) {
    try {
        if (req.user.role !== 'USER') {
            return res.status(403).json({
                status: 'failed',
                message: 'Only USER accounts can access personal closure requests'
            });
        }

        const closureRequests = await accountClosureRequestModel
            .find({ requestedBy: req.user._id })
            .populate('accountId')
            .populate('reviewedBy', 'name email role')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            status: 'success',
            closureRequests
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to fetch your closure requests'
        });
    }
}

module.exports = {
    requestAccountClosure,
    getAllClosureRequests,
    approveClosureRequest,
    rejectClosureRequest,
    getMyClosureRequests
};
