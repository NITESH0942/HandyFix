import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { authAPI } from '../../services/api';
import styles from './otpModal.module.css';

const OTPModal = ({ isOpen, onClose, mobile, isLogin, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && mobile) {
      // Start countdown when modal opens
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
      setName('');
    }
  }, [isOpen, mobile]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data = await authAPI.verifyOTP(mobile, otpString, name.trim());
      
      if (data.success) {
        // Store token
        localStorage.setItem('token', data.token);
        
        // Call success callback to update auth context
        if (onSuccess) {
          onSuccess(data.user, data.token);
        }
        
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setOtp(['', '', '', '', '', '']);
    setCountdown(60);
    setCanResend(false);

    try {
      await authAPI.resendOTP(mobile);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h2 className={styles.title}>Verify OTP</h2>
        <p className={styles.subtitle}>
          Enter the 6-digit OTP sent to <strong>+91 {mobile}</strong>
        </p>

        {error && <div className={styles.errorMsg}>{error}</div>}

        {!isLogin && (
          <div className={styles.inputGroup}>
            <label>Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your full name"
              className={styles.nameInput}
            />
          </div>
        )}

        <div className={styles.otpContainer}>
          <label>Enter OTP</label>
          <div className={styles.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={styles.otpInput}
                autoFocus={index === 0}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleVerify}
          className={styles.verifyBtn}
          disabled={isSubmitting || otp.join('').length !== 6 || (!isLogin && !name.trim())}
        >
          {isSubmitting ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className={styles.resendContainer}>
          {countdown > 0 ? (
            <p className={styles.countdown}>
              Resend OTP in <span>{countdown}s</span>
            </p>
          ) : (
            <button onClick={handleResend} className={styles.resendBtn}>
              Resend OTP
            </button>
          )}
        </div>

        <p className={styles.helpText}>
          Didn't receive OTP? Check your mobile number or try resending.
        </p>
      </div>
    </div>,
    document.body
  );
};

export default OTPModal;

