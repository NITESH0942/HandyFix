import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// This component handles the OAuth redirect and extracts the token
const OAuthSuccess = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // The AuthContext handles token extraction from URL
    // After a short delay, redirect to home
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <h2 style={styles.text}>Authenticating...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.success}>✓</div>
      <h2 style={styles.text}>
        {user ? `Welcome, ${user.name}!` : 'Authentication successful!'}
      </h2>
      <p style={styles.subtext}>Redirecting to home page...</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  success: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    marginBottom: '20px',
  },
  text: {
    fontSize: '1.5rem',
    margin: '20px 0 10px',
  },
  subtext: {
    opacity: 0.8,
    fontSize: '1rem',
  },
};

export default OAuthSuccess;




