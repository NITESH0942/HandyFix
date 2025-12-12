import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const configurePassport = () => {
  // Only configure Google OAuth if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    // Build absolute callback URL
    const PORT = process.env.PORT || 5000;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL || 
                       `http://localhost:${PORT}/api/auth/google/callback`;
    
    console.log('Configuring Google OAuth with callback URL:', callbackURL);
    
    passport.use(
      'google',
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
              return done(null, user);
            }

            // Check if email already exists
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              // Link Google account to existing user
              user.googleId = profile.id;
              user.avatar = profile.photos[0]?.value || user.avatar;
              await user.save();
              return done(null, user);
            }

            // Create new user
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              avatar: profile.photos[0]?.value,
              isVerified: true,
            });

            done(null, user);
          } catch (error) {
            console.error('Google OAuth user creation error:', error);
            done(error, null);
          }
        }
      )
    );
    console.log('✅ Google OAuth strategy configured successfully');
    console.log('   Client ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...');
  } else {
    console.log('⚠️  Google OAuth credentials not provided - skipping Google OAuth setup');
    console.log('   GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
    console.log('   GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing');
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

// Export a function to verify Google OAuth is configured
export const isGoogleOAuthConfigured = () => {
  return !!(process.env.GOOGLE_CLIENT_ID && 
            process.env.GOOGLE_CLIENT_SECRET && 
            passport._strategies?.google);
};

export default configurePassport;




