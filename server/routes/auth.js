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
import { 
  validationRules, 
  handleValidationErrors,
  otpLimiter 
} from '../middleware/security.js';

const router = express.Router();

// Normal authentication routes with validation
router.post('/register', validationRules.register, handleValidationErrors, register);
router.post('/login', validationRules.login, handleValidationErrors, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Mobile OTP routes with strict rate limiting and validation
router.post('/send-otp', otpLimiter, validationRules.otp, handleValidationErrors, sendOTP);
router.post('/verify-otp', validationRules.otp, handleValidationErrors, verifyOTP);
router.post('/resend-otp', otpLimiter, validationRules.otp, handleValidationErrors, resendOTP);
router.post('/send-existing-otp', otpLimiter, validationRules.otp, handleValidationErrors, sendExistingOTP);

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


