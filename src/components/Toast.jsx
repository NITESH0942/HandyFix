import React, { useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type = 'info', onClose, duration = 2000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.content}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {type === 'warning' ? (
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          ) : (
            <circle cx="12" cy="12" r="10"></circle>
          )}
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;



