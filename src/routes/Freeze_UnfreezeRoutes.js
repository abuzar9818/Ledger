const express = require("express");
const router = express.Router();
const {
  freezeAccount,
  unfreezeAccount,
} = require("../controller/Freeze_UnfreezeController");
const authMiddleware = require("../middleware/authMiddleware");

// Freeze account
router.patch(
  "/accounts/:id/freeze",
  authMiddleware.authMiddleware,
  authMiddleware.adminMiddleware,
  freezeAccount
);

// Unfreeze account
router.patch(
  "/accounts/:id/unfreeze",
  authMiddleware.authMiddleware,
  authMiddleware.adminMiddleware,
  unfreezeAccount
);

module.exports = router;