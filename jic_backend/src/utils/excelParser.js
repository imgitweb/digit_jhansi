const xlsx = require('xlsx');

/**
 * Parses an Excel or CSV file and returns an array of JSON objects
 */
const parseExcel = (filePath) => {
    try {
        // Read the file from the uploads directory
        const workbook = xlsx.readFile(filePath);
        
        // Assume data is always in the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sheet to JSON, treating the first row as headers
        // raw: false ensures dates and numbers are formatted as strings initially for easier parsing
        const data = xlsx.utils.sheet_to_json(worksheet, { defval: "", raw: false });
        
        // Clean headers (remove leading/trailing spaces from keys)
        const cleanedData = data.map(row => {
            const cleanRow = {};
            for (let key in row) {
                cleanRow[key.trim()] = row[key];  
            }
            return cleanRow;
        });

        return cleanedData;
    } catch (error) {
        throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
};

module.exports = { parseExcel };