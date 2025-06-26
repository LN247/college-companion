import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../Styles/CareerOrientation.css';
import axios from 'axios';

const CareerOrientation = () => {
  const [language, setLanguage] = useState('english');
  const [showForm, setShowForm] = useState(false);
  const [examResults, setExamResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [aptitudeTest, setAptitudeTest] = useState({
    analytical: 0,
    technical: 0,
    business: 0,
    creative: 0
  });

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');

    const formData = new FormData();
    formData.append('exam_slip', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/exam-slip/process/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setExamResults(response.data.subjects);
        setShowForm(true);
      } else {
        setError('Failed to process exam slip. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred while processing the exam slip.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAptitudeTest = (e) => {
    const { name, value } = e.target;
    setAptitudeTest(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const getRecommendedCourses = () => {
    // This would be replaced with actual logic based on test results and exam subjects
    const courses = {
      english: [
        'SP25-BSC-CSC2222 Introduction to IOT and Embedded Systems',
        'SP25-BSC-SEN3242 Android Application Development',
        'SP25-BSC-CSC2221 Operating Systems',
        'SP25-BSC-SEN3243 Advanced Web Development'
      ],
      french: [
        'FR-SP25-BSC-ICT2223 Programmation Java II',
        'FR-SP25-BSC-ICT2220 Analyse conception et mise en oeuvre orientees objet',
        'FR-SP25-BSC-ICT2235 Systemes de gestion de bases de donnees',
        'FR-SP25-BSC-ICT1101 Reseaux informatiques et securite'
      ]
    };
    return courses[language];
  };

  return (
    <div className="career-orientation">
      <div className="orientation-header">
        <h2>Career Orientation for Freshmen</h2>
        <p>Upload your Advanced Level Examination slip and take our aptitude test to discover your ideal career path</p>
      </div>

      <div className="language-selector">
        <label>Select Language:</label>
        <select value={language} onChange={handleLanguageChange}>
          <option value="english">English</option>
          <option value="french">Français</option>
        </select>
      </div>

      <div className="upload-section">
        <label className="upload-label">
          {isProcessing ? 'Processing...' : 'Upload Exam Slip'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="file-input"
            disabled={isProcessing}
          />
        </label>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {examResults && (
        <div className="exam-results">
          <h3>Detected Subjects</h3>
          <ul>
            {examResults.map((subject, index) => (
              <li key={index}>{subject}</li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <motion.div
          className="aptitude-test"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Aptitude Test</h3>
          <div className="test-questions">
            <div className="question">
              <label>Analytical Skills (1-10):</label>
              <input
                type="range"
                name="analytical"
                min="1"
                max="10"
                value={aptitudeTest.analytical}
                onChange={handleAptitudeTest}
              />
              <span>{aptitudeTest.analytical}</span>
            </div>
            <div className="question">
              <label>Technical Skills (1-10):</label>
              <input
                type="range"
                name="technical"
                min="1"
                max="10"
                value={aptitudeTest.technical}
                onChange={handleAptitudeTest}
              />
              <span>{aptitudeTest.technical}</span>
            </div>
            <div className="question">
              <label>Business Skills (1-10):</label>
              <input
                type="range"
                name="business"
                min="1"
                max="10"
                value={aptitudeTest.business}
                onChange={handleAptitudeTest}
              />
              <span>{aptitudeTest.business}</span>
            </div>
            <div className="question">
              <label>Creative Skills (1-10):</label>
              <input
                type="range"
                name="creative"
                min="1"
                max="10"
                value={aptitudeTest.creative}
                onChange={handleAptitudeTest}
              />
              <span>{aptitudeTest.creative}</span>
            </div>
          </div>

          <div className="recommended-courses">
            <h3>Recommended Courses</h3>
            <ul>
              {getRecommendedCourses().map((course, index) => (
                <li key={index}>{course}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CareerOrientation; 