import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';

// ES module way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  securityHeaders,
  corsConfig,
  apiLimiter,
  authLimiter,
  otpLimiter,
  ssrfProtection,
  xssProtection,
  requestSizeLimit,
  additionalSecurityHeaders,
  requestId,
  securityLogger,
  sriHeaders,
} from './middleware/security.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Configure passport BEFORE routes
configurePassport();

// Verify Google OAuth setup
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('🔍 Checking Google OAuth strategy registration...');
  // Small delay to ensure passport strategies are registered
  setTimeout(() => {
    if (passport._strategies && passport._strategies.google) {
      console.log('✅ Google OAuth strategy is registered and ready');
    } else {
      console.log('❌ WARNING: Google OAuth strategy not found in passport strategies');
      console.log('   Available strategies:', Object.keys(passport._strategies || {}));
    }
  }, 100);
}

// ============================================
// Security Middleware (Order Matters!)
// ============================================

// 1. Request ID for tracking
app.use(requestId);

// 2. Security logging
app.use(securityLogger);

// 3. Security headers (Helmet)
app.use(securityHeaders);

// 4. Additional security headers
app.use(additionalSecurityHeaders);

// 5. SRI headers
app.use(sriHeaders);

// 6. CORS configuration (enhanced)
app.use(cors(corsConfig));

// 7. Body parsing with size limits
app.use(express.json({ limit: requestSizeLimit.json }));
app.use(express.urlencoded({ extended: true, limit: requestSizeLimit.urlencoded }));

// 8. XSS Protection - Input sanitization
app.use(xssProtection);

// 9. SSRF Protection
app.use(ssrfProtection);

// 10. Rate limiting (general API)
app.use('/api', apiLimiter);

// 11. Passport initialization
app.use(passport.initialize());

// ============================================
// Routes with Rate Limiting
// ============================================

// Auth routes with strict rate limiting
app.use('/api/auth', authLimiter, authRoutes);

// Service routes
app.use('/api/services', serviceRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve static files from dist folder (frontend build)
// Check both ../dist (relative to server folder) and ./dist (if copied)
const distPath = path.resolve(__dirname, '../dist');
const localDistPath = path.resolve(__dirname, './dist');

// Try to serve from local dist folder first (copied during build), then parent dist
let staticPath = null;
if (fs.existsSync(localDistPath)) {
  staticPath = localDistPath;
  app.use(express.static(localDistPath));
  console.log(`✅ Serving static files from: ${localDistPath}`);
} else if (fs.existsSync(distPath)) {
  staticPath = distPath;
  app.use(express.static(distPath));
  console.log(`✅ Serving static files from: ${distPath}`);
} else {
  console.log('⚠️  Frontend dist folder not found. Only API routes will work.');
}

// Error handling middleware (must be before catch-all route)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Catch-all handler: send back React's index.html file for client-side routing
// This must be AFTER all API routes but BEFORE the 404 handler
if (staticPath) {
  app.get('*', (req, res, next) => {
    // Skip if it's an API route (already handled above)
    if (req.path.startsWith('/api')) {
      return next();
    }
    // Serve index.html for all non-API routes
    const indexHtml = path.join(staticPath, 'index.html');
    if (fs.existsSync(indexHtml)) {
      res.sendFile(indexHtml);
    } else {
      next();
    }
  });
}

// Handle 404 for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Handle 404 for non-API routes (shouldn't reach here if static files are served)
app.use((req, res) => {
  if (!staticPath) {
    res.status(404).json({ message: 'Route not found. Frontend not built.' });
  } else {
    res.status(404).json({ message: 'Route not found' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});

