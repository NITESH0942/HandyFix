import express from 'express';
import passport from 'passport';
import { 
  register, 
  login, 
  getMe, 
  updateProfile,
  googleCallback 
} from '../controllers/authController.js';
import { sendOTP, verifyOTP, resendOTP, sendExistingOTP } from '../controllers/otpController.js';
import { protect } from '../middleware/auth.js';
import { isGoogleOAuthConfigured } from '../config/passport.js';

const router = express.Router();

// Normal authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Mobile OTP routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/send-existing-otp', sendExistingOTP);

// Google OAuth routes
router.get(
  '/google',
  (req, res, next) => {
    // Check if Google OAuth is configured
    if (!isGoogleOAuthConfigured()) {
      console.error('Google OAuth not configured. Available strategies:', Object.keys(passport._strategies || {}));
      return res.status(503).json({ 
        message: 'Google OAuth is not configured. Please contact support.',
        error: 'Google OAuth strategy not available'
      });
    }
    try {
      passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    } catch (error) {
      console.error('Google OAuth authentication error:', error);
      return res.status(500).json({ 
        message: 'Google OAuth authentication failed',
        error: error.message 
      });
    }
  }
);

router.get(
  '/google/callback',
  (req, res, next) => {
    // Check if Google OAuth is configured
    if (!isGoogleOAuthConfigured()) {
      console.error('Google OAuth not configured in callback. Available strategies:', Object.keys(passport._strategies || {}));
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      return res.redirect(`${clientUrl}/login?error=oauth_not_configured`);
    }
    try {
      passport.authenticate('google', { session: false, failureRedirect: '/login' })(req, res, next);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      return res.redirect(`${clientUrl}/login?error=oauth_failed`);
    }
  },
  googleCallback
);

export default router;


