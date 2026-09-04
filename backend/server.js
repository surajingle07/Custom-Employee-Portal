const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/admin/users', require('./src/routes/userRoutes'));
app.use('/api/admin', require('./src/routes/roleRoutes'));
app.use('/api/admin/audit-logs', require('./src/routes/auditRoutes'));
app.use('/api/zoho', require('./src/routes/zohoRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Custom Employee Portal API Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Resource endpoint not found: ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Global Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
