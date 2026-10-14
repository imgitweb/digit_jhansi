const sendResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error(`[Error] ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    sendResponse(res, statusCode, false, err.message || 'Internal Server Error');
};

module.exports = errorHandler;   