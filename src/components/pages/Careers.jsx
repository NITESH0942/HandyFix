import React from 'react';
import PageLayout from './PageLayout';

const Careers = () => {
  const jobOpenings = [
    {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Hyderabad, Remote',
      type: 'Full-time'
    },
    {
      title: 'Customer Success Manager',
      department: 'Operations',
      location: 'Mumbai',
      type: 'Full-time'
    },
    {
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Bangalore',
      type: 'Full-time'
    },
    {
      title: 'Business Development Executive',
      department: 'Sales',
      location: 'Delhi',
      type: 'Full-time'
    }
  ];

  return (
    <PageLayout 
      title="Careers at HandyFix" 
      subtitle="Join us in revolutionizing home services"
    >
      <div>
        <h2>Why Work at HandyFix?</h2>
        <p>
          At HandyFix, we're building the future of home services. We're looking for 
          passionate individuals who want to make a difference in people's lives by 
          making home maintenance simple and accessible.
        </p>

        <h3>What We Offer</h3>
        <ul>
          <li>Competitive salary and benefits</li>
          <li>Flexible work arrangements</li>
          <li>Opportunities for growth and learning</li>
          <li>Dynamic and collaborative work environment</li>
          <li>Health insurance and wellness programs</li>
          <li>Stock options for eligible employees</li>
        </ul>

        <h2>Open Positions</h2>
        <div style={{ marginTop: '30px' }}>
          {jobOpenings.map((job, index) => (
            <div 
              key={index}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>{job.title}</h3>
              <p style={{ margin: '5px 0', color: '#666' }}>
                <strong>Department:</strong> {job.department} | 
                <strong> Location:</strong> {job.location} | 
                <strong> Type:</strong> {job.type}
              </p>
              <button 
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <h2>How to Apply</h2>
        <p>
          Interested in joining our team? Send your resume and cover letter to:
        </p>
        <ul>
          <li><strong>Email:</strong> careers@handyfix.com</li>
          <li><strong>Subject:</strong> [Position Name] - Application</li>
        </ul>

        <p>
          We review all applications and will contact qualified candidates for 
          interviews. We're an equal opportunity employer and welcome diversity.
        </p>
      </div>
    </PageLayout>
  );
};

export default Careers;

