import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './modals.module.css';

const professionals = [
  { id: 'electrician', name: 'Electrician', icon: '⚡', desc: 'Wiring, fixtures, repairs' },
  { id: 'plumber', name: 'Plumber', icon: '🔧', desc: 'Pipes, leaks, installations' },
  { id: 'painter', name: 'Painter', icon: '🎨', desc: 'Interior & exterior painting' },
  { id: 'carpenter', name: 'Carpenter', icon: '🪚', desc: 'Furniture, woodwork' },
  { id: 'cleaner', name: 'Cleaner', icon: '🧹', desc: 'Deep cleaning, sanitization' },
  { id: 'handyman', name: 'Handyman', icon: '🛠️', desc: 'General repairs & fixes' },
  { id: 'gardener', name: 'Gardener', icon: '🌱', desc: 'Lawn care, landscaping' },
  { id: 'pest-control', name: 'Pest Control', icon: '🐛', desc: 'Pest removal & prevention' },
];

const HireProModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [selectedPro, setSelectedPro] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.phone || '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPro) {
      setMessage({ type: 'error', text: 'Please select a professional type' });
      return;
    }

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
      const response = await fetch(`${API_BASE_URL}/services/hire`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          professionalType: selectedPro,
          name: formData.name || user?.name || '',
          email: formData.email || user?.email || '',
          mobile: formData.mobile || user?.phone || '',
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setTimeout(() => {
          onClose();
          setSelectedPro('');
          setFormData({ name: '', email: '', mobile: '', description: '' });
          setMessage({ type: '', text: '' });
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

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        
        <h2 className={styles.title}>Hire a Professional</h2>
        <p className={styles.subtitle}>Select the type of professional you need</p>

        {/* Professional Selection Grid */}
        <div className={styles.proGrid}>
          {professionals.map((pro) => (
            <div
              key={pro.id}
              className={`${styles.proCard} ${selectedPro === pro.id ? styles.selected : ''}`}
              onClick={() => setSelectedPro(pro.id)}
            >
              <span className={styles.proIcon}>{pro.icon}</span>
              <span className={styles.proName}>{pro.name}</span>
              <span className={styles.proDesc}>{pro.desc}</span>
            </div>
          ))}
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
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
                placeholder="Enter mobile number"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Describe Your Requirement (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us more about what you need..."
              rows={3}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default HireProModal;


