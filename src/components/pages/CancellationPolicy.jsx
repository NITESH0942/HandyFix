import React from 'react';
import PageLayout from './PageLayout';

const CancellationPolicy = () => {
  return (
    <PageLayout 
      title="Cancellation Policy" 
      subtitle="Our policy on order cancellations and refunds"
    >
      <div>
        <h2>Free Cancellation Period</h2>
        <p>
          You can cancel your order free of charge within <strong>10 minutes</strong> of 
          placing the booking. After this period, cancellation policies apply as described below.
        </p>

        <h2>Cancellation Timeframes</h2>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Within 10 Minutes</h3>
          <p><strong>Full Refund:</strong> 100% refund, no questions asked</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>More than 24 Hours Before Service</h3>
          <p><strong>Partial Refund:</strong> 80% refund, 20% processing fee</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>12-24 Hours Before Service</h3>
          <p><strong>Partial Refund:</strong> 50% refund</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Less than 12 Hours Before Service</h3>
          <p><strong>No Refund:</strong> Cancellation not allowed, rescheduling may be available</p>
        </div>

        <h2>How to Cancel</h2>
        <ol>
          <li>Go to your Order History</li>
          <li>Find the order you want to cancel</li>
          <li>Click the "Cancel Order" button (if available)</li>
          <li>Confirm the cancellation</li>
        </ol>

        <h2>Refund Processing</h2>
        <ul>
          <li>Refunds are processed within 5-7 business days</li>
          <li>Refunds are issued to the original payment method</li>
          <li>You will receive an email confirmation when refund is processed</li>
        </ul>

        <h2>Service Provider Cancellations</h2>
        <p>
          If a service provider cancels your booking:
        </p>
        <ul>
          <li>You will receive a full refund</li>
          <li>We will help you find an alternative provider</li>
          <li>You may receive compensation credits</li>
        </ul>

        <h2>Emergency Cancellations</h2>
        <p>
          For emergency situations, please contact our support team immediately. We will 
          review each case individually and may provide exceptions to our standard policy.
        </p>

        <h2>Contact</h2>
        <p>
          For cancellation assistance, contact us at:
        </p>
        <ul>
          <li><strong>Email:</strong> support@handyfix.com</li>
          <li><strong>Phone:</strong> +91-XXX-XXX-XXXX</li>
        </ul>
      </div>
    </PageLayout>
  );
};

export default CancellationPolicy;

