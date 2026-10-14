// src/api/cohortApi.js
import axiosInstance from './axiosInstance'; // Adjust path if necessary based on folder structure

const API_BASE = '/cohorts';

export const createCohort = async (payload) => {
  try {
    const response = await axiosInstance.post(API_BASE, payload);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to create cohort';
    throw new Error(message);
  }
};

export const getAllCohorts = async (params = {}) => {
  try {
    // Axios handles query parameter building automatically. 
    // We filter out empty/null values to keep the URL clean.
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    
    const response = await axiosInstance.get(API_BASE, { params: cleanParams });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch cohorts';
    throw new Error(message);
  }
};

export const getCohortById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch cohort details';
    throw new Error(message);
  }
};

export const updateCohort = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`${API_BASE}/${id}`, payload);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to update cohort';
    throw new Error(message);
  }
};

export const addMembersToCohort = async (cohortId, memberIds) => {
  try {
    const response = await axiosInstance.post(`${API_BASE}/${cohortId}/members`, { memberIds });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to add members';
    throw new Error(message);
  }
};

export const removeMemberFromCohort = async (cohortId, memberId) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE}/${cohortId}/members/${memberId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to remove member';
    throw new Error(message);
  }
};