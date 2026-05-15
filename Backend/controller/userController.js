const userModel = require('../models/userModel');
const tokenBlacklistModel = require('../models/blacklistModel');

async function updateProfile(req, res) {
    try {
        const { name, theme } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (theme) updateData.theme = theme;

        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                theme: user.theme
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update profile" });
    }
}

async function getSessions(req, res) {
    try {
        const user = await userModel.findById(req.user._id).select('activeSessions');
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Mask the token in the response
        const sessions = user.activeSessions.map(session => ({
            _id: session._id,
            device: session.device,
            ip: session.ip,
            loginTime: session.loginTime,
            isCurrent: session.token === req.token // Check against current request token
        }));

        return res.status(200).json({ sessions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch sessions" });
    }
}

async function revokeSession(req, res) {
    try {
        const { sessionId } = req.params;
        
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const sessionIndex = user.activeSessions.findIndex(s => s._id.toString() === sessionId);
        
        if (sessionIndex === -1) {
            return res.status(404).json({ error: "Session not found" });
        }

        const tokenToRevoke = user.activeSessions[sessionIndex].token;

        // Add to blacklist
        await tokenBlacklistModel.create({
            token: tokenToRevoke
        });

        // Remove from active sessions
        user.activeSessions.splice(sessionIndex, 1);
        await user.save();

        return res.status(200).json({ message: "Session revoked successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to revoke session" });
    }
}

module.exports = {
    updateProfile,
    getSessions,
    revokeSession
};
