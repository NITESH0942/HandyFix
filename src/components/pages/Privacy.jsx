import React from 'react';
import PageLayout from './PageLayout';

const Privacy = () => {
  return (
    <PageLayout 
      title="Privacy Policy" 
      subtitle="How we protect and use your information"
    >
      <div>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Last Updated: January 2025
        </p>

        <h2>Introduction</h2>
        <p>
          At HandyFix, we are committed to protecting your privacy. This Privacy Policy 
          explains how we collect, use, disclose, and safeguard your information when you 
          use our services.
        </p>

        <h2>Information We Collect</h2>
        <h3>Personal Information</h3>
        <ul>
          <li>Name, email address, phone number</li>
          <li>Billing and shipping addresses</li>
          <li>Payment information (processed securely through third-party providers)</li>
          <li>Service preferences and booking history</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <ul>
          <li>Device information (IP address, browser type, operating system)</li>
          <li>Usage data (pages visited, time spent, clicks)</li>
          <li>Location data (with your permission)</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain our services</li>
          <li>To process bookings and payments</li>
          <li>To communicate with you about your bookings</li>
          <li>To send promotional materials (with your consent)</li>
          <li>To improve our services and user experience</li>
          <li>To detect and prevent fraud</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>
          We do not sell your personal information. We may share your information with:
        </p>
        <ul>
          <li><strong>Service Providers:</strong> To facilitate service delivery</li>
          <li><strong>Payment Processors:</strong> To process payments securely</li>
          <li><strong>Legal Requirements:</strong> When required by law</li>
          <li><strong>Business Transfers:</strong> In case of merger or acquisition</li>
        </ul>

        <h2 id="dont-sell">Don't Sell or Share My Personal Information</h2>
        <p>
          We respect your privacy rights. We do not sell your personal information to 
          third parties. If you wish to opt-out of any data sharing, please contact us 
          at privacy@handyfix.com.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your information, including 
          encryption, secure servers, and access controls. However, no method of transmission 
          over the internet is 100% secure.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Data portability</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use cookies to enhance your experience. See our <a href="/cookies">Cookie Policy</a> 
          for more information.
        </p>

        <h2>Contact Us</h2>
        <p>
          For privacy-related inquiries, contact us at:
        </p>
        <ul>
          <li><strong>Email:</strong> privacy@handyfix.com</li>
          <li><strong>Phone:</strong> +91-XXX-XXX-XXXX</li>
        </ul>
      </div>
    </PageLayout>
  );
};

export default Privacy;

