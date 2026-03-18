const express = require("express");
const router = express.Router();
const {
  freezeAccount,
  unfreezeAccount,
} = require("../controller/Freeze_UnfreezeController");

// Freeze account
router.patch("/accounts/:id/freeze", freezeAccount);

// Unfreeze account
router.patch("/accounts/:id/unfreeze", unfreezeAccount);

module.exports = router;