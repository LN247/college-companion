import React, { useState, useEffect } from "react";
import { Github, Linkedin, Mail, Code, Database, Monitor, Users, Award, Heart } from "lucide-react";
import "../Styles/AboutUs.css";

const teamMembers = [
  {
    name: "Damen Njateng Steve Alane",
    role: "Backend Developer",
    img: "/Simple.jpg",
    description: "Passionate about server-side architecture and API development. Specializes in building scalable backend systems.",
    skills: ["Node.js", "Python", "REST APIs", "Microservices"],
    social: {
      github: "#",
      linkedin: "#",
      email: "steve@example.com"
    }
  },
  {
    name: "Lum Nchifor",
    role: "Frontend Developer",
    img: "/Lum.jpg",
    description: "Creative frontend developer with an eye for design and user experience. Loves bringing designs to life.",
    skills: ["React", "JavaScript", "CSS", "UI/UX"],
    social: {
      github: "#",
      linkedin: "#",
      email: "lum@example.com"
    }
  },
  {
    name: "Njinda Brian Junior",
    role: "Frontend Developer",
    img: "/Brian.jpg",
    description: "Detail-oriented developer focused on creating responsive and accessible web applications.",
    skills: ["Vue.js", "TypeScript", "Tailwind", "Mobile-First"],
    social: {
      github: "#",
      linkedin: "#",
      email: "brian@example.com"
    }
  },
  {
    name: "Otang Desmond Harrisken",
    role: "Backend Developer",
    img: "/Haris.jpg",
    description: "Systems architect with expertise in cloud infrastructure and database optimization.",
    skills: ["Java", "AWS", "Docker", "PostgreSQL"],
    social: {
      github: "#",
      linkedin: "#",
      email: "desmond@example.com"
    }
  },
  {
    name: "TEBO JUNIOR TEBO",
    role: "Database Developer",
    img: "/Tebo.jpg",
    description: "Database specialist focused on data modeling, optimization, and ensuring data integrity.",
    skills: ["SQL", "MongoDB", "Redis", "Data Analytics"],
    social: {
      github: "#",
      linkedin: "#",
      email: "tebo@example.com"
    }
  },
  {
    name: "Ndoh Precious Khan",
    role: "Database Developer",
    img: "/Khan.jpg",
    description: "Data engineer passionate about building efficient database systems and data pipelines.",
    skills: ["MySQL", "Firebase", "GraphQL", "Data Mining"],
    social: {
      github: "#",
      linkedin: "#",
      email: "khan@example.com"
    }
  },
];

const stats = [
  { icon: Users, label: "Team Members", value: "6" },
  { icon: Code, label: "Projects", value: "12+" },
  { icon: Award, label: "Years Experience", value: "2" },
  { icon: Heart, label: "Coffee Cups", value: "∞" }
];

const AboutUs = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getRoleIcon = (role) => {
    if (role.includes("Backend")) return <Code className="role-icon" />;
    if (role.includes("Frontend")) return <Monitor className="role-icon" />;
    if (role.includes("Database")) return <Database className="role-icon" />;
    return <Code className="role-icon" />;
  };

  return (
    <div className={`about-us ${isVisible ? 'visible' : ''}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Meet Our <span className="gradient-text">Amazing Team</span>
            </h1>
            <p className="hero-description">
              We are a team of passionate second-year Software Engineering students from ICT University,
              dedicated to solving real problems through innovative digital solutions.
            </p>
          </div>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <stat.icon className="stat-icon" />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-content">
          <h2 className="section-title">Our Mission</h2>
          <p className="mission-text">
            To bridge the gap between academic learning and real-world application by creating
            innovative digital tools that enhance the university experience. We believe in the
            power of technology to solve everyday problems and make student life more efficient
            and enjoyable.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-content">
          <h2 className="section-title">Meet the Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`team-card ${selectedMember === index ? 'selected' : ''}`}
                onClick={() => setSelectedMember(selectedMember === index ? null : index)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <div className="member-image-container">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="member-image"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=F68712&color=fff&size=200`;
                        }}
                      />
                      <div className="image-overlay">
                        {getRoleIcon(member.role)}
                      </div>
                    </div>
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-role">{member.role}</p>
                    </div>
                  </div>

                  <div className="card-back">
                    <div className="member-details">
                      <p className="member-description">{member.description}</p>
                      <div className="skills">
                        {member.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                      <div className="social-links">
                        <a href={member.social.github} className="social-link">
                          <Github size={18} />
                        </a>
                        <a href={member.social.linkedin} className="social-link">
                          <Linkedin size={18} />
                        </a>
                        <a href={`mailto:${member.social.email}`} className="social-link">
                          <Mail size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Build Something Amazing?</h2>
          <p className="cta-description">
            We're always open to new opportunities and collaborations. Let's create something incredible together!
          </p>
          <button className="cta-button">
            Get In Touch
            <Mail className="button-icon" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;