import React from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from './PageLayout';

const Location = () => {
  const { city } = useParams();
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  const services = [
    'Home Cleaning',
    'Plumbing Services',
    'Electrical Repairs',
    'Painting Services',
    'Handyman Services',
    'Furniture Assembly',
    'TV Mounting',
    'AC Service & Repair'
  ];

  return (
    <PageLayout 
      title={`HandyFix Services in ${cityName}`} 
      subtitle={`Professional home services available in ${cityName}`}
    >
      <div>
        <h2>Welcome to HandyFix {cityName}</h2>
        <p>
          We're proud to serve customers in {cityName} with professional, reliable home 
          services. Our network of verified professionals is ready to help with all your 
          home maintenance and repair needs.
        </p>

        <h2>Services Available in {cityName}</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          {services.map((service, index) => (
            <div 
              key={index}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>{service}</h3>
              <p style={{ margin: 0, color: '#666' }}>Available now</p>
            </div>
          ))}
        </div>

        <h2>Why Choose HandyFix in {cityName}?</h2>
        <ul>
          <li>Local verified professionals</li>
          <li>Same-day service available</li>
          <li>Transparent pricing</li>
          <li>100% satisfaction guarantee</li>
          <li>24/7 customer support</li>
        </ul>

        <h2>Book a Service</h2>
        <p>
          Ready to book a service in {cityName}? Browse our services and book online 
          in just a few clicks!
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
          Book Now
        </a>
      </div>
    </PageLayout>
  );
};

export default Location;

