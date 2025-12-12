import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../util';
import styles from './serviceDetail.module.css';

const timeSlots = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
  '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
];

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  const { user } = useAuth();
  
  // Determine if service needs item list (installation services)
  const isInstallationService = service?.title?.toLowerCase().includes('installation') || 
                                 service?.title?.toLowerCase().includes('tv mounting') ||
                                 service?.title?.toLowerCase().includes('mounting') ||
                                 service?.title?.toLowerCase().includes('handyman') ||
                                 service?.title?.toLowerCase().includes('furniture assembly');
  
  // Determine if service needs beds/baths (cleaning services)
  const needsBedsBaths = service?.title?.toLowerCase().includes('cleaning') ||
                         service?.title?.toLowerCase().includes('home cleaning') ||
                         service?.title?.toLowerCase().includes('moving');

  const [formData, setFormData] = useState({
    postalCode: '',
    beds: '1',
    baths: '1',
    date: '',
    time: '',
    email: user?.email || '',
    selectedItems: [],
  });
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Installation items list
  const installationItems = [
    'TV Mounting',
    'Wall Hanging (Pictures/Mirrors)',
    'Furniture Assembly',
    'Shelf Installation',
    'Curtain Rod Installation',
    'Light Fixture Installation',
    'Ceiling Fan Installation',
    'Smart Home Device Setup',
    'Security Camera Installation',
    'Other Installation'
  ];

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/slots/${date}`);
      const data = await response.json();
      if (data.success) {
        setAvailableSlots(data.availableSlots);
        // Reset time if current selection is not available
        if (formData.time && !data.availableSlots.includes(formData.time)) {
          setFormData({ ...formData, time: '' });
        }
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      setAvailableSlots(timeSlots);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemToggle = (item) => {
    setFormData(prev => {
      const items = prev.selectedItems || [];
      if (items.includes(item)) {
        return { ...prev, selectedItems: items.filter(i => i !== item) };
      } else {
        return { ...prev, selectedItems: [...items, item] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Map service title to service type
    const serviceTypeMap = {
      'Home Cleaning': 'home-cleaning',
      'Plumbing': 'plumbing-repair',
      'Electrical Repairs': 'electrical-repair',
      'Furniture Assembly': 'furniture-assembly',
      'Installation': 'wall-hanging',
      'Installation ': 'wall-hanging', // Handle space in title
      'TV Mounting Elect.': 'tv-mounting',
      'General Handyman': 'wall-hanging',
      'Painting': 'painting',
      'Moving': 'home-cleaning',
    };

    const serviceType = serviceTypeMap[service?.title?.trim()] || 'home-cleaning';

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const bookingData = {
        serviceType,
        name: user?.name || formData.name || 'Customer',
        mobile: user?.phone || formData.mobile || '',
        email: formData.email || user?.email || '',
        postalCode: formData.postalCode,
        date: formData.date,
        timeSlot: formData.time,
      };

      // Add beds/baths for cleaning services
      if (needsBedsBaths) {
        bookingData.beds = formData.beds;
        bookingData.baths = formData.baths;
      }

      // Add selected items for installation services
      if (isInstallationService && formData.selectedItems?.length > 0) {
        bookingData.items = formData.selectedItems;
      }

      const response = await fetch('http://localhost:5000/api/services/book', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Price request submitted! We will contact you soon.' });
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Something went wrong' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      postalCode: '',
      beds: '1',
      baths: '1',
      date: '',
      time: '',
      email: user?.email || '',
      selectedItems: [],
    });
    setMessage({ type: '', text: '' });
  };

  const formatTime = (slot) => {
    const [start] = slot.split('-');
    const hour = parseInt(start.split(':')[0]);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const getRecommendedHours = () => {
    const beds = parseInt(formData.beds) || 1;
    const baths = parseInt(formData.baths) || 1;
    const total = beds + baths;
    if (total <= 2) return 2;
    if (total <= 4) return 3;
    if (total <= 6) return 4;
    return 5;
  };

  if (!isOpen || !service) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        {/* Service Header */}
        <div className={styles.serviceHeader}>
          <h1 className={styles.serviceTitle}>{service.title}</h1>
          <div className={styles.rating}>
            <div className={styles.stars}>
              <span className={styles.star}>★</span>
              <span className={styles.star}>★</span>
              <span className={styles.star}>★</span>
              <span className={styles.star}>★</span>
              <span className={styles.starHalf}>★</span>
            </div>
            <span className={styles.reviews}>30,051 Reviews</span>
          </div>
        </div>

        {/* Booking Form Card */}
        <div className={styles.bookingCard}>
          <form onSubmit={handleSubmit} className={styles.bookingForm}>
            <div className={`${styles.formRow} ${needsBedsBaths ? styles.formRowWithBeds : styles.formRowWithoutBeds}`}>
              <div className={styles.inputGroup}>
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  required
                />
              </div>
              
              {/* Show beds/baths for cleaning services */}
              {needsBedsBaths && (
                <>
                  <div className={styles.inputGroup}>
                    <label>Beds</label>
                    <select
                      name="beds"
                      value={formData.beds}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'bed' : 'beds'}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Baths</label>
                    <select
                      name="baths"
                      value={formData.baths}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'bath' : 'baths'}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              <div className={styles.inputGroup}>
                <label>Date</label>
                <div className={styles.dateInputWrapper}>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={getMinDate()}
                    className={styles.dateInput}
                    required
                  />
                  <span className={styles.calendarIcon}>📅</span>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Time</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={styles.select}
                  required
                  disabled={!formData.date}
                >
                  <option value="">Select time</option>
                  {availableSlots.map(slot => (
                    <option
                      key={slot}
                      value={slot}
                      disabled={!availableSlots.includes(slot)}
                    >
                      {formatTime(slot)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Show item list for installation services */}
            {isInstallationService && (
              <div className={styles.itemsSection}>
                <label className={styles.itemsLabel}>Select Items to Install:</label>
                <div className={styles.itemsGrid}>
                  {installationItems.map((item, index) => (
                    <label key={index} className={styles.itemCheckbox}>
                      <input
                        type="checkbox"
                        checked={formData.selectedItems?.includes(item)}
                        onChange={() => handleItemToggle(item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.emailRow}>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" className={styles.priceBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Get a Price'}
              </button>
            </div>

            {needsBedsBaths && formData.beds && formData.baths && (
              <p className={styles.recommendation}>
                For your home size, we recommend {getRecommendedHours()} hours
              </p>
            )}

            {message.text && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <p className={styles.legalText}>
              By clicking 'Get a Price,' I agree to the{' '}
              <a href="#" className={styles.link}>Handy Terms</a> and{' '}
              <a href="#" className={styles.link}>Privacy Policy</a>. I also agree that Handy or
              its service providers may contact me via email, phone, or text message at the number
              provided above, including by automated means, about my account and any services. I
              understand that consent is not a condition of purchase.
            </p>
          </form>
        </div>

        {/* How It Works Section */}
        <div className={styles.howItWorks}>
          <div className={styles.divider}></div>
          <h2 className={styles.howTitle}>How Handy Works</h2>
          
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#667eea" strokeWidth="2" fill="none"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="#667eea" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="#667eea" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="#667eea" strokeWidth="2"/>
                  <circle cx="8" cy="14" r="1.5" fill="#667eea"/>
                  <circle cx="12" cy="14" r="1.5" fill="#667eea"/>
                  <circle cx="16" cy="14" r="1.5" fill="#667eea"/>
                </svg>
              </div>
              <h3 className={styles.stepTitle}>Set Up a Cleaning Plan</h3>
              <p className={styles.stepDesc}>
                Choose a weekly, biweekly, or monthly cleaning plan. We schedule your recurring
                bookings to make things easy - but don't worry, you can always reschedule if things change.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="#667eea" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="16" r="1.5" fill="#10b981"/>
                  <path d="M9 7h6M9 11h6" stroke="#667eea" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className={styles.stepTitle}>Manage Everything Online</h3>
              <p className={styles.stepDesc}>
                Rescheduling, contacting your professional, and tipping are just a tap away.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#667eea" strokeWidth="2" fill="none"/>
                  <path d="M6 21c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#667eea" strokeWidth="2" fill="none"/>
                  <circle cx="18" cy="6" r="1.5" fill="#fbbf24"/>
                </svg>
              </div>
              <h3 className={styles.stepTitle}>Sit Back and Relax</h3>
              <p className={styles.stepDesc}>
                An experienced, fully-equipped housekeeping professional will be there on time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ServiceDetailModal;


