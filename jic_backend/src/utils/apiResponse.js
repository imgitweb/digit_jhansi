/**
 * Standardized API Response structure
 */
const sendResponse = (res, statusCode, success, message, data = null, pagination = null) => {
    const response = {
        success,
        message,
    };

    if (data !== null) {
        response.data = data;
    }

    if (pagination !== null) {
        response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
};
   
module.exports = sendResponse;