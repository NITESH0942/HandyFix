import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './modals.module.css';

const services = [
  { id: 'wall-hanging', name: 'Wall Hanging', icon: '🖼️', price: '₹299' },
  { id: 'fan-repair', name: 'Fan Repair', icon: '🌀', price: '₹199' },
  { id: 'sink-repair', name: 'Sink Repair', icon: '🚰', price: '₹349' },
  { id: 'furniture-assembly', name: 'Furniture Assembly', icon: '🪑', price: '₹499' },
  { id: 'tv-mounting', name: 'TV Mounting', icon: '📺', price: '₹399' },
  { id: 'electrical-repair', name: 'Electrical Repair', icon: '💡', price: '₹249' },
  { id: 'plumbing-repair', name: 'Plumbing Repair', icon: '🔧', price: '₹299' },
  { id: 'home-cleaning', name: 'Home Cleaning', icon: '🧽', price: '₹599' },
  { id: 'painting', name: 'Painting', icon: '🎨', price: '₹999' },
  { id: 'appliance-repair', name: 'Appliance Repair', icon: '🔌', price: '₹349' },
  { id: 'ac-service', name: 'AC Service', icon: '❄️', price: '₹449' },
  { id: 'pest-control', name: 'Pest Control', icon: '🐛', price: '₹799' },
];

const timeSlots = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
  '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
];

const BookServiceModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.phone || '',
    email: user?.email || '',
    postalCode: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/services/slots/${date}`);
      const data = await response.json();
      if (data.success) {
        setAvailableSlots(data.availableSlots);
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      setAvailableSlots(timeSlots);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleNext = () => {
    if (step === 2 && selectedDate && selectedSlot) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/services/book`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          serviceType: selectedService,
          date: selectedDate,
          timeSlot: selectedSlot,
          name: formData.name || user?.name || '',
          mobile: formData.mobile || user?.phone || '',
          email: formData.email || user?.email || '',
          postalCode: formData.postalCode,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setTimeout(() => {
          resetModal();
        }, 2500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Something went wrong' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to book service. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedService('');
    setSelectedDate('');
    setSelectedSlot('');
    setFormData({ name: '', mobile: '', email: '', postalCode: '', address: '' });
    setMessage({ type: '', text: '' });
    onClose();
  };

  const formatTime = (slot) => {
    const [start, end] = slot.split('-');
    const formatHour = (time) => {
      const hour = parseInt(time.split(':')[0]);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      return `${displayHour}:00 ${ampm}`;
    };
    return `${formatHour(start)} - ${formatHour(end)}`;
  };

  if (!isOpen) return null;

  const selectedServiceData = services.find(s => s.id === selectedService);

  return createPortal(
    <div className={styles.overlay} onClick={resetModal}>
      <div className={`${styles.modal} ${styles.bookingModal}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={resetModal}>×</button>

        {/* Progress Steps */}
        <div className={styles.progressBar}>
          <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
            <span>1</span>
            <p>Service</p>
          </div>
          <div className={styles.progressLine}></div>
          <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
            <span>2</span>
            <p>Schedule</p>
          </div>
          <div className={styles.progressLine}></div>
          <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''}`}>
            <span>3</span>
            <p>Details</p>
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <>
            <h2 className={styles.title}>Book a Service</h2>
            <p className={styles.subtitle}>Select the service you need</p>
            <div className={styles.serviceGrid}>
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`${styles.serviceCard} ${selectedService === service.id ? styles.selected : ''}`}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <span className={styles.serviceIcon}>{service.icon}</span>
                  <span className={styles.serviceName}>{service.name}</span>
                  <span className={styles.servicePrice}>from {service.price}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && (
          <>
            <h2 className={styles.title}>Select Date & Time</h2>
            <p className={styles.subtitle}>
              Choose when you'd like the {selectedServiceData?.name} service
            </p>

            <div className={styles.dateTimeContainer}>
              <div className={styles.inputGroup}>
                <label>Select Date *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot('');
                  }}
                  min={getMinDate()}
                  className={styles.dateInput}
                />
              </div>

              {selectedDate && (
                <div className={styles.slotsContainer}>
                  <label>Select Time Slot (1 Hour) *</label>
                  <div className={styles.slotsGrid}>
                    {timeSlots.map((slot) => {
                      const isAvailable = availableSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`${styles.slotBtn} ${selectedSlot === slot ? styles.selected : ''} ${!isAvailable ? styles.disabled : ''}`}
                          onClick={() => isAvailable && setSelectedSlot(slot)}
                          disabled={!isAvailable}
                        >
                          {formatTime(slot)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.btnGroup}>
              <button type="button" className={styles.backBtn} onClick={handleBack}>
                ← Back
              </button>
              <button 
                type="button" 
                className={styles.submitBtn}
                onClick={handleNext}
                disabled={!selectedDate || !selectedSlot}
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <>
            <h2 className={styles.title}>Your Details</h2>
            <p className={styles.subtitle}>Please provide your contact information</p>

            {/* Booking Summary */}
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span>Service:</span>
                <strong>{selectedServiceData?.icon} {selectedServiceData?.name}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Date:</span>
                <strong>{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Time:</span>
                <strong>{formatTime(selectedSlot)}</strong>
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="6-digit PIN"
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Address (Optional)</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House/Flat no., Street, Landmark..."
                  rows={2}
                />
              </div>

              <div className={styles.btnGroup}>
                <button type="button" className={styles.backBtn} onClick={handleBack}>
                  ← Back
                </button>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default BookServiceModal;


