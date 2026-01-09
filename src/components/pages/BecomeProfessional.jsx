import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../navbar/Navabar';
import { Footer } from '../footer/Footer';
import styles from './becomeProfessional.module.css';

const BecomeProfessional = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    serviceType: '',
    experience: ''
  });

  const professionalCards = [
    {
      id: 1,
      title: 'Why Join HandyFix?',
      description: 'Join thousands of professionals earning more with flexible schedules and consistent work opportunities.',
      icon: '💰',
      benefits: ['Competitive rates', 'Flexible scheduling', 'Consistent work', 'Easy management']
    },
    {
      id: 2,
      title: 'Earn More',
      description: 'Set your own rates and work as much or as little as you want. No commission fees, keep what you earn.',
      icon: '💵',
      benefits: ['No commission fees', 'Set your rates', 'Work on your terms', 'Direct payments']
    },
    {
      id: 3,
      title: 'Easy Management',
      description: 'Manage all your bookings, schedule, and earnings through our easy-to-use mobile app and dashboard.',
      icon: '📱',
      benefits: ['Mobile app', 'Real-time updates', 'Calendar sync', 'Earnings tracking']
    },
    {
      id: 4,
      title: 'Support & Training',
      description: 'Get access to training programs, marketing support, and a dedicated team to help you succeed.',
      icon: '🎓',
      benefits: ['Free training', 'Marketing support', '24/7 support', 'Certification programs']
    },
    {
      id: 5,
      title: 'Build Your Reputation',
      description: 'Earn reviews and ratings from satisfied customers. Build your professional profile and grow your business.',
      icon: '⭐',
      benefits: ['Customer reviews', 'Professional profile', 'Verified badge', 'Growth opportunities']
    },
    {
      id: 6,
      title: 'Requirements',
      description: 'To join our network, you need minimum experience, valid credentials, and a commitment to quality service.',
      icon: '✅',
      benefits: ['2+ years experience', 'Valid ID proof', 'Background check', 'Professional references']
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Application submitted:', formData);
    alert('Thank you for your interest! We will contact you soon.');
  };

  return (
    <>
      <Navbar />
      <div className={styles.blogContainer}>
        <div className={styles.blogHeader}>
          <h1 className={styles.blogTitle}>Become a HandyFix Professional</h1>
          <p className={styles.blogSubtitle}>
            Join our network of trusted service providers and grow your business
          </p>
        </div>

        <div className={styles.blogContent}>
          <div className={styles.blogGrid}>
            {professionalCards.map((card) => (
              <article key={card.id} className={styles.blogCard}>
                <div className={styles.cardIcon}>{card.icon}</div>
                <div className={styles.blogCardContent}>
                  <h2 className={styles.blogCardTitle}>{card.title}</h2>
                  <p className={styles.blogExcerpt}>{card.description}</p>
                  <ul className={styles.benefitsList}>
                    {card.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.applicationSection}>
            <h2 className={styles.sectionTitle}>Ready to Get Started?</h2>
            <p className={styles.sectionSubtitle}>
              Fill out the application form below and our team will review your application.
            </p>
            
            <form onSubmit={handleSubmit} className={styles.applicationForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Service Type *</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="painting">Painting</option>
                    <option value="handyman">Handyman</option>
                    <option value="carpenter">Carpenter</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Years of Experience *</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BecomeProfessional;

