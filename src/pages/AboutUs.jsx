import React from "react";
import "../Styles/AboutUs.css";


const teamMembers = [
  {
    name: "Damen Njateng Steve Alane",
    role: "Backend Developer",
    img: "PXL_20230802_123921708.PORTRAIT~2.jpg",
  },
  {
    name: "Lum Nchifor",
    role: "Frontend Developer",
    img: "WhatsApp Image 2025-06-26 at 23.13.09_cb66f4a9.jpg",
  },
  {
    name: "Njinda Brian Junior",
    role: "Frontend Developer",
    img: "WhatsApp Image 2025-06-26 at 23.34.50_910af400.jpg",
  },
  {
    name: "Otang Desmond Harrisken",
    role: "Backend Developer",
    img: "WhatsApp Image 2025-06-26 at 23.13.28_52284a08.jpg",
  },
  {
    name: "TEBO JUNIOR TEBO",
    role: "Database Developer",
    img: "WhatsApp Image 2025-06-26 at 07.58.45_1d82d5af.jpg",
  },
  {
    name: "Ndoh Precious Khan",
    role: "Database Developer",
    img: "WhatsApp Image 2025-06-26 at 23.09.05_fa68db3b.jpg",
  },
];

const AboutUs = () => {
  return (
    <div className="about-us">
      <header className="header">
        <div className="header-content">
          <h1>College Companion</h1>
          <p className="tagline">
            Your all-in-one app for campus life, academic success, and student community
          </p>
        </div>
      </header>

      <main className="main-content">
        <section className="about-section">
          <h2 className="section-title">About The App</h2>
          <p className="app-description">
            College life can be very busy. Students have to attend classes, complete assignments,
            study for exams, and still manage personal goals. Many use different apps for
            planning, reminders, and study tips. This can be confusing and hard to manage.
            College Companion is a simple all-in-one app made for students. It helps them
            stay organized, get daily study tips, manage tasks, find study buddies, and even
            get dressing advice.
          </p>
        </section>

        <section className="team-section">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="contributors">
            {teamMembers.map((member, index) => (
              <div className="contributor-card" key={index} style={{ "--i": index + 1 }}>
                <img src={member.img} alt={member.name} className="contributor-img" />
                <div className="contributor-info">
                  <h3 className="contributor-name">{member.name}</h3>
                  <span className="contributor-role">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 College Companion App. All rights reserved.</p>
          <p>Made with ❤ by students, for students.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
