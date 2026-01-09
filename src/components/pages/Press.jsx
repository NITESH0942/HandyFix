import React from 'react';
import PageLayout from './PageLayout';

const Press = () => {
  return (
    <PageLayout 
      title="Press & Media" 
      subtitle="Latest news and press releases about HandyFix"
    >
      <div>
        <h2>Press Releases</h2>
        
        <div style={{ marginBottom: '40px' }}>
          <h3>HandyFix Expands Services to 10 Major Cities</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
            January 15, 2025
          </p>
          <p>
            HandyFix announces expansion to 10 major cities across India, bringing 
            professional home services to more customers nationwide...
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h3>HandyFix Launches New Mobile App</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
            December 20, 2024
          </p>
          <p>
            The new HandyFix mobile app makes booking home services even easier with 
            improved features and a better user experience...
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h3>HandyFix Partners with Leading Home Improvement Brands</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
            November 10, 2024
          </p>
          <p>
            Strategic partnerships with top home improvement brands to provide 
            customers with better service options and exclusive deals...
          </p>
        </div>

        <h2>Media Kit</h2>
        <p>
          For media inquiries, press releases, or interview requests, please contact our 
          media relations team:
        </p>
        <ul>
          <li><strong>Email:</strong> press@handyfix.com</li>
          <li><strong>Phone:</strong> +91-XXX-XXX-XXXX</li>
        </ul>

        <h2>Brand Assets</h2>
        <p>
          Download our logo, brand guidelines, and other media assets for use in 
          publications and articles.
        </p>
      </div>
    </PageLayout>
  );
};

export default Press;

