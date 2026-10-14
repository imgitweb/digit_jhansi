// src/components/cohorts/CreateCohortModal.jsx
import React, { useState, useEffect } from "react";
import Transition from "../../utils/Transition";
import { createCohort } from "../../api/cohortApi";
import { useNavigate } from "react-router-dom";

const CATEGORY_OPTIONS = [
  "Workforce Training",
  "Skill Development",
  "Entrepreneurship",
  "Digital Literacy",
  "Agriculture",
  "Healthcare",
  "Retail & Commerce",
  "Manufacturing",
  "Other",
];
export default function CreateCohortModal({
  isOpen,
  onClose,
  selectedResources,
  onSuccess,
}) {
  const navigate = useNavigate();
  const initialFormState = {
    name: "",
    category: "Workforce Training",
    primarySkill: "",
    description: "",
    startDate: "",
    endDate: "",
    mentor: "",
    status: "Planned",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setCustomCategory("");
      setError(null);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      category: value,
    }));

    // Clear custom input when selecting predefined category
    if (CATEGORY_OPTIONS.includes(value)) {
      setCustomCategory("");
    }
  };

  const handleCustomCategory = (e) => {
  const value = e.target.value;

  setCustomCategory(value);

  setFormData(prev => ({
    ...prev,
    category: value.trim()
  }));
};

  const handleSubmit = async () => {
    setError(null);
    if (!formData.name.trim()) {
      setError("Cohort Name is required.");
      return;
    }
    if (!formData.primarySkill.trim()) {
      setError("Primary Skill is required.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Start Date and End Date are required.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),

        // Enum-safe category
        category: formData.category,

        primarySkill: formData.primarySkill.trim(),

        // Append custom category into description
        description: formData.description.trim(),

        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        mentor: formData.mentor.trim(),
        status: formData.status,
        memberIds: selectedResources.map(r => r._id)
      };

      const response = await createCohort(payload);
      if (response.success && response.data) {
        onSuccess(response.data);
      } else {
        throw new Error(response.message || "Failed to create cohort.");
      }
    } catch (err) {
      setError(err.message || "Failed to create cohort. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition
      show={isOpen}
      enter="transition ease-out duration-200"
      enterStart="opacity-0"
      enterEnd="opacity-100"
      leave="transition ease-in duration-150"
      leaveStart="opacity-100"
      leaveEnd="opacity-0"
    >
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <div onClick={onClose} className="absolute inset-0 bg-black/50" />

        {/* Modal Container */}
        <div
          className="relative bg-[#ffffff] rounded-2xl w-full max-w-[640px] max-h-[90vh] flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#dddddd] flex justify-between items-center shrink-0">
            <h2 className="m-0 text-base sm:text-lg font-bold text-[#111111]">
              Create New Cohort
            </h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none cursor-pointer text-[#888888] p-1 hover:text-[#555555] transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Selected Resources Summary */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#dddddd] bg-[#fafafa] shrink-0">
            <div className="bg-[rgba(3,217,133,0.1)] border border-[rgba(3,217,133,0.3)] text-[#02b870] rounded-lg px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-[13px] font-semibold flex items-start sm:items-center gap-2">
              <svg
                className="shrink-0 mt-0.5 sm:mt-0"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>
                {selectedResources.length} resources will be added to this
                cohort
              </span>
            </div>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-[13px] font-semibold text-[#555555] mb-1.5">
                  Cohort Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input w-full px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-lg border border-[#dddddd] outline-none focus:border-[#03D985]"
                  placeholder="e.g. Summer Digital Literacy Batch"
                />
              </div>

              {/* Responsive Row: Category & Status */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
                <div className="flex-1">
                  <label className="block text-xs sm:text-[13px] font-semibold text-[#555555] mb-1.5">
                    Category*
                  </label>

                  <div className="flex flex-col gap-3">
                    {/* Existing Dropdown */}
                    <select
                      name="category"
                      value={
                        CATEGORY_OPTIONS.includes(formData.category)
                          ? formData.category
                          : "Other"
                      }
                      onChange={handleCategorySelect}
                      className="
                      form-select w-full px-3 py-2.5 sm:px-3.5 sm:py-2.5
                      rounded-lg border border-[#dddddd]
                      outline-none bg-white
                      focus:border-[#03D985]
                    "
                    >
                      {CATEGORY_OPTIONS.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    {/* Custom Category Input */}
                    <input
                      type="text"
                      value={customCategory}
                      onChange={handleCustomCategory}
                      placeholder="Or enter custom category..."
                      className="
                      form-input w-full px-3 py-2.5 sm:px-3.5 sm:py-2.5
                      rounded-lg border border-[#dddddd]
                      outline-none
                      focus:border-[#03D985]
                    "
                    />

                    {/* Helper Text */}
                    <p className="text-[11px] sm:text-xs text-[#888888] leading-relaxed">
                      Select an existing category or create your own custom
                      category.
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs sm:text-[13px] font-semibold text-[#555555] mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select w-full px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-lg border border-[#dddddd] outline-none bg-white focus:border-[#03D985]"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] font-semibold text-[#555555] mb-1.5">
                  Primary Skill Focus*
                </label>
                <input
                  type="text"
                  name="primarySkill"
                  value={formData.primarySkill}
                  onChange={handleChange}
                  className="form-input w-full px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-lg border border-[#dddddd] outline-none focus:border-[#03D985]"
                  placeholder="e.g. Digital Marketing, Tailoring, Machine Operation"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] font-semibold text-[#555555] mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea w-full px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-lg border border-[#dddddd] outline-none resize-y focus:border-[#03D985]"
                  rows="3"
                  placeholder="Provide context or goals for this cohort..."
                ></textarea>
              </div>

              {/* Responsive Row: Dates */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
                <div className="flex-1">
                  <label className="block text-xs sm:text-[13px] font-semibold text-[#555555] mb-1.5">
                    Start Date*
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="form-input w-full px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-lg border border-[#dddddd] outline-none focus:border-[#03D985]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs sm:text-[13px] font-semibold text-[#555555] mb-1.5">
                    End Date*
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="form-input w-full px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-lg border border-[#dddddd] outline-none focus:border-[#03D985]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] font-semibold text-[#555555] mb-1.5">
                  Mentor / Trainer Name
                </label>
                <input
                  type="text"
                  name="mentor"
                  value={formData.mentor}
                  onChange={handleChange}
                  className="form-input w-full px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-lg border border-[#dddddd] outline-none focus:border-[#03D985]"
                  placeholder="Enter mentor name"
                />
              </div>

              {error && (
                <div className="p-3 bg-[#fef2f2] text-[#ef4444] border border-[#fecaca] rounded-lg text-xs sm:text-[13px] font-medium">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Responsive Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-[#dddddd] flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 bg-[#fafafa] rounded-b-2xl shrink-0">
            {/* Selection Text - Centers on mobile, sits left on desktop */}
            <span className="text-[#888888] text-xs sm:text-[13px] font-medium w-full sm:w-auto text-center sm:text-left order-2 sm:order-1">
              {selectedResources.length} resources selected
            </span>

            {/* Action Buttons - Full width stacked on mobile, inline on desktop */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto bg-[#ffffff] border border-[#dddddd] text-[#111111] rounded-lg px-4 py-2 sm:px-4 sm:py-2 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto bg-[#03D985] text-[#000000] border-none rounded-lg px-4 py-2 sm:px-4 sm:py-2 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#02b870] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Cohort →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
