const TalentRegistration = require("../models/talentRegistration.model");

/**
 * Create Talent Registration
 *
 * POST /api/talent/talent-register
 */
const createTalentRegistration = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      whatsappNumber,
      email,
      address,
      educationalQualification,
      employmentStatus,
      yearsOfExperience,
      areasOfInterest,
      opportunities,
      skillDevelopment,
      jobAlerts,
    } = req.body;

    // ---------------------------------------------------------
    // Required field validation
    // ---------------------------------------------------------

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    if (!/^[0-9]{10}$/.test(String(mobileNumber))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10 digit mobile number.",
      });
    }

    if (!whatsappNumber) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp number is required.",
      });
    }

    if (!/^[0-9]{10}$/.test(String(whatsappNumber))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10 digit WhatsApp number.",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required.",
      });
    }

    if (
      !educationalQualification ||
      !educationalQualification.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Educational qualification is required.",
      });
    }

    if (!employmentStatus || !employmentStatus.trim()) {
      return res.status(400).json({
        success: false,
        message: "Employment status is required.",
      });
    }

    if (
      !yearsOfExperience ||
      !yearsOfExperience.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Years of experience is required.",
      });
    }

    // ---------------------------------------------------------
    // Areas of interest validation
    // ---------------------------------------------------------

    if (
      !Array.isArray(areasOfInterest) ||
      areasOfInterest.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one area of interest.",
      });
    }

    const normalizedAreasOfInterest = areasOfInterest
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    if (normalizedAreasOfInterest.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one valid area of interest.",
      });
    }

    // ---------------------------------------------------------
    // Opportunities are optional
    // ---------------------------------------------------------

    const normalizedOpportunities = Array.isArray(opportunities)
      ? opportunities
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    // ---------------------------------------------------------
    // Yes / No validation
    // ---------------------------------------------------------

    if (!skillDevelopment) {
      return res.status(400).json({
        success: false,
        message:
          "Please select whether you are interested in skill development.",
      });
    }

    if (!["Yes", "No"].includes(skillDevelopment)) {
      return res.status(400).json({
        success: false,
        message: "Skill development must be Yes or No.",
      });
    }

    if (!jobAlerts) {
      return res.status(400).json({
        success: false,
        message:
          "Please select whether you would like job alerts.",
      });
    }

    if (!["Yes", "No"].includes(jobAlerts)) {
      return res.status(400).json({
        success: false,
        message: "Job alerts must be Yes or No.",
      });
    }

    // ---------------------------------------------------------
    // Create database document
    // ---------------------------------------------------------

    const talent = await TalentRegistration.create({
      fullName: fullName.trim(),

      mobileNumber: String(mobileNumber).trim(),

      whatsappNumber: String(whatsappNumber).trim(),

      email: email
        ? String(email).trim().toLowerCase()
        : "",

      address: address.trim(),

      educationalQualification:
        educationalQualification.trim(),

      employmentStatus: employmentStatus.trim(),

      yearsOfExperience:
        yearsOfExperience.trim(),

      areasOfInterest:
        normalizedAreasOfInterest,

      opportunities:
        normalizedOpportunities,

      skillDevelopment,

      jobAlerts,
    });

    // ---------------------------------------------------------
    // Success response
    // ---------------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Talent registration submitted successfully.",
      data: talent,
    });
  } catch (error) {
    console.error(
      "Talent Registration Controller Error:",
      error
    );

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (item) => item.message
      );

      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationErrors,
      });
    }

    // Server/database error
    return res.status(500).json({
      success: false,
      message:
        "Unable to submit the talent registration. Please try again later.",
    });
  }
};

module.exports = {
  createTalentRegistration,
};