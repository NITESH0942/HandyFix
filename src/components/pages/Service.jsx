import React from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from './PageLayout';

const Service = () => {
  const { serviceName } = useParams();
  
  const serviceMap = {
    'cleaning': { name: 'Home Cleaning', description: 'Professional cleaning services for your home' },
    'plumbing': { name: 'Plumbing Services', description: 'Expert plumbing repairs and installations' },
    'electrical': { name: 'Electrical Services', description: 'Safe and reliable electrical solutions' },
    'handyman': { name: 'Handyman Services', description: 'General home repairs and maintenance' },
    'moving': { name: 'Moving Help', description: 'Assistance with your move' },
    'painting': { name: 'Painting Services', description: 'Interior and exterior painting' },
    'furniture-assembly': { name: 'Furniture Assembly', description: 'Professional furniture assembly' },
    'tv-mounting': { name: 'TV Mounting', description: 'Safe TV mounting and installation' },
    'hanging': { name: 'Wall Hanging', description: 'Picture frames, mirrors, and decor hanging' }
  };

  const service = serviceMap[serviceName] || { 
    name: serviceName.charAt(0).toUpperCase() + serviceName.slice(1), 
    description: 'Professional service' 
  };

  return (
    <PageLayout 
      title={service.name} 
      subtitle={service.description}
    >
      <div>
        <h2>About {service.name}</h2>
        <p>
          Our {service.name.toLowerCase()} professionals are experienced, verified, and 
          committed to providing the highest quality service. We ensure all our service 
          providers are background-checked and trained to meet our standards.
        </p>

        <h2>What's Included</h2>
        <ul>
          <li>Professional and experienced service providers</li>
          <li>Quality materials and tools</li>
          <li>Clean and efficient service</li>
          <li>Satisfaction guarantee</li>
          <li>Follow-up support</li>
        </ul>

        <h2>Pricing</h2>
        <p>
          Our pricing is transparent and competitive. The exact cost depends on the scope 
          of work. Get an instant quote when you book online, or contact us for a custom 
          estimate.
        </p>

        <h2>How It Works</h2>
        <ol>
          <li>Select your service and preferred date/time</li>
          <li>Fill in your details and address</li>
          <li>Confirm your booking</li>
          <li>Our professional arrives on time</li>
          <li>Service is completed to your satisfaction</li>
        </ol>

        <h2>Book Now</h2>
        <p>
          Ready to book {service.name.toLowerCase()}? Click below to get started!
        </p>
        <a 
          href="/" 
          style={{
            display: 'inline-block',
            background: '#667eea',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            marginTop: '20px'
          }}
        >
          Book {service.name}
        </a>
      </div>
    </PageLayout>
  );
};

export default Service;

