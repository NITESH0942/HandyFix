import React from 'react';
import PageLayout from './PageLayout';

const Terms = () => {
  return (
    <PageLayout 
      title="Terms of Service" 
      subtitle="Terms and conditions for using HandyFix"
    >
      <div>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Last Updated: January 2025
        </p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using HandyFix services, you accept and agree to be bound by 
          these Terms of Service. If you do not agree, please do not use our services.
        </p>

        <h2>Service Description</h2>
        <p>
          HandyFix is a platform that connects customers with professional service providers 
          for home maintenance and repair services. We facilitate bookings but are not 
          directly responsible for the services provided by third-party professionals.
        </p>

        <h2>User Responsibilities</h2>
        <ul>
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account</li>
          <li>Use services only for lawful purposes</li>
          <li>Respect service providers and their work</li>
          <li>Pay for services as agreed</li>
        </ul>

        <h2>Booking and Cancellation</h2>
        <ul>
          <li>Bookings are confirmed upon payment</li>
          <li>Cancellations within 10 minutes of booking are free</li>
          <li>Late cancellations may incur charges</li>
          <li>Refunds are processed according to our cancellation policy</li>
        </ul>

        <h2>Payment Terms</h2>
        <ul>
          <li>Payment is required at the time of booking or service completion</li>
          <li>We accept various payment methods as displayed</li>
          <li>All prices are in INR and inclusive of applicable taxes</li>
          <li>Refunds are processed within 5-7 business days</li>
        </ul>

        <h2>Service Provider Responsibilities</h2>
        <p>
          Service providers are independent contractors and are responsible for:
        </p>
        <ul>
          <li>Providing quality services as described</li>
          <li>Arriving on time for scheduled appointments</li>
          <li>Carrying appropriate insurance and licenses</li>
          <li>Maintaining professional conduct</li>
        </ul>

        <h2>Limitation of Liability</h2>
        <p>
          HandyFix acts as an intermediary platform. We are not liable for:
        </p>
        <ul>
          <li>Quality of services provided by third-party professionals</li>
          <li>Damages resulting from services</li>
          <li>Disputes between customers and service providers</li>
          <li>Indirect or consequential damages</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>
          All content on HandyFix, including logos, text, and graphics, is the property 
          of HandyFix and protected by copyright laws.
        </p>

        <h2>Modifications</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of our 
          services constitutes acceptance of modified terms.
        </p>

        <h2>Contact</h2>
        <p>
          For questions about these terms, contact us at legal@handyfix.com
        </p>
      </div>
    </PageLayout>
  );
};

export default Terms;

