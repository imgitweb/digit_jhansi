const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists at /src/uploads/
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only Excel and CSV files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', 
        'application/csv',
        'application/octet-stream'  // Windows CSV fallback
    ];
    
    const allowedExtensions = /\.(xlsx|xls|csv)$/i;
    
    // Check both mime type and extension for robust validation
    const mimeOk = allowedMimeTypes.includes(file.mimetype);
    const extOk = allowedExtensions.test(file.originalname);
    
    if (mimeOk || extOk) {  
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
   
module.exports = upload;