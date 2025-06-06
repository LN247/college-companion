import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaBook, FaVideo, FaComments } from 'react-icons/fa';
import '../Styles/HelpCenter.css';

const HelpCenter = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const faqs = [
    {
      question: "How do I add a new course to my semester plan?",
      answer: "Go to the Semester Plan page and click on 'Add New Event'. Select 'Course' as the event type and fill in the required details."
    },
    {
      question: "How can I track my progress?",
      answer: "The Progress page shows your overall semester progress, course-specific progress, and goal completion status. You can update your progress by marking assignments as complete."
    },
    {
      question: "How do I enable notifications?",
      answer: "Go to Settings > Notification Preferences and toggle the notification options you want to enable."
    },
    {
      question: "Can I customize my dashboard?",
      answer: "Yes! You can customize your dashboard by clicking the settings icon and selecting which widgets you want to display."
    }
  ];

  const guides = [
    {
      title: "Getting Started",
      content: "Learn how to set up your account and navigate the platform.",
      icon: <FaBook className="text-blue-500" />
    },
    {
      title: "Video Tutorials",
      content: "Watch step-by-step video guides for all features.",
      icon: <FaVideo className="text-green-500" />
    },
    {
      title: "Contact Support",
      content: "Need help? Reach out to our support team.",
      icon: <FaComments className="text-purple-500" />
    }
  ];

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="help-center">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Help Center</h2>

        {/* Quick Guides */}
        <div className="guides-section mb-8">
          <h3 className="text-xl font-semibold mb-4">Quick Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-4">
                  {guide.icon}
                  <h4 className="text-lg font-medium">{guide.title}</h4>
                </div>
                <p className="text-gray-600">{guide.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="faq-section">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  className="w-full p-4 flex items-center justify-between"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center space-x-3">
                    <FaQuestionCircle className="text-blue-500" />
                    <span className="font-medium">{faq.question}</span>
                  </div>
                  {expandedSection === index ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                {expandedSection === index && (
                  <div className="p-4 border-t">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="contact-support mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Still Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to help you with any questions or issues you may have.
            </p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 