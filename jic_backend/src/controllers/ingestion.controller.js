const fs = require('fs');
const { parseExcel } = require('../utils/excelParser');
const Institution = require('../models/institution.model');
const Resource = require('../models/resource.model');
const Rider = require('../models/rider.model');
const Enabler = require('../models/enabler.model');
const IndustryUnder50L = require('../models/industryUnder50L.model'); // Added Industry Model
const Industry50LPlus = require('../models/industry50LPlus.model');
const sendResponse = require('../utils/apiResponse');
const { randomBytes, randomUUID } = require('crypto'); // FIX: Added randomUUID for collision-safe resourceId generation

// --- SHARED UTILS ---
const parseBoolean = (val) => {
    if (val === true || val === 1) return true;
    if (typeof val === 'string') {
        const lower = val.toLowerCase().trim();
        return ['yes', 'true', '1', 'y'].includes(lower);
    }
    return false;
};

const parseDate = (val) => {
    if (!val) return null;
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? null : parsed;
};

const parseArray = (val) => {
    if (!val) return [];
    return String(val).split(',').map(item => item.trim()).filter(Boolean);
};

const getSafeStatus = (rawStatus) => {
    if (!rawStatus) return '';
    const s = String(rawStatus).toLowerCase().trim();
    if (s.includes('employ')) return 'Employed';
    if (s.includes('unemploy')) return 'Unemployed';
    if (s.includes('fresh') || s.includes('student')) return 'Student';
    if (s.includes('freelance')) return 'Freelancer';
    if (s.includes('self') || s.includes('business')) return 'Self-Employed';
    return '';
};

// --- 1. RESOURCE MODULE MAPPING & UPLOAD (MODIFIED) ---
const mapResourceData = (row) => {
    // FIX: Replaced Date.now()+random with randomUUID() to prevent E11000 collision on resourceId index during batch processing
    const resourceId = row['Resource_ID'] ? String(row['Resource_ID']).trim() : `RES-${randomUUID()}`;

    return {
        resourceId,
        fullName: row['Full_Name'] || '',
        gender: row['Gender'] || '',
        dateOfBirth: parseDate(row['Date_of_Birth']),
        age: parseInt(row['Age']) || null,
        phoneNumber: row['Phone_Number'] ? String(row['Phone_Number']).replace(/\D/g, '').slice(-10) : '',
        email: row['Email'] || '',
        address: {
            fullAddress: row['Address'] || '',
            village: row['Village/Ward'] || '',
            block: row['Block'] || '',
            district: row['District'] || '',
            state: row['State'] || ''
        },
        education: {
            highestQualification: row['Highest_Qualification'] || '',
            degreeName: row['Degree_Name'] || '',
            specialization: row['Specialization'] || '',
            collegeUniversity: row['College/University_Name'] || '',
            passoutYear: row['Passout_Year'] ? String(row['Passout_Year']) : ''
        },
        employment: {
            currentStatus: getSafeStatus(row['Current_Employment_Status']),
            employerName: row['Employer_Name'] || '',
            jobRole: row['Job_Role'] || '',
            yearsOfExperience: parseFloat(row['Years_of_Experience']) || 0,
            lastMonthSalary: (row['Last_Month_Salary']) || 0
        },
        skills: {
            primary: { name: row['Primary_Skill'] || '', level: row['Primary_Skill_Level'] || '' },
            secondary: { name: row['Secondary_Skill'] || '', level: row['Secondary_Skill_Level'] || '' },
            tertiary: { name: row['Tertiary_Skill'] || '', level: row['Tertiary_Skill_Level'] || '' }
        },
        interests: [row['Area_of_Interest_1'], row['Area_of_Interest_2'], row['Area_of_Interest_3']].filter(Boolean).slice(0, 3),
        workPreference: {
            preferredWorkType: row['Preferred_Work_Type'] || '',
            expectedSalary: (row['Expected_Salary']) || 0,
            availability: row['Availability'] || ''
        },
        digitalProfile: {
            digitalLiteracyLevel: row['Digital_Literacy_Level'] || '',
            languagesKnown: parseArray(row['Languages_Known']),
            certifications: parseArray(row['Certifications']),
            ownsSmartphone: parseBoolean(row['Owns_Smartphone']),
            hasInternetAccess: parseBoolean(row['Has_Internet_Access'])
        },
        flags: {
            willingToRelocate: parseBoolean(row['Willing_to_Relocate']),
            willingForTraining: parseBoolean(row['Willing_for_Training'])
        },
        notes: row['Notes'] || '',
        registrationSource: 'Excel Upload',
        status: 'Active'
    };
};

const uploadResourceExcel = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an Excel or CSV file');
        }

        const filePath = req.file.path;
        const rawData = parseExcel(filePath);

        if (!rawData || rawData.length === 0) {
            fs.unlinkSync(filePath);
            res.status(400);
            throw new Error('The uploaded file is empty or formatted incorrectly.');
        }

        // FIX: Map ALL rows without any filtering — no row is discarded at this stage
        const formattedData = rawData.map(mapResourceData);

        // FIX: Controller-level validation — for REPORTING only, does not block saving
        const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const warningRows = [];

        formattedData.forEach((doc, index) => {
            const rowNumber = index + 2; // +2 = 1-indexed + header row offset
            const issues = [];

            if (!doc.phoneNumber || doc.phoneNumber.length !== 10) {
                issues.push('Missing or invalid phone number (must be 10 digits)');
            }
            if (!doc.fullName || doc.fullName.trim() === '') {
                issues.push('Missing Full Name');
            }
            if (doc.email && doc.email.trim() !== '' && !EMAIL_REGEX.test(doc.email)) {
                issues.push(`Invalid email format: "${doc.email}"`);
            }

            if (issues.length > 0) {
                warningRows.push({
                    rowNumber,
                    fullName: doc.fullName || '(blank)',
                    phoneNumber: doc.phoneNumber || '(blank)',
                    email: doc.email || '(blank)',
                    issues
                });
            }
        });

        // FIX: Build bulkOps for ALL rows — not just valid ones
        // Upsert strategy:
        //   - If phoneNumber exists (10 digits): upsert by phoneNumber (update if same phone exists, insert if new)
        //   - If phoneNumber is missing/invalid: always insert as new document (no filter match possible)
        const bulkOps = formattedData.map(doc => {
            if (doc.phoneNumber && doc.phoneNumber.length === 10) {
                // Standard upsert by phone
                return {
                    updateOne: {
                        filter: { phoneNumber: doc.phoneNumber },
                        update: { $set: doc },
                        upsert: true
                    }
                };
            } else {
                // No valid phone — insert as brand new document always
                // Use resourceId as a stable insert anchor (it is UUID-based, always unique)
                return {
                    updateOne: {
                        filter: { resourceId: doc.resourceId },
                        update: { $set: doc },
                        upsert: true
                    }
                };
            }
        });

        let insertedCount = 0;
        let modifiedCount = 0;
        const dbErrorRows = [];

        if (bulkOps.length > 0) {
            try {
                // FIX: ordered: false ensures one failing document never blocks the rest
                const result = await Resource.bulkWrite(bulkOps, { ordered: false });
                insertedCount = result.upsertedCount;
                modifiedCount = result.modifiedCount;
            } catch (bulkError) {
                // FIX: Even if bulkWrite partially fails (e.g. remaining E11000 on resourceId),
                // capture the DB-level errors per document and continue — do NOT throw
                if (bulkError.writeErrors && bulkError.writeErrors.length > 0) {
                    insertedCount = bulkError.result?.nUpserted || 0;
                    modifiedCount = bulkError.result?.nModified || 0;

                    bulkError.writeErrors.forEach(writeErr => {
                        const failedDoc = formattedData[writeErr.index];
                        dbErrorRows.push({
                            rowNumber: writeErr.index + 2,
                            fullName: failedDoc?.fullName || '(unknown)',
                            phoneNumber: failedDoc?.phoneNumber || '(unknown)',
                            email: failedDoc?.email || '(unknown)',
                            issues: [`Database error: ${writeErr.errmsg || 'Unknown DB error'}`]
                        });
                    });
                } else {
                    // Complete bulkWrite failure (not partial) — still don't throw, report it
                    dbErrorRows.push({
                        rowNumber: 'ALL',
                        fullName: '',
                        phoneNumber: '',
                        email: '',
                        issues: [`Critical database error: ${bulkError.message}`]
                    });
                }
            }
        }

        // FIX: Cleanup uploaded temp file
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // FIX: Merge controller-level warnings and DB-level errors into one unified report
        const allIssues = [...warningRows, ...dbErrorRows];
        const skippedCount = 0; // No rows are skipped — all are attempted
        const totalProcessed = formattedData.length;

        const responseData = {
            totalProcessed,
            insertedCount,
            modifiedCount,
            skippedCount,
            warningCount: warningRows.length,
            dbErrorCount: dbErrorRows.length,
            report: {
                summary: allIssues.length === 0
                    ? 'All rows processed successfully with no data issues.'
                    : `${allIssues.length} row(s) had data quality issues (all were still saved or attempted).`,
                issues: allIssues
            }
        };

        return sendResponse(
            res,
            200,
            true,
            `Excel processed. Inserted: ${insertedCount}, Updated: ${modifiedCount}, Warnings: ${warningRows.length}`,
            responseData
        );

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        next(error);
    }
};

// --- 2. RIDER MODULE MAPPING & UPLOAD (MODIFIED) ---
const mapRiderData = (row) => ({
    riderId: `RDR-${randomUUID()}`,

    // BUG 1 FIX: Header has trailing space → 'Full_Name ' not 'Full_Name'
    fullName: row['Full_Name '] || row['Full_Name'] || '',

    age: parseInt(row['Age']) || null,

    // BUG 2 FIX: Excel has 'Male ' with trailing space → .trim() before enum match
    gender: (() => {
        const v = String(row['Gender'] || '').trim().toLowerCase();
        if (v === 'male') return 'Male';
        if (v === 'female') return 'Female';
        if (v === 'other') return 'Other';
        return '';
    })(),

    phoneNumber: row['Phone_Number'] 
        ? String(row['Phone_Number']).replace(/\D/g, '').slice(-10) 
        : '',
    city: row['City'] || '',
    areaLocality: row['Area/Locality'] || '',
    platform: {
        primary: row['Primary_Platform'] || '',
        others: parseArray(row['Other_Platforms'])
    },
    employment: {
        type: (() => {
            const v = String(row['Employment_Type'] || '').trim().toLowerCase().replace(/[-\s]/g, '');
            if (v.includes('fulltime') || v === 'full') return 'Full-time';
            if (v.includes('parttime') || v === 'part') return 'Part-time';
            if (v.includes('freelance')) return 'Freelance';
            if (v.includes('contract')) return 'Contract';
            return '';
        })()
    },
    vehicle: {
        type: (() => {
            const v = String(row['Vehicle_Type'] || '').trim().toLowerCase();
            if (v.includes('bicycle') || v === 'cycle') return 'Bicycle';
            if (v.includes('motorcycle') || v === 'bike' || v.includes('two wheeler') || v === '2-wheeler') return 'Motorcycle';
            if (v.includes('auto')) return 'Auto';
            if (v === 'car' || v.includes('four wheeler') || v === '4-wheeler') return 'Car';
            if (v === 'van') return 'Van';
            if (v === 'truck') return 'Truck';
            if (v.includes('e-bike') || v.includes('ebike') || v.includes('electric')) return 'E-Bike';
            return '';
        })(),
        ownsVehicle: parseBoolean(row['Owns_Vehicle']),
        details: row['Vehicle_Details'] || '',
        drivingLicense: parseBoolean(row['Driving_License'])
    },
    workSchedule: {
        // BUG 3 FIX: '8 Hour ' → extract leading number
        hoursPerDay: parseFloat(String(row['Working_Hours_per_Day'] || '0')) || 0,
        // BUG 4 FIX: 'Monday To Saturday' → map to numeric day count
        daysPerWeek: (() => {
            const raw = String(row['Working_Days_per_Week'] || '').trim().toLowerCase();
            const num = parseFloat(raw);
            if (!isNaN(num)) return num;
            // Named day-range mapping
            if (raw.includes('monday') && raw.includes('sunday')) return 7;
            if (raw.includes('monday') && raw.includes('saturday')) return 6;
            if (raw.includes('monday') && raw.includes('friday')) return 5;
            return 0;
        })(),
        preferredShift: (() => {
            const v = String(row['Preferred_Work_Shift'] || '').trim().toLowerCase();
            if (v.includes('morn')) return 'Morning';
            if (v.includes('after') || v.includes('noon')) return 'Afternoon';
            if (v.includes('even')) return 'Evening';
            if (v.includes('night')) return 'Night';
            if (v.includes('flex') || v.includes('any')) return 'Flexible';
            return '';
        })()
    },
    earnings: {
        averageMonthly: row['Average_Monthly_Earnings'] || 0,
        peakMonth: row['Peak_Earnings_Month'] || '',
        fuelCostMonthly: row['Fuel_Cost_per_Month'] || 0,
        maintenanceCostMonthly: row['Maintenance_Cost_per_Month'] || 0,
        netSavingsEstimate: row['Net_Savings_Estimate'] || 0
    },
    experience: {
        years: parseFloat(row['Years_of_Experience']) || 0,
        orderType: String(row['Order_Type'] || '').trim(),
        dailyOrdersAvg: parseFloat(row['Daily_Orders_Avg']) || 0,
        serviceAreaCovered: String(row['Service_Area_Covered'] || '').trim()
    },
    delivery: {
        willingForLocal: parseBoolean(row['Willing_for_Local_Delivery']),
        willingForEcommerce: parseBoolean(row['Willing_for_Ecommerce_Delivery'])
    },
    digital: {
        smartphoneAvailable: parseBoolean(row['Smartphone_Availability']),
        // BUG 5 FIX: 'Internet_Access' contains URLs, not booleans in this file
        // Use it as a boolean (any non-empty value = true)
        internetAccess: !!row['Internet_Access'],
        // BUG 5 FIX: 'Digital_App_Usage_Level' contains URLs → default to '' 
        appUsageLevel: (() => {
            const v = String(row['Digital_App_Usage_Level'] || '').trim().toLowerCase();
            if (v.startsWith('http') || v === '') return ''; // URL or empty → blank
            if (v.includes('none') || v === 'no') return 'None';
            if (v.includes('basic') || v.includes('beginner')) return 'Basic';
            if (v.includes('inter') || v.includes('medium')) return 'Intermediate';
            if (v.includes('adv') || v.includes('expert')) return 'Advanced';
            return '';
        })()
    },
    financial: {
        bankAccount: parseBoolean(row['Bank_Account']),
        upiAvailable: parseBoolean(row['UPI_Available'])
    },
    safety: {
        insuranceCover: parseBoolean(row['Insurance_Cover']),
        accidentHistory: parseBoolean(row['Accident_History'])
    },
    growth: {
        interestInFulltimeJob: parseBoolean(row['Interest_in_Fulltime_Job']),
        interestInSkillTraining: parseBoolean(row['Interest_in_Skill_Training'])
    },
    challengesFaced: row['Challenges_Faced'] || '',
    notes: row['Notes'] || '',
    registrationSource: 'Excel Upload',
    status: 'Active'
});

const uploadRiderExcel = async (req, res, next) => {
    try {
        // In ingestion.controller.js, top of uploadRiderExcel:
        console.log('uploadRiderExcel hit. req.file:', req.file ? req.file.originalname : 'UNDEFINED');
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an Excel or CSV file');
        }

        const filePath = req.file.path;
        const rawData = parseExcel(filePath);

        if (!rawData || rawData.length === 0) {
            fs.unlinkSync(filePath);
            res.status(400);
            throw new Error('The uploaded file is empty or formatted incorrectly.');
        }

        // FIX: Map ALL rows — no row is filtered or discarded at this stage
        const formattedData = rawData.map(mapRiderData);

        // FIX: Controller-level validation — for REPORTING only, does not block saving any row
        const warningRows = [];

        formattedData.forEach((doc, index) => {
            const rowNumber = index + 2; // +2 accounts for 1-indexing and header row
            const issues = [];

            if (!doc.phoneNumber || doc.phoneNumber.length !== 10) {
                issues.push('Missing or invalid phone number (must be 10 digits)');
            }
            if (!doc.fullName || doc.fullName.trim() === '') {
                issues.push('Missing Full Name');
            }
            if (doc.age !== null && doc.age !== undefined && (doc.age < 16 || doc.age > 80)) {
                issues.push(`Age out of expected range (16-80): "${doc.age}"`);
            }

            if (issues.length > 0) {
                warningRows.push({
                    rowNumber,
                    fullName: doc.fullName || '(blank)',
                    phoneNumber: doc.phoneNumber || '(blank)',
                    city: doc.city || '(blank)',
                    issues
                });
            }
        });

        // FIX: insertMany with ALL rows — every Excel row becomes a new document
        // No upsert, no deduplication, no filter by phone or name
        // If Excel has 1000 rows → 1000 new documents are inserted
        // ordered: false ensures one failing document never blocks the rest
        let insertedCount = 0;
        const dbErrorRows = [];

        if (formattedData.length > 0) {
            try {
                console.log("Excel Rows:", rawData.length);
console.log("Mapped Rows:", formattedData.length);
                const result = await Rider.insertMany(formattedData, { ordered: false });
                insertedCount = result.length;
            } catch (insertError) {
                // FIX: Correct property paths for Mongoose MongoBulkWriteError
                if (typeof insertError.insertedCount === 'number') {
                    insertedCount = insertError.insertedCount;
                } else if (insertError.result?.result?.nInserted !== undefined) {
                    insertedCount = insertError.result.result.nInserted;
                } else if (insertError.insertedDocs?.length) {
                    insertedCount = insertError.insertedDocs.length;
                } else {
                    // Last resort — count ops minus errors
                    const errCount = (insertError.writeErrors || []).length;
                    insertedCount = formattedData.length - errCount;   
                }

                const writeErrors = insertError.writeErrors || insertError.errors || [];
                writeErrors.forEach(writeErr => {
                    const idx = writeErr.index ?? writeErr.err?.index;
                    const failedDoc = formattedData[idx];
                    dbErrorRows.push({
                        rowNumber: (idx ?? 0) + 2,
                        fullName: failedDoc?.fullName || '(unknown)',
                        phoneNumber: failedDoc?.phoneNumber || '(unknown)',
                        city: failedDoc?.city || '(unknown)',
                        issues: [`Database error: ${writeErr.errmsg || writeErr.err?.errmsg || 'Unknown DB error'}`]
                    });
                });
            }
        }

        // FIX: Cleanup temp file
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // FIX: Merge controller warnings and DB errors into unified report
        const allIssues = [...warningRows, ...dbErrorRows];
        const totalProcessed = formattedData.length;

        const responseData = {
            totalProcessed,
            insertedCount,
            warningCount: warningRows.length,
            dbErrorCount: dbErrorRows.length,
            report: {
                summary: allIssues.length === 0
                    ? 'All rows processed successfully with no data issues.'
                    : `${allIssues.length} row(s) had data quality issues (all were still saved or attempted).`,
                issues: allIssues
            }
        };

        return sendResponse(
            res,
            200,
            true,
            `Rider Excel processed. Inserted: ${insertedCount}, Warnings: ${warningRows.length}`,
            responseData
        );

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        next(error);
    }
};
// --- 3. ECOMMERCE ENABLERS MODULE MAPPING & UPLOAD (EXISTING) ---
const mapEnablerData = (row) => ({
    enablerId: row['Enabler_ID'] || `ENB-${Date.now()}-${randomBytes(3).toString('hex')}`,
    companyName: row['Company_Name'] || '',
    ownerName: row['Owner_Name'] || '',
    contactNumber: row['Contact_Number'] ? String(row['Contact_Number']).replace(/\D/g, '').slice(-10) : '',
    email: row['Email'] || '',
    address: {
        fullAddress: row['Address'] || '',
        city: row['City'] || '',
        district: row['District'] || '',
        state: row['State'] || ''
    },
    serviceProfile: {
        category: row['Service_Category'] || '',
        servicesOffered: parseArray(row['Services_Offered']),
        yearsOfExperience: parseFloat(row['Years_of_Experience']) || 0,
        numberOfClients: parseInt(row['Number_of_Clients']) || 0,
        clientTypes: row['Client_Types'] || '',
        pricingModel: row['Pricing_Model'] || '',
        serviceArea: row['Service_Area'] || ''
    },
    capabilities: {
        supportsLocalBusinesses: parseBoolean(row['Supports_Local_Businesses']),
        handlesEcommercePlatforms: parseBoolean(row['Handles_Ecommerce_Platforms']),
        platformsSupported: parseArray(row['Platforms_Supported']),
        providesPackaging: parseBoolean(row['Provides_Packaging']),
        providesLogistics: parseBoolean(row['Provides_Logistics']),
        providesProductListing: parseBoolean(row['Provides_Product_Listing']),
        providesProductPhotography: parseBoolean(row['Provides_Product_Photography']),
        providesQualityAssurance: parseBoolean(row['Provides_Quality_Assurance']),
        providesDigitalMarketing: parseBoolean(row['Provides_Digital_Marketing']),
        providesWarehouse: parseBoolean(row['Provides_Warehouse'])
    },
    businessDetails: {
        techCapabilityLevel: row['Tech_Capability_Level'] || '',
        teamSize: parseInt(row['Team_Size']) || 0,
        turnoverRange: row['Turnover_Range'] || '',
        keyStrengths: parseArray(row['Key_Strengths']),
        certifications: parseArray(row['Certifications']),
        partnerships: parseArray(row['Partnerships'])
    },
    willingToOnboardLocalSellers: parseBoolean(row['Willing_to_Onboard_Local_Sellers']),
    notes: row['Notes'] || '',
    registrationSource: 'Excel Upload',
    status: 'Active'
});

const uploadEnablerExcel = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an Excel or CSV file');
        }

        const filePath = req.file.path;
        const rawData = parseExcel(filePath);

        if (!rawData || rawData.length === 0) {
            fs.unlinkSync(filePath);
            res.status(400);
            throw new Error('The uploaded file is empty or formatted incorrectly.');
        }

        const formattedData = rawData.map(mapEnablerData);

        const bulkOps = formattedData.filter(d => d.contactNumber && d.companyName).map(doc => ({
            updateOne: {
                filter: { contactNumber: doc.contactNumber },
                update: { $set: doc },
                upsert: true
            }
        }));

        let insertedCount = 0;
        let modifiedCount = 0;

        if (bulkOps.length > 0) {
            const result = await Enabler.bulkWrite(bulkOps, { ordered: false });
            insertedCount = result.upsertedCount;
            modifiedCount = result.modifiedCount;
        }

        fs.unlinkSync(filePath);

        return sendResponse(res, 200, true, `Enablers Excel processed. Inserted: ${insertedCount}, Updated: ${modifiedCount}`, { totalProcessed: formattedData.length, insertedCount, modifiedCount });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        next(error);
    }
};

// --- 4. INDUSTRY UNDER 50L MODULE MAPPING & UPLOAD (MODIFIED) ---
const mapIndustryData = (row) => ({
    industryId: row['Industry_ID'] ? String(row['Industry_ID']).trim() : `IND50L-${randomUUID()}`, // FIX: randomUUID prevents timestamp collision on batch inserts
    companyName: row['Company_Name'] || '',
    ownerName: row['Owner_Name'] || '',
    businessCategory: row['Business_Category'] || '',
    industryType: row['Industry_Type'] || '',
    natureOfBusiness: row['Nature_of_Business'] || '',
    shortCompanyBio: row['Short_Company_Bio'] || '',
    yearEstablished: parseInt(row['Year_Established']) || null,
    phoneNumber: row['Phone_Number'] ? String(row['Phone_Number']).replace(/\D/g, '').slice(-10) : '',
    email: row['Email'] || '',
    address: {
        fullAddress: row['Business_Address'] || '',
        village: row['Village/Ward'] || '',
        block: row['Block'] || '',
        district: row['District'] || '',
        state: row['State'] || ''
    },
    compliance: {
        msmeRegistered: parseBoolean(row['MSME_Registered']),
        typeOfCompanyRegistration: row['Type_of_Company_Registration'] || '',
        gstRegistered: parseBoolean(row['GST_Registered?'])
    },
    scale: {
        lastYearTurnover: (row['Last_Year_Turnover']) || 0,
        numberOfEmployees: parseInt(row['Number_of_Employees']) || 0
    },
    digitalPresence: {
        hasWebsite: parseBoolean(row['Has_Website']),
        websiteUrl: row['Website_URL'] || '',
        googleMyBusinessListed: parseBoolean(row['Google_My_Business_Listed']),
        socialMediaPresence: row['Social_Media_Presence'] || '',
        whatsappBusinessSetup: parseBoolean(row['WhatsApp_Business_Setup'])
    },
    onlineBusiness: {
        onlineSelling: parseBoolean(row['Online_Selling']),
        platformsUsed: parseArray(row['Platforms_Used'])
    },
    products: {
        primary: row['Primary_Products/Services'] || '',
        secondary: row['Secondary_Products/Services'] || '',
        targetCustomers: row['Target_Customers'] || ''
    },
    needs: {
        keyChallenges: row['Key_Challenges'] || '',
        hiringNeeds: row['Hiring_Needs'] || '',
        digitalSupportNeeded: row['Digital_Support_Needed'] || ''
    },
    growth: {
        doesExport: parseBoolean(row['Do You Export?']),
        willingToExport: parseBoolean(row['Willing to Export?']),
        openToEcommerce: parseBoolean(row['Open_to_Ecommerce'])
    },
    notes: row['Notes'] || '',
    registrationSource: 'Excel Upload',
    status: 'Active'
});

const uploadIndustryExcel = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an Excel or CSV file');
        }

        const filePath = req.file.path;
        const rawData = parseExcel(filePath);

        if (!rawData || rawData.length === 0) {
            fs.unlinkSync(filePath);
            res.status(400);
            throw new Error('The uploaded file is empty or formatted incorrectly.');
        }

        // FIX: Map ALL rows — no row is filtered or discarded at this stage
        const formattedData = rawData.map(mapIndustryData);

        // FIX: Controller-level validation — for REPORTING only, does not block saving any row
        const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const warningRows = [];

        formattedData.forEach((doc, index) => {
            const rowNumber = index + 2; // +2 accounts for 1-indexing and header row
            const issues = [];

            if (!doc.phoneNumber || doc.phoneNumber.length !== 10) {
                issues.push('Missing or invalid phone number (must be 10 digits)');
            }
            if (!doc.companyName || doc.companyName.trim() === '') {
                issues.push('Missing Company Name');
            }
            if (!doc.ownerName || doc.ownerName.trim() === '') {
                issues.push('Missing Owner Name');
            }
            if (doc.email && doc.email.trim() !== '' && !EMAIL_REGEX.test(doc.email)) {
                issues.push(`Invalid email format: "${doc.email}"`);
            }

            if (issues.length > 0) {
                warningRows.push({
                    rowNumber,
                    companyName: doc.companyName || '(blank)',
                    phoneNumber: doc.phoneNumber || '(blank)',
                    email: doc.email || '(blank)',
                    issues
                });
            }
        });

        // FIX: insertMany with ALL rows — every Excel row becomes a new document
        // No upsert, no deduplication, no filter by phone or company
        // If Excel has 7424 rows → 7424 new documents are inserted
        // ordered: false ensures one failing document never blocks the rest
        let insertedCount = 0;
        const dbErrorRows = [];

        if (formattedData.length > 0) {
            try {
                const result = await IndustryUnder50L.insertMany(formattedData, { ordered: false });
                insertedCount = result.length;
            } catch (insertError) {
                // FIX: Partial failure handling — capture per-document errors, do NOT throw
                if (insertError.insertedDocs) {
                    insertedCount = insertError.insertedDocs.length;
                } else if (insertError.result?.insertedCount) {
                    insertedCount = insertError.result.insertedCount;
                }

                const writeErrors = insertError.writeErrors || insertError.errors || [];
                writeErrors.forEach(writeErr => {
                    const idx = writeErr.index ?? writeErr.err?.index;
                    const failedDoc = formattedData[idx];
                    dbErrorRows.push({
                        rowNumber: (idx ?? 0) + 2,
                        companyName: failedDoc?.companyName || '(unknown)',
                        phoneNumber: failedDoc?.phoneNumber || '(unknown)',
                        email: failedDoc?.email || '(unknown)',
                        issues: [`Database error: ${writeErr.errmsg || writeErr.err?.errmsg || 'Unknown DB error'}`]
                    });
                });
            }
        }

        // FIX: Cleanup temp file
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // FIX: Merge controller warnings and DB errors into unified report
        const allIssues = [...warningRows, ...dbErrorRows];
        const totalProcessed = formattedData.length;

        const responseData = {
            totalProcessed,
            insertedCount,
            warningCount: warningRows.length,
            dbErrorCount: dbErrorRows.length,
            report: {
                summary: allIssues.length === 0
                    ? 'All rows processed successfully with no data issues.'
                    : `${allIssues.length} row(s) had data quality issues (all were still saved or attempted).`,
                issues: allIssues
            }
        };

        return sendResponse(
            res,
            200,
            true,
            `Industry (Under 50L) Excel processed. Inserted: ${insertedCount}, Warnings: ${warningRows.length}`,
            responseData
        );

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        next(error);
    }
};

// --- 5. INDUSTRY 50L+ MODULE MAPPING & UPLOAD (MODIFIED) ---
const mapIndustry50LData = (row) => ({
    industryId: row['Industry_ID'] ? String(row['Industry_ID']).trim() : `IND50P-${randomUUID()}`, // FIX: randomUUID prevents timestamp collision on batch inserts
    companyName: row['Company_Name'] || '',
    ownerCeoName: row['Owner/CEO_Name'] || '',
    businessCategory: row['Business_Category'] || '',
    industryType: row['Industry_Type'] || '',
    natureOfBusiness: row['Nature_of_Business'] || '',
    shortCompanyProfile: row['Short_Company_Profile'] || '',
    yearEstablished: parseInt(row['Year_Established']) || null,
    phoneNumber: row['Phone_Number'] ? String(row['Phone_Number']).replace(/\D/g, '').slice(-10) : '',
    email: row['Email'] || '',
    websiteUrl: row['Website_URL'] || '',
    address: {
        fullAddress: row['Business_Address'] || '',
        city: row['City'] || '',
        district: row['District'] || '',
        state: row['State'] || ''
    },
    compliance: {
        msmeRegistered: parseBoolean(row['MSME_Registered']),
        gstRegistered: parseBoolean(row['GST_Registered']),
        companyRegistrationType: row['Company_Registration_Type'] || '',
        certifications: parseArray(row['Certifications'])
    },
    scale: {
        lastYearTurnover: (row['Last_Year_Turnover']) || 0,
        numberOfEmployees: parseInt(row['Number_of_Employees']) || 0,
        supplyCapacity: row['Supply_Capacity'] || '',
        investmentRequirement: (row['Investment_Requirement']) || 0
    },
    products: {
        keyProductsServices: row['Key_Products/Services'] || '',
        majorClients: row['Major_Clients'] || '',
        operationalArea: row['Operational_Area'] || '',
        logisticsPartners: parseArray(row['Logistics_Partners'])
    },
    export: {
        exportsCurrently: parseBoolean(row['Exports_Currently']),
        exportCountries: parseArray(row['Export_Countries']),
        exportRevenuePercentage: parseFloat(row['Export_Revenue_Percentage']) || 0,
        willingToExport: parseBoolean(row['Willing_to_Export']),
        exportReadinessLevel: row['Export_Readiness_Level'] || ''
    },
    digital: {
        technologyUsageLevel: row['Technology_Usage_Level'] || '',
        digitalPresenceLevel: row['Digital_Presence_Level'] || '',
        ecommerceEnabled: parseBoolean(row['Ecommerce_Enabled'])
    },
    needs: {
        hiringNeeds: row['Hiring_Needs'] || '',
        skillGaps: row['Skill_Gaps'] || '',
        keyChallenges: row['Key_Challenges'] || '',
        expansionPlans: row['Expansion_Plans'] || ''
    },
    notes: row['Notes'] || '',
    registrationSource: 'Excel Upload',
    status: 'Active'
});

const uploadIndustry50LExcel = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an Excel or CSV file');
        }

        const filePath = req.file.path;
        const rawData = parseExcel(filePath);

        if (!rawData || rawData.length === 0) {
            fs.unlinkSync(filePath);
            res.status(400);
            throw new Error('The uploaded file is empty or formatted incorrectly.');
        }

        // FIX: Map ALL rows — no row is filtered or discarded at this stage
        const formattedData = rawData.map(mapIndustry50LData);

        // FIX: Controller-level validation — for REPORTING only, does not block saving any row
        const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const warningRows = [];

        formattedData.forEach((doc, index) => {
            const rowNumber = index + 2;
            const issues = [];

            if (!doc.phoneNumber || doc.phoneNumber.length !== 10) {
                issues.push('Missing or invalid phone number (must be 10 digits)');
            }
            if (!doc.companyName || doc.companyName.trim() === '') {
                issues.push('Missing Company Name');
            }
            if (!doc.ownerCeoName || doc.ownerCeoName.trim() === '') {
                issues.push('Missing Owner/CEO Name');
            }
            if (doc.email && doc.email.trim() !== '' && !EMAIL_REGEX.test(doc.email)) {
                issues.push(`Invalid email format: "${doc.email}"`);
            }

            if (issues.length > 0) {
                warningRows.push({
                    rowNumber,
                    companyName: doc.companyName || '(blank)',
                    phoneNumber: doc.phoneNumber || '(blank)',
                    email: doc.email || '(blank)',
                    issues
                });
            }
        });

        // FIX: insertMany with ALL rows — every Excel row becomes a new document
        // No upsert, no deduplication, no filter by phone or company
        let insertedCount = 0;
        const dbErrorRows = [];

        if (formattedData.length > 0) {
            try {
                const result = await Industry50LPlus.insertMany(formattedData, { ordered: false });
                insertedCount = result.length;
            } catch (insertError) {
                // FIX: Partial failure handling — capture per-document errors, do NOT throw
                if (insertError.insertedDocs) {
                    insertedCount = insertError.insertedDocs.length;
                } else if (insertError.result?.insertedCount) {
                    insertedCount = insertError.result.insertedCount;
                }

                const writeErrors = insertError.writeErrors || insertError.errors || [];
                writeErrors.forEach(writeErr => {
                    const idx = writeErr.index ?? writeErr.err?.index;
                    const failedDoc = formattedData[idx];
                    dbErrorRows.push({
                        rowNumber: (idx ?? 0) + 2,
                        companyName: failedDoc?.companyName || '(unknown)',
                        phoneNumber: failedDoc?.phoneNumber || '(unknown)',
                        email: failedDoc?.email || '(unknown)',
                        issues: [`Database error: ${writeErr.errmsg || writeErr.err?.errmsg || 'Unknown DB error'}`]
                    });
                });
            }
        }

        // FIX: Cleanup temp file
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // FIX: Merge controller warnings and DB errors into unified report
        const allIssues = [...warningRows, ...dbErrorRows];
        const totalProcessed = formattedData.length;

        const responseData = {
            totalProcessed,
            insertedCount,
            warningCount: warningRows.length,
            dbErrorCount: dbErrorRows.length,
            report: {
                summary: allIssues.length === 0
                    ? 'All rows processed successfully with no data issues.'
                    : `${allIssues.length} row(s) had data quality issues (all were still saved or attempted).`,
                issues: allIssues
            }
        };

        return sendResponse(
            res,
            200,
            true,
            `Industry (50L+) Excel processed. Inserted: ${insertedCount}, Warnings: ${warningRows.length}`,
            responseData
        );

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        next(error);
    }
};


// --- 6. INSTITUTION MODULE MAPPING & UPLOAD (NEW) ---
const mapInstitutionData = (row) => ({
    institutionId: `INST-${randomUUID()}`,
    serialNo: row['S.NO'] ? String(row['S.NO']).trim() : '',
    institutionName: row['Institution Name'] || '',
    email: row['Email'] || '',
    address: row['Address'] || '',
    phone: row['Phone'] ? String(row['Phone']).trim() : '', // RAW — no digit stripping applied
    institutionType: row['Type'] ? String(row['Type']).trim() : '',
    affiliation: row['Affiliation'] ? String(row['Affiliation']).trim() : '',
    coursesOffered: row['Courses Offered (major streams)'] ? String(row['Courses Offered (major streams)']).trim() : '',
    website: row['Website'] ? String(row['Website']).trim() : '',
    registrationSource: 'Excel Upload',
    status: 'Active'
});

const uploadInstitutionExcel = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an Excel or CSV file');
        }

        const filePath = req.file.path;
        const rawData = parseExcel(filePath);

        if (!rawData || rawData.length === 0) {
            fs.unlinkSync(filePath);
            res.status(400);
            throw new Error('The uploaded file is empty or formatted incorrectly.');
        }

        // Map ALL rows — no filtering
        const formattedData = rawData.map(mapInstitutionData);

        // Controller-level validation — informational reporting only
        const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const warningRows = [];

        formattedData.forEach((doc, index) => {
            const rowNumber = index + 2;
            const issues = [];

            if (!doc.institutionName || doc.institutionName.trim() === '') {
                issues.push('Missing Institution Name');
            }
            if (!doc.phone || doc.phone.trim() === '') {
                issues.push('Missing Phone Number'); // Only warns if fully empty
            }
            if (doc.email && doc.email.trim() !== '' && !EMAIL_REGEX.test(doc.email)) {
                issues.push(`Invalid email format: "${doc.email}"`);
            }

            if (issues.length > 0) {
                warningRows.push({
                    rowNumber,
                    institutionName: doc.institutionName || '(blank)',
                    phone: doc.phone || '(blank)',
                    email: doc.email || '(blank)',
                    issues
                });
            }
        });

        // insertMany with ordered: false to guarantee unblocked insertions
        let insertedCount = 0;
        const dbErrorRows = [];

        if (formattedData.length > 0) {
            try {
                const result = await Institution.insertMany(formattedData, { ordered: false });
                insertedCount = result.length;
            } catch (insertError) {
                if (typeof insertError.insertedCount === 'number') {
                    insertedCount = insertError.insertedCount;
                } else if (insertError.result?.result?.nInserted !== undefined) {
                    insertedCount = insertError.result.result.nInserted;
                } else if (insertError.insertedDocs?.length) {
                    insertedCount = insertError.insertedDocs.length;
                } else {
                    const errCount = (insertError.writeErrors || []).length;
                    insertedCount = formattedData.length - errCount;   
                }

                const writeErrors = insertError.writeErrors || insertError.errors || [];
                writeErrors.forEach(writeErr => {
                    const idx = writeErr.index ?? writeErr.err?.index;
                    const failedDoc = formattedData[idx];
                    dbErrorRows.push({
                        rowNumber: (idx ?? 0) + 2,
                        institutionName: failedDoc?.institutionName || '(unknown)',
                        phone: failedDoc?.phone || '(unknown)',
                        email: failedDoc?.email || '(unknown)',
                        issues: [`Database error: ${writeErr.errmsg || writeErr.err?.errmsg || 'Unknown DB error'}`]
                    });
                });
            }
        }

        // Guaranteed Temp file cleanup
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        const allIssues = [...warningRows, ...dbErrorRows];
        const totalProcessed = formattedData.length;

        const responseData = {
            totalProcessed,
            insertedCount,
            warningCount: warningRows.length,
            dbErrorCount: dbErrorRows.length,
            report: {
                summary: allIssues.length === 0
                    ? 'All rows processed successfully with no data issues.'
                    : `${allIssues.length} row(s) had data quality issues (all were still saved or attempted).`,
                issues: allIssues
            }
        };

        return sendResponse(
            res,
            200,
            true,
            `Institution Excel processed. Inserted: ${insertedCount}, Warnings: ${warningRows.length}`,
            responseData
        );

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        next(error);
    }
};



module.exports = {
    uploadResourceExcel,
    uploadRiderExcel,
    uploadEnablerExcel,
    uploadIndustryExcel,
    uploadIndustry50LExcel, // Exported NEW Module Function
    uploadInstitutionExcel
};