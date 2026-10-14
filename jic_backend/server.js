require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler.js');
const seedAdmin = require('./src/utils/adminSeeder.js');
const cohortRoutes = require('./src/routes/cohort.routes.js');
const dashboardRoutes = require('./src/routes/dashboard/index.js');

const digitalBusinessAuditRoutes = require('./src/routes/digitalBusinessAudit.routes.js');
const talentRegistrationRoutes = require('./src/routes/talentRegistration.routes.js');

connectDB();

const app = express();    
// Middlewares
app.use(helmet()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const allowedOrigins = [
  'https://jic.cinfy.co',
  'https://www.jic.cinfy.co',
  'https://uic.ujjainsmartcity.com',
  'https://www.uic.ujjainsmartcity.com',
];

if (process.env.NODE_ENV === 'development') {
  allowedOrigins.push(
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
  );
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));  
}

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/resources', require('./src/routes/resource.routes'));
app.use('/api/riders', require('./src/routes/rider.routes'));
app.use('/api/ingestion', require('./src/routes/ingestion.routes'));
app.use('/api/enablers', require('./src/routes/enabler.routes'));
app.use('/api/industries-under50l', require('./src/routes/industryUnder50L.routes')); 
app.use('/api/industries-50lplus', require('./src/routes/industry50LPlus.routes'));
app.use('/api/institutions', require('./src/routes/institution.routes'));

app.use('/api/cohorts', cohortRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.use('/api/chatbot', require('./src/routes/chatbot.routes.js'));

app.use('/api/digital-business-audits', digitalBusinessAuditRoutes);
app.use('/api/talent', talentRegistrationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  seedAdmin();
});