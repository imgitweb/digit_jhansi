const express = require("express");

const {
  createDigitalBusinessAudit,
} = require("../controllers/digitalBusinessAudit.controller");

const router = express.Router();

/**
 * @route   POST /api/digital-business-audits/digital-business-audit-register
 * @desc    Submit Digital Business Audit form
 * @access  Public
 */
router.post(
  "/digital-business-audit-register",
  createDigitalBusinessAudit
);

module.exports = router;