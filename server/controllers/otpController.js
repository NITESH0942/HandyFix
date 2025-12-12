import OTP from '../models/OTP.js';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { sendOTPViaWhatsApp, sendOTPViaSMS } from '../services/vonageService.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP to mobile number
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Please provide a mobile number' });
    }

    // Validate mobile number format (10 digits)
    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit mobile number' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTPs for this mobile
    try {
      await OTP.deleteMany({ mobile });
      console.log(`Deleted existing OTPs for ${mobile}`);
    } catch (deleteError) {
      console.error('Error deleting existing OTPs:', deleteError);
    }

    // Save new OTP to MongoDB
    let otpRecord;
    try {
      otpRecord = await OTP.create({
        mobile,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });
      console.log(`✅ OTP saved to MongoDB: ${otpRecord._id} for mobile ${mobile}`);
    } catch (saveError) {
      console.error('❌ Error saving OTP to MongoDB:', saveError);
      return res.status(500).json({ 
        message: 'Failed to save OTP to database',
        error: process.env.NODE_ENV === 'development' ? saveError.message : undefined
      });
    }

    // Retrieve OTP from MongoDB (to ensure we're using the saved one)
    let savedOTPRecord;
    try {
      savedOTPRecord = await OTP.findById(otpRecord._id);
      if (!savedOTPRecord) {
        console.error(`❌ OTP not found in MongoDB after save: ${otpRecord._id}`);
        return res.status(500).json({ message: 'Failed to retrieve saved OTP' });
      }
      console.log(`✅ OTP retrieved from MongoDB: ${savedOTPRecord.otp}`);
    } catch (retrieveError) {
      console.error('❌ Error retrieving OTP from MongoDB:', retrieveError);
      return res.status(500).json({ 
        message: 'Failed to retrieve OTP from database',
        error: process.env.NODE_ENV === 'development' ? retrieveError.message : undefined
      });
    }

    // Check if Vonage credentials are configured
    const hasVonageCredentials = process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET;
    
    if (!hasVonageCredentials) {
      // In development, log OTP to console for testing
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n========================================`);
        console.log(`📱 OTP for ${mobile}: ${savedOTPRecord.otp}`);
        console.log(`⏰ Valid for 10 minutes`);
        console.log(`========================================\n`);
      } else {
        return res.status(500).json({ 
          message: 'OTP service not configured. Please contact support.',
        });
      }
    } else {
      // Send OTP via WhatsApp using Vonage
      try {
        await sendOTPViaWhatsApp(mobile, savedOTPRecord.otp);
        console.log(`OTP sent via WhatsApp to ${mobile}`);
      } catch (whatsappError) {
        console.error('WhatsApp sending failed, trying SMS fallback:', whatsappError);
        
        // Fallback to SMS if WhatsApp fails
        try {
          await sendOTPViaSMS(mobile, savedOTPRecord.otp);
          console.log(`OTP sent via SMS to ${mobile}`);
        } catch (smsError) {
          console.error('SMS sending also failed:', smsError);
          // In development, still log the OTP
          if (process.env.NODE_ENV === 'development') {
            console.log(`\n========================================`);
            console.log(`📱 OTP for ${mobile}: ${savedOTPRecord.otp}`);
            console.log(`⏰ Valid for 10 minutes`);
            console.log(`========================================\n`);
          } else {
            return res.status(500).json({ 
              message: 'Failed to send OTP. Please try again.',
              error: smsError.message
            });
          }
        }
      }
    }

    res.json({
      success: true,
      message: hasVonageCredentials 
        ? 'OTP sent successfully to your mobile number via WhatsApp' 
        : 'OTP generated successfully. Check server console for OTP (development mode)',
      // In development, return OTP in response for testing
      otp: process.env.NODE_ENV === 'development' ? savedOTPRecord.otp : undefined,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify OTP and login/register
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp, name } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Please provide mobile number and OTP' });
    }

    // Find the OTP
    const otpRecord = await OTP.findOne({
      mobile,
      verified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Check if user exists
    let user = await User.findOne({ phone: mobile });

    if (!user) {
      // Register new user
      if (!name) {
        return res.status(400).json({ message: 'Please provide your name for registration' });
      }

      // Generate a random email if not provided (for users who only use mobile)
      const tempEmail = `${mobile}@handyfix.mobile`;

      user = await User.create({
        name,
        email: tempEmail,
        phone: mobile,
        isVerified: true,
      });
    }

    // Generate token and return user
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    
    // Handle duplicate phone number error
    if (error.code === 11000 && error.keyPattern?.phone) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Please provide a mobile number' });
    }

    // Delete existing OTPs
    await OTP.deleteMany({ mobile });

    // Generate and send new OTP
    return sendOTP(req, res);
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Retrieve and send existing OTP from MongoDB
// @route   POST /api/auth/send-existing-otp
// @access  Public
export const sendExistingOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Please provide a mobile number' });
    }

    // Retrieve existing OTP from MongoDB
    const otpRecord = await OTP.findOne({
      mobile,
      verified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(404).json({ message: 'No valid OTP found for this mobile number' });
    }

    // Check if Vonage credentials are configured
    const hasVonageCredentials = process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET;
    
    if (!hasVonageCredentials) {
      // In development, log OTP to console for testing
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n========================================`);
        console.log(`📱 Existing OTP for ${mobile}: ${otpRecord.otp}`);
        console.log(`⏰ Valid until ${otpRecord.expiresAt}`);
        console.log(`========================================\n`);
      } else {
        return res.status(500).json({ 
          message: 'OTP service not configured. Please contact support.',
        });
      }
    } else {
      // Send existing OTP via WhatsApp using Vonage
      try {
        await sendOTPViaWhatsApp(mobile, otpRecord.otp);
        console.log(`Existing OTP sent via WhatsApp to ${mobile}`);
      } catch (whatsappError) {
        console.error('WhatsApp sending failed, trying SMS fallback:', whatsappError);
        
        // Fallback to SMS if WhatsApp fails
        try {
          await sendOTPViaSMS(mobile, otpRecord.otp);
          console.log(`Existing OTP sent via SMS to ${mobile}`);
        } catch (smsError) {
          console.error('SMS sending also failed:', smsError);
          // In development, still log the OTP
          if (process.env.NODE_ENV === 'development') {
            console.log(`\n========================================`);
            console.log(`📱 Existing OTP for ${mobile}: ${otpRecord.otp}`);
            console.log(`⏰ Valid until ${otpRecord.expiresAt}`);
            console.log(`========================================\n`);
          } else {
            return res.status(500).json({ 
              message: 'Failed to send OTP. Please try again.',
              error: smsError.message
            });
            }
        }
      }
    }

    res.json({
      success: true,
      message: hasVonageCredentials 
        ? 'Existing OTP sent successfully to your mobile number via WhatsApp' 
        : 'OTP retrieved successfully. Check server console for OTP (development mode)',
      // In development, return OTP in response for testing
      otp: process.env.NODE_ENV === 'development' ? otpRecord.otp : undefined,
    });
  } catch (error) {
    console.error('Send existing OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


