import React from 'react';
import PageLayout from './PageLayout';

const Cookies = () => {
  return (
    <PageLayout 
      title="Cookie Policy" 
      subtitle="How we use cookies on HandyFix"
    >
      <div>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Last Updated: January 2025
        </p>

        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your device when you visit our 
          website. They help us provide you with a better experience and allow certain 
          features to work properly.
        </p>

        <h2>Types of Cookies We Use</h2>
        
        <h3>Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function properly. They enable 
          core functionality such as security, network management, and accessibility.
        </p>

        <h3>Performance Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our website by 
          collecting and reporting information anonymously. This helps us improve our 
          website's performance.
        </p>

        <h3>Functionality Cookies</h3>
        <p>
          These cookies allow the website to remember choices you make (such as your 
          username, language, or region) and provide enhanced, personalized features.
        </p>

        <h3>Targeting Cookies</h3>
        <p>
          These cookies may be set through our site by advertising partners. They may be 
          used to build a profile of your interests and show you relevant ads on other sites.
        </p>

        <h2>Managing Cookies</h2>
        <p>
          You can control and manage cookies in various ways:
        </p>
        <ul>
          <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
          <li>Cookie preferences: Use our cookie preference center (if available)</li>
          <li>Opt-out tools: Use industry opt-out tools for advertising cookies</li>
        </ul>

        <h2>Third-Party Cookies</h2>
        <p>
          We may use third-party services that set cookies on your device. These include:
        </p>
        <ul>
          <li>Analytics services (Google Analytics)</li>
          <li>Payment processors</li>
          <li>Social media platforms</li>
          <li>Advertising networks</li>
        </ul>

        <h2>Contact</h2>
        <p>
          For questions about our cookie policy, contact us at privacy@handyfix.com
        </p>
      </div>
    </PageLayout>
  );
};

export default Cookies;

