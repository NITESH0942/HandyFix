import React, { useState } from 'react';
import PageLayout from './PageLayout';
import styles from './retailPartnerships.module.css';

const RetailPartnerships = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    partnershipType: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Partnership inquiry:', formData);
    alert('Thank you for your interest! Our partnership team will contact you soon.');
  };

  return (
    <PageLayout 
      title="Retail Partnerships" 
      subtitle="Partner with HandyFix to grow your business"
    >
      <div>
        <h2>Why Partner with HandyFix?</h2>
        <p>
          Join hands with HandyFix to expand your reach and offer value-added services 
          to your customers. We work with retailers, home improvement stores, and 
          businesses to provide seamless home service solutions.
        </p>

        <div className={styles.partnershipTypes}>
          <div className={styles.partnershipCard}>
            <h3>🏪 Retail Partners</h3>
            <p>
              Offer HandyFix services to your customers when they purchase home 
              improvement products. Increase customer satisfaction and revenue.
            </p>
          </div>
          <div className={styles.partnershipCard}>
            <h3>🏢 Corporate Partnerships</h3>
            <p>
              Provide home services as employee benefits or partner with us for 
              corporate maintenance contracts.
            </p>
          </div>
          <div className={styles.partnershipCard}>
            <h3>🤝 Strategic Alliances</h3>
            <p>
              Collaborate on marketing initiatives, cross-promotions, and joint 
              service offerings.
            </p>
          </div>
        </div>

        <h2>Partnership Benefits</h2>
        <ul>
          <li>Access to our network of verified professionals</li>
          <li>White-label service options</li>
          <li>Revenue sharing opportunities</li>
          <li>Marketing support and co-branding</li>
          <li>Dedicated partnership manager</li>
          <li>Custom integration options</li>
        </ul>

        <h2>Get Started</h2>
        <p>
          Interested in partnering with us? Fill out the form below and our partnership 
          team will get in touch with you.
        </p>

        <form onSubmit={handleSubmit} className={styles.partnershipForm}>
          <div className={styles.formGroup}>
            <label>Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Contact Name *</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Partnership Type *</label>
            <select
              name="partnershipType"
              value={formData.partnershipType}
              onChange={handleChange}
              required
            >
              <option value="">Select partnership type</option>
              <option value="retail">Retail Partnership</option>
              <option value="corporate">Corporate Partnership</option>
              <option value="strategic">Strategic Alliance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Submit Partnership Inquiry
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default RetailPartnerships;

