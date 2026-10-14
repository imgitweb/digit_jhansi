const express = require("express");

const {
  createTalentRegistration,
} = require("../controllers/talentRegistration.controller");

const router = express.Router();

/**
 * @route   POST /api/talent/talent-register
 * @desc    Submit Talent Registration form
 * @access  Public
 */
router.post(
  "/talent-register",
  createTalentRegistration
);

module.exports = router;