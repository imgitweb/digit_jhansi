const mongoose = require("mongoose");

const talentRegistrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
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

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    educationalQualification: {
      type: String,
      required: [true, "Educational qualification is required"],
      trim: true,
    },

    employmentStatus: {
      type: String,
      required: [true, "Employment status is required"],
      trim: true,
    },

    yearsOfExperience: {
      type: String,
      required: [true, "Years of experience is required"],
      trim: true,
    },

    areasOfInterest: {
      type: [String],
      required: [true, "At least one area of interest is required"],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one area of interest is required",
      },
    },

    opportunities: {
      type: [String],
      default: [],
    },

    skillDevelopment: {
      type: String,
      required: [true, "Skill development selection is required"],
      enum: {
        values: ["Yes", "No"],
        message: "Skill development must be Yes or No",
      },
    },

    jobAlerts: {
      type: String,
      required: [true, "Job alerts selection is required"],
      enum: {
        values: ["Yes", "No"],
        message: "Job alerts must be Yes or No",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TalentRegistration",
  talentRegistrationSchema
);