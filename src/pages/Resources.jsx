import React from "react";
import { useNavigate } from "react-router-dom";
import "./Resources.css";

const techRoadmaps = [
  { title: "Neso Academy", link: "https://nesoacademy.org" },
  { title: "Khan Academy", link: "https://khanacademy.org" },
  { title: "FreeCodeCamp", link: "https://www.freecodecamp.org" },
  { title: "Coursera - Computer Science", link: "https://www.coursera.org/browse/computer-science" },
  { title: "ICT University Official Website", link: "https://www.ictuniversity.edu.cm" },
];

const businessResources = [
  { title: "Accounting Coach", link: "https://www.accountingcoach.com" },
  { title: "BizEd Business Education", link: "https://bized.aacsb.edu" },
  { title: "Cambridge Business Management", link: "https://www.cambridge.org/gb/education/subjects/business-management" },
  { title: "Harvard Business Review", link: "https://hbr.org" },
  { title: "ICT University Business Faculty", link: "https://www.ictuniversity.edu.cm/business" },
];

const academicLinks = [
  { title: "ICT University Library", link: "https://www.ictuniversity.edu.cm/library" },
  { title: "Academic Roadmaps", link: "https://www.ictuniversity.edu.cm/academics" },
  { title: "Iceland University Official Website", link: "https://english.hi.is" },
  { title: "Iceland University Courses", link: "https://english.hi.is/courses" },
];

const expertAdvice = [
  { title: "Study Tips by Experts", link: "https://www.studytips.com" },
  { title: "Career Guidance", link: "https://www.careerguide.com" },
  { title: "Mind Tools", link: "https://www.mindtools.com" },
  { title: "TED Talks Education", link: "https://www.ted.com/topics/education" },
];

const Resources = () => {
  const navigate = useNavigate();

  return (
    <div className="resources-page">
      <h1 className="page-title">College Companion Resources</h1>

      {/* Go Back Button */}
      <button className="go-back-btn" onClick={() => navigate(-1)}>
        ⬅ Go Back
      </button>

      <div className="resources-container">
        <div className="resource-card tech-card">
          <h2 className="resource-title">Tech & Engineering</h2>
          <ul className="resource-list">
            {techRoadmaps.map((item, i) => (
              <li key={i}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="resource-card academic-card">
          <h2 className="resource-title">Academic Resources</h2>
          <ul className="resource-list">
            {academicLinks.map((item, i) => (
              <li key={i}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="resource-card business-card">
          <h2 className="resource-title">Business & Accounting</h2>
          <ul className="resource-list">
            {businessResources.map((item, i) => (
              <li key={i}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="resource-card expert-card">
          <h2 className="resource-title">Expert Advice</h2>
          <ul className="resource-list">
            {expertAdvice.map((item, i) => (
              <li key={i}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Resources;
