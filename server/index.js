import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';

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

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});

