const DigitalBusinessAudit = require("../models/digitalBusinessAudit.model");

/**
 * Create Digital Business Audit
 *
 * POST /api/digital-business-audits/digital-business-audit-register
 */
const createDigitalBusinessAudit = async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      mobileNumber,
      whatsappNumber,
      email,
      businessAddress,
      businessCategory,
      employeeCount,
      services,
      biggestChallenge,
      receiveReport,
    } = req.body;

    // ---------------------------------------------------------
    // Required field validation
    // ---------------------------------------------------------

    if (!businessName || !businessName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Business name is required.",
      });
    }

    if (!ownerName || !ownerName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Owner name is required.",
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

    if (!businessAddress || !businessAddress.trim()) {
      return res.status(400).json({
        success: false,
        message: "Business address is required.",
      });
    }

    if (!businessCategory || !businessCategory.trim()) {
      return res.status(400).json({
        success: false,
        message: "Business category is required.",
      });
    }

    if (!employeeCount || !employeeCount.trim()) {
      return res.status(400).json({
        success: false,
        message: "Employee count is required.",
      });
    }

    if (!receiveReport) {
      return res.status(400).json({
        success: false,
        message: "Please select whether you want to receive the report.",
      });
    }

    if (!["Yes", "No"].includes(receiveReport)) {
      return res.status(400).json({
        success: false,
        message: "Receive report must be Yes or No.",
      });
    }

    // ---------------------------------------------------------
    // Normalize services
    // ---------------------------------------------------------

    const normalizedServices = Array.isArray(services)
      ? services
          .filter((service) => typeof service === "string")
          .map((service) => service.trim())
          .filter(Boolean)
      : [];

    // ---------------------------------------------------------
    // Create database document
    // ---------------------------------------------------------

    const audit = await DigitalBusinessAudit.create({
      businessName: businessName.trim(),

      ownerName: ownerName.trim(),

      mobileNumber: String(mobileNumber).trim(),

      whatsappNumber: String(whatsappNumber).trim(),

      email: email
        ? String(email).trim().toLowerCase()
        : "",

      businessAddress: businessAddress.trim(),

      businessCategory: businessCategory.trim(),

      employeeCount: employeeCount.trim(),

      services: normalizedServices,

      biggestChallenge: biggestChallenge
        ? String(biggestChallenge).trim()
        : "",

      receiveReport,
    });

    // ---------------------------------------------------------
    // Success response
    // ---------------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Digital Business Audit request submitted successfully.",
      data: audit,
    });
  } catch (error) {
    console.error(
      "Digital Business Audit Controller Error:",
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
        "Unable to submit the Digital Business Audit request. Please try again later.",
    });
  }
};

module.exports = {
  createDigitalBusinessAudit,
};