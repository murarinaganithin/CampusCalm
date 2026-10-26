const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { initDb } = require('./backend/db');

const authRoutes = require('./backend/routes/auth');
const moodRoutes = require('./backend/routes/moods');
const journalRoutes = require('./backend/routes/journals');
const counselorRoutes = require('./backend/routes/counselors');
const campusRoutes = require('./backend/routes/campus');
const resourceRoutes = require('./backend/routes/resources');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate Limiting for security and brute force prevention
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in a few minutes.' }
});
app.use('/api/', apiLimiter);

// Custom Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Static assets (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/campus', campusRoutes);
app.use('/api/resources', resourceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Saathi Mental Health & Wellness Companion',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for SPA client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🌿 Saathi (साथी) Campus Mental Health Companion`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔒 AES-256 Journal Encryption Active`);
      console.log(`🚨 Crisis Safety Net Active (Tele-MANAS 14416 / KIRAN)`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to initialize application:', err);
    process.exit(1);
  }
}

startServer();
