import React from 'react';
import PageLayout from './PageLayout';

const CAPreCollection = () => {
  return (
    <PageLayout 
      title="California Pre-Collection Notice" 
      subtitle="Important information for California residents"
    >
      <div>
        <h2>California Pre-Collection Notice</h2>
        <p>
          This notice is provided to California residents in accordance with California 
          state law regarding debt collection practices.
        </p>

        <h2>Your Rights</h2>
        <p>
          As a California resident, you have certain rights regarding debt collection:
        </p>
        <ul>
          <li>You have the right to request verification of any debt</li>
          <li>You have the right to dispute any debt</li>
          <li>You have the right to request information about the original creditor</li>
          <li>You have the right to be free from harassment by debt collectors</li>
        </ul>

        <h2>Contact Information</h2>
        <p>
          If you have questions about a debt or wish to exercise your rights, please contact:
        </p>
        <ul>
          <li><strong>Email:</strong> collections@handyfix.com</li>
          <li><strong>Phone:</strong> +91-XXX-XXX-XXXX</li>
          <li><strong>Address:</strong> HandyFix Services, 123 Business Park, Hyderabad, India</li>
        </ul>

        <h2>Dispute Process</h2>
        <p>
          If you believe there is an error in your account or wish to dispute a charge, 
          please contact us within 30 days of receiving notice. We will investigate and 
          respond to your dispute in writing.
        </p>

        <h2>Additional Information</h2>
        <p>
          For more information about your rights under California law, visit the California 
          Department of Consumer Affairs website.
        </p>
      </div>
    </PageLayout>
  );
};

export default CAPreCollection;

