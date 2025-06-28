import React from "react";
import "../Styles/AboutUs.css";

const teamMembers = [
  {
    name: "Damen Njateng Steve Alane",
    role: "Backend Developer",
    img: "/Simple.jpg",
  },
  {
    name: "Lum Nchifor",
    role: "Frontend Developer",
    img: "/Lum.jpg",
  },
  {
    name: "Njinda Brian Junior",
    role: "Frontend Developer",
    img: "/Brian.jpg",
  },
  {
    name: "Otang Desmond Harrisken",
    role: "Backend Developer",
    img: "/Haris.jpg",
  },
  {
    name: "TEBO JUNIOR TEBO",
    role: "Database Developer",
    img: "/Tebo.jpg",
  },
  {
    name: "Ndoh Precious Khan",
    role: "Database Developer",
    img: "/Khan.jpg",
  },
];

const AboutUs = () => {
  return (
    <div className="about-us">
      <header className="header">
        <h1 className="main-heading">About Us</h1>
      </header>

      <main className="main-content">
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

        {/* Mission statement added below contributors */}
        <p className="team-mission">
          We are a team of passionate second-year Software Engineering students from the ICT University. Our mission is to solve real problems faced by university students by building practical digital tools to help them navigate College life.
        </p>
      </main>
    </div>
  );
};

export default AboutUs; 