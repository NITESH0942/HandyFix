import React from 'react';
import PageLayout from './PageLayout';

const About = () => {
  return (
    <PageLayout 
      title="About HandyFix" 
      subtitle="Your trusted partner for all home service needs"
    >
      <div>
        <h2>Who We Are</h2>
        <p>
          HandyFix is a leading home services platform that connects homeowners with 
          skilled professionals for all their home maintenance and repair needs. Founded 
          with a vision to make home services accessible, reliable, and convenient, we've 
          been serving thousands of satisfied customers across India.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to simplify home maintenance by providing a seamless platform 
          where customers can easily find, book, and manage professional home services. 
          We believe everyone deserves a well-maintained home, and we're here to make 
          that possible.
        </p>

        <h2>What We Offer</h2>
        <ul>
          <li><strong>Professional Services:</strong> From plumbing and electrical work to cleaning and painting</li>
          <li><strong>Verified Professionals:</strong> All our service providers are background-checked and verified</li>
          <li><strong>Easy Booking:</strong> Book services in just a few clicks</li>
          <li><strong>Transparent Pricing:</strong> No hidden charges, clear upfront pricing</li>
          <li><strong>Quality Guarantee:</strong> We stand behind every service we provide</li>
        </ul>

        <h2>Why Choose HandyFix</h2>
        <p>
          With HandyFix, you get more than just a service provider. You get a partner 
          committed to making your life easier. Our platform ensures:
        </p>
        <ul>
          <li>Quick response times</li>
          <li>Professional and courteous service</li>
          <li>Affordable pricing</li>
          <li>100% satisfaction guarantee</li>
          <li>24/7 customer support</li>
        </ul>

        <h2>Our Story</h2>
        <p>
          HandyFix was born out of a simple need: finding reliable home service professionals 
          shouldn't be complicated. We've built a platform that brings together the best 
          professionals in the industry, making it easy for homeowners to maintain their 
          homes without the hassle.
        </p>

        <p>
          Today, we're proud to serve customers across multiple cities in India, and we're 
          continuously expanding our services and reach to serve even more communities.
        </p>
      </div>
    </PageLayout>
  );
};

export default About;

