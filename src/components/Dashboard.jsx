import React from 'react';
import { FaCalendarAlt, FaUsers, FaLightbulb, FaVial, FaChartBar, FaBook, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../Styles/Dashboard.css';

const Dashboard = ({ activeSection }) => {
  const features = [
    {
      title: 'Semester Management',
      description: 'Plan your semester, track assignments, and manage deadlines efficiently.',
      icon: <FaCalendarAlt color="#F68712" />,
      section: 'academic'
    },
    {
      title: 'Link Up and Study with Peers',
      description: 'Connect, collaborate, and grow together with your classmates.',
      icon: <FaUsers color="#F68712" />,
      section: 'overview'
    },
    {
      title: 'College Life Tips',
      description: 'Get practical advice and tips for thriving in college life.',
      icon: <FaLightbulb color="#F68712" />,
      section: 'overview',
      images: [
        'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
      ]
    },
    {
      title: 'Career Test',
      description: 'Take a career test and get personalized specialty and course suggestions.',
      icon: <FaVial color="#F68712" />,
      section: 'academic'
    }
  ];

  const filteredFeatures = features.filter(feature => 
    activeSection === 'overview' || feature.section === activeSection
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {filteredFeatures.map((feature, index) => (
          <motion.div
            key={index}
            className="dashboard-card"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="dashboard-card-header">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
            </div>
            <p>{feature.description}</p>
            {feature.images && (
              <div className="feature-images">
                {feature.images.map((img, i) => (
                  <img 
                    key={i} 
                    src={img} 
                    alt="College Life" 
                    className="feature-image"
                  />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 