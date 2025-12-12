import React, { useState } from 'react';
import PageLayout from './PageLayout';
import styles from './help.module.css';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: 'How do I book a service?',
      answer: 'Booking a service is easy! Simply browse our services, select the one you need, choose a date and time slot, fill in your details, and confirm your booking. You\'ll receive a confirmation with your order ID.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking within 10 minutes of placing the order. After that, cancellations may be subject to terms and conditions. Check your Order History to cancel eligible orders.'
    },
    {
      question: 'How are service providers verified?',
      answer: 'All our service providers undergo a thorough background check, verification of credentials, and training before joining our platform. We ensure they meet our quality standards.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and cash on service completion. Payment options are displayed during checkout.'
    },
    {
      question: 'What if I\'m not satisfied with the service?',
      answer: 'We have a 100% satisfaction guarantee. If you\'re not happy with the service, contact our customer support within 24 hours, and we\'ll make it right or provide a full refund.'
    },
    {
      question: 'How do I track my booking?',
      answer: 'You can track your booking status in the Order History section. You\'ll also receive SMS and email updates about your booking status.'
    },
    {
      question: 'Are your services available on weekends?',
      answer: 'Yes! Most of our services are available 7 days a week, including weekends and holidays. Check available time slots when booking.'
    },
    {
      question: 'Do you provide warranties for services?',
      answer: 'Yes, we provide warranties on most services. The warranty period varies by service type and will be communicated to you at the time of booking.'
    }
  ];

  return (
    <PageLayout 
      title="Help Center" 
      subtitle="Find answers to common questions"
    >
      <div>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                {faq.question}
                <span className={styles.faqIcon}>
                  {openFaq === index ? '−' : '+'}
                </span>
              </button>
              {openFaq === index && (
                <div className={styles.faqAnswer}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <h2>Contact Support</h2>
        <p>
          Can't find what you're looking for? Our support team is here to help!
        </p>
        <ul>
          <li><strong>Email:</strong> support@handyfix.com</li>
          <li><strong>Phone:</strong> +91-XXX-XXX-XXXX (Mon-Sat, 9 AM - 6 PM)</li>
          <li><strong>Live Chat:</strong> Available on our website (24/7)</li>
        </ul>

        <h2>Quick Links</h2>
        <ul>
          <li><a href="/contact">Contact Us</a></li>
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/cancellation-policy">Cancellation Policy</a></li>
        </ul>
      </div>
    </PageLayout>
  );
};

export default Help;

