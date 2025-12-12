import React, { useState } from 'react';
import "@fontsource/roboto";
import styles from './hero.module.css';
import { getImageUrl } from '../../util';
import { useAuth } from '../../context/AuthContext';
import HireProModal from '../modals/HireProModal';
import BookServiceModal from '../modals/BookServiceModal';
import Toast from '../Toast';

export const Hero = () => {
  const [showHireModal, setShowHireModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { user } = useAuth();

  const handleHireClick = () => {
    if (!user) {
      setShowToast(true);
      setTimeout(() => {
        // Scroll to top where navbar with login button is
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Try to find and click login button after scroll
        setTimeout(() => {
          const loginButtons = document.querySelectorAll('button');
          loginButtons.forEach(btn => {
            if (btn.textContent.trim() === 'Login') {
              btn.click();
            }
          });
        }, 800);
      }, 2000);
      return;
    }
    setShowHireModal(true);
  };

  const handleBookClick = () => {
    if (!user) {
      setShowToast(true);
      setTimeout(() => {
        // Scroll to top where navbar with login button is
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Try to find and click login button after scroll
        setTimeout(() => {
          const loginButtons = document.querySelectorAll('button');
          loginButtons.forEach(btn => {
            if (btn.textContent.trim() === 'Login') {
              btn.click();
            }
          });
        }, 800);
      }, 2000);
      return;
    }
    setShowBookModal(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Solve Your Problems With Us Professionals In Their Field
        </h1>
        <p className={styles.description}>
          <b>Message us</b> to find out how our handyMan Make your home the way you want
        </p>
        <div className={styles.buttons}>
          <button 
            className={styles.btn} 
            onClick={handleHireClick}
          >
            Hire A Pro
          </button>
          <button 
            className={styles.btn} 
            onClick={handleBookClick}
          >
            Book A Service
          </button>
        </div>
      </div>
      <img className={styles.heroImg} src={getImageUrl("hero/Hero.png")} alt="" />
      <div className={styles.topBlur}></div>
      <div className={styles.bottomBlur}></div>

      {/* Modals */}
      <HireProModal 
        isOpen={showHireModal} 
        onClose={() => setShowHireModal(false)} 
      />
      <BookServiceModal 
        isOpen={showBookModal} 
        onClose={() => setShowBookModal(false)} 
      />

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message="Please login first to HandyFix"
          type="warning"
          onClose={() => setShowToast(false)}
          duration={2000}
        />
      )}
    </div>
  );
};
