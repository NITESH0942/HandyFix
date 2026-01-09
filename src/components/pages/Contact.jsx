import React, { useState } from 'react';
import PageLayout from './PageLayout';
import styles from './contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <PageLayout 
      title="Contact Us" 
      subtitle="We'd love to hear from you"
    >
      <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          <h2>Get in Touch</h2>
          <p>
            Have a question or need assistance? We're here to help! Reach out to us 
            through any of the following channels.
          </p>

          <div className={styles.infoCard}>
            <h3>📧 Email</h3>
            <p>support@handyfix.com</p>
            <p>info@handyfix.com</p>
          </div>

          <div className={styles.infoCard}>
            <h3>📞 Phone</h3>
            <p>Customer Support: +91-XXX-XXX-XXXX</p>
            <p>Business Hours: Mon-Sat, 9 AM - 6 PM IST</p>
          </div>

          <div className={styles.infoCard}>
            <h3>📍 Office Address</h3>
            <p>
              HandyFix Services Pvt. Ltd.<br />
              123 Business Park,<br />
              Hyderabad, Telangana - 500001<br />
              India
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3>💬 Social Media</h3>
            <p>Follow us on Facebook, Twitter, Instagram, and LinkedIn</p>
          </div>
        </div>

        <div className={styles.contactForm}>
          <h2>Send us a Message</h2>
          {submitted ? (
            <div className={styles.successMessage}>
              ✓ Thank you! Your message has been sent. We'll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

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
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;

