const Admin = require('../models/admin.model');

const seedAdmin = async () => {
    try {
        const adminCount = await Admin.countDocuments();
        
        if (adminCount === 0) {
            await Admin.create({
                name: process.env.ADMIN_NAME || 'Jhansi PRD Admin',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'superadmin'
            });
            console.log(`[Seeder] Default admin account created: ${process.env.ADMIN_EMAIL}`);
        } else {
            console.log('[Seeder] Admin account already exists. Skipping seed.');
        }
    } catch (error) {
        console.error('[Seeder Error] Failed to seed admin account:', error.message);  
    }
};

module.exports = seedAdmin;