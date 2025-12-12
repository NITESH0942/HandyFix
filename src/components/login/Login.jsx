import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import OrderHistoryModal from '../modals/OrderHistoryModal';
import OTPModal from '../modals/OTPModal';
import styles from './login.module.css';

export const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'otp'
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [mobileForOTP, setMobileForOTP] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const { user, login, register, logout, loginWithGoogle, loginWithOTP, error, clearError } = useAuth();

  const toggleModal = () => {
    setShowModal(!showModal);
    setFormError('');
    clearError();
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setLoginMethod('email');
    setMobileForOTP('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormError('');
    clearError();
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setLoginMethod('email');
    setMobileForOTP('');
  };

  const handleSendOTP = async () => {
    const mobile = loginMethod === 'otp' ? formData.phone : formData.phone;
    
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSendingOTP(true);
    setFormError('');

    try {
      const response = await authAPI.sendOTP(mobile);
      setMobileForOTP(mobile);
      setShowOTPModal(true);
      setShowModal(false);
      
      // In development mode, if OTP is returned, show it in console and alert
      if (response.otp && process.env.NODE_ENV === 'development') {
        console.log(`📱 OTP for ${mobile}: ${response.otp}`);
        // Optionally show alert in development
        // alert(`Development Mode: OTP is ${response.otp}`);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to send OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleOTPSuccess = (userData, token) => {
    loginWithOTP(userData, token);
    setShowOTPModal(false);
    setMobileForOTP('');
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          setFormError('Please enter both email and password');
          setIsSubmitting(false);
          return;
        }
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setShowModal(false);
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        } else {
          // Login failed - error should be set in AuthContext
          setFormError(result.error || error || 'Login failed. Please check your credentials.');
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setFormError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        if (formData.password.length < 6) {
          setFormError('Password must be at least 6 characters');
          setIsSubmitting(false);
          return;
        }
        if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) {
          setFormError('Please enter a valid 10-digit mobile number');
          setIsSubmitting(false);
          return;
        }
        const result = await register(formData.name, formData.email, formData.password, formData.phone);
        if (result.success) {
          setShowModal(false);
          setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
        } else {
          // Registration failed - error should be set in AuthContext
          setFormError(result.error || error || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login/Register error:', err);
      setFormError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  // If user is logged in, show user info with dropdown
  if (user) {
    return (
      <div className={styles.userContainer}>
        <div 
          className={styles.profileWrapper}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div 
            className={styles.userInfo}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className={styles.userName}>{user.name}</span>
            <svg 
              className={`${styles.dropdownIcon} ${showDropdown ? styles.rotated : ''}`} 
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none"
            >
              <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Dropdown Menu */}
          <div className={`${styles.dropdown} ${showDropdown ? styles.show : ''}`}>
            <button 
              className={styles.dropdownItem}
              onClick={() => {
                // Navigate to profile page or open profile modal
                console.log('My Profile clicked');
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              My Profile
            </button>
            
            <button 
              className={styles.dropdownItem}
              onClick={() => {
                setShowOrderHistory(true);
                setShowDropdown(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Order History
            </button>
            
            <div className={styles.dropdownDivider}></div>
            
            <button 
              className={`${styles.dropdownItem} ${styles.logoutItem}`}
              onClick={logout}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Order History Modal */}
        <OrderHistoryModal
          isOpen={showOrderHistory}
          onClose={() => setShowOrderHistory(false)}
        />
      </div>
    );
  }

  return (
    <div>
      <button onClick={toggleModal} className={styles.btn}>
        Login
      </button>

      {showModal && createPortal(
        <div className={styles.loginoverlay} onClick={toggleModal}>
          <div className={styles.loginmodal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={toggleModal}>
              ×
            </button>
            
            <h2 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className={styles.subtitle}>
              {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
            </p>

            {/* Login Method Tabs (only for login) */}
            {isLogin && (
              <div className={styles.methodTabs}>
                <button
                  type="button"
                  className={`${styles.methodTab} ${loginMethod === 'email' ? styles.active : ''}`}
                  onClick={() => {
                    setLoginMethod('email');
                    setFormError('');
                    setFormData({ ...formData, phone: '' });
                  }}
                >
                  Email/Password
                </button>
                <button
                  type="button"
                  className={`${styles.methodTab} ${loginMethod === 'otp' ? styles.active : ''}`}
                  onClick={() => {
                    setLoginMethod('otp');
                    setFormError('');
                    setFormData({ ...formData, email: '', password: '' });
                  }}
                >
                  Mobile OTP
                </button>
              </div>
            )}

            {/* Google OAuth Button */}
            <button 
              type="button" 
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            {/* Error Messages */}
            {(formError || error) && (
              <div className={styles.errorMsg}>
                {formError || error}
              </div>
            )}

            {loginMethod === 'otp' && isLogin ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }}>
                <div className={styles.inputGroup}>
                  <input
                    type="tel"
                    name="phone"
                    className={styles.logininput}
                    placeholder="10-digit Mobile Number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSendingOTP}
                >
                  {isSendingOTP ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="name"
                      className={styles.logininput}
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    className={styles.logininput}
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="tel"
                    name="phone"
                    className={styles.logininput}
                    placeholder="10-digit Mobile Number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="password"
                    name="password"
                    className={styles.logininput}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                {!isLogin && (
                  <div className={styles.inputGroup}>
                    <input
                      type="password"
                      name="confirmPassword"
                      className={styles.logininput}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </form>
            )}

            <p className={styles.switchText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" className={styles.switchBtn} onClick={switchMode}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>,
        document.body
      )}

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => {
          setShowOTPModal(false);
          setMobileForOTP('');
        }}
        mobile={mobileForOTP}
        isLogin={isLogin}
        onSuccess={handleOTPSuccess}
      />
    </div>
  );
};

export default Login;
