import React, { useState } from 'react'
import  Services from '../../data/Services.json';
import styles from './Service.module.css';
import { useAuth } from '../../context/AuthContext';
import ServiceCard from './ServiceCard';
import ServiceDetailModal from '../modals/ServiceDetailModal';
import Toast from '../Toast';

export const Service = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { user } = useAuth();

  const handleServiceClick = (service) => {
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
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div >
        <section className={styles.container}>
            <h1 className={styles.title} id='services'>Services</h1>
            <div className={styles.Services}>
                {
                    Services.map((service,id) => {
                        return(
                            <ServiceCard 
                              key={id} 
                              service={service}
                              onServiceClick={handleServiceClick}
                            />
                        )
                    }
                    )
                }
            </div>
        </section>

        <ServiceDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          service={selectedService}
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
  )
}

export default Service
