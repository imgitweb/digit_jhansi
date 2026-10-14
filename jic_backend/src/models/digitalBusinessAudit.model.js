const mongoose = require("mongoose");

const digitalBusinessAuditSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },

    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10 digit mobile number"],
    },

    whatsappNumber: {
      type: String,
      required: [true, "WhatsApp number is required"],
      trim: true,
      match: [
        /^[0-9]{10}$/,
        "Please enter a valid 10 digit WhatsApp number",
      ],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      match: [
        /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    businessAddress: {
      type: String,
      required: [true, "Business address is required"],
      trim: true,
    },

    businessCategory: {
      type: String,
      required: [true, "Business category is required"],
      trim: true,
    },

    employeeCount: {
      type: String,
      required: [true, "Employee count is required"],
      trim: true,
    },

    services: {
      type: [String],
      default: [],
    },

    biggestChallenge: {
      type: String,
      trim: true,
      default: "",
    },

    receiveReport: {
      type: String,
      required: [true, "Please select whether you want to receive the report"],
      enum: {
        values: ["Yes", "No"],
        message: "Receive report must be Yes or No",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DigitalBusinessAudit",
  digitalBusinessAuditSchema
);