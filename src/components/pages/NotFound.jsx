import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from './PageLayout';

const NotFound = () => {
  return (
    <PageLayout 
      title="404 - Page Not Found" 
      subtitle="Oops! The page you're looking for doesn't exist."
    >
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2 style={{ fontSize: '72px', margin: '0 0 20px', color: '#667eea' }}>404</h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
          The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/" 
            style={{
              display: 'inline-block',
              background: '#667eea',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#5568d3'}
            onMouseLeave={(e) => e.target.style.background = '#667eea'}
          >
            Go to Homepage
          </Link>
          <Link 
            to="/contact" 
            style={{
              display: 'inline-block',
              background: 'transparent',
              color: '#667eea',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              border: '2px solid #667eea',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#667eea';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#667eea';
            }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;

