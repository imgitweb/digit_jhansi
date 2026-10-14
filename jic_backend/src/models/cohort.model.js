// src/models/cohort.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const cohortSchema = new Schema(
  {
    cohortId: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {  
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      minlength: [2, 'Category must be at least 2 characters'],
      maxlength: [100, 'Category cannot exceed 100 characters']
    },
    primarySkill: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    mentor: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Planned', 'Active', 'Completed', 'Cancelled'],
      default: 'Planned'
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      }
    ],
    totalMembers: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

cohortSchema.pre('save', function () {
  if (this.members) {
    this.totalMembers = this.members.length;
  }
});

cohortSchema.index({ name: 'text', primarySkill: 'text' });

module.exports = mongoose.model('Cohort', cohortSchema);