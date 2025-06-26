import React from "react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/card";
import {
  Calendar,
  Users,
  Lightbulb,
  BookOpen,
  Target,
  MessageCircle,
  GraduationCap,
} from "lucide-react";
import "../Styles/Features.css";

const Features = () => {
  const mainFeatures = [
    {
      icon: Calendar,
      title: "Semester Planning",
      description:
        "Intelligent course scheduling and academic planning tools to optimize your semester layout and achieve your goals.",
      details: [
        "Smart course scheduling with conflict detection",
        "GPA tracking and grade predictions",
        "Deadline management and reminders",
        "Credit hour optimization",
        "Prerequisites and requirements tracking",
      ],
      // In our CSS we’ll override the colors based on these utility ideas.
      color: "blue",
      borderColor: "blue-border",
      accentColor: "blue-accent",
    },
    {
      icon: Users,
      title: "Community & Networking",
      description:
        "Connect with fellow students, join study groups, and build meaningful relationships that last beyond college.",
      details: [
        "Find study partners by course and major",
        "Join or create study groups",
        "Connect with seniors and mentors",
        "Campus event notifications",
        "Academic discussion forums",
      ],
      color: "green",
      borderColor: "green-border",
      accentColor: "green-accent",
    },
    {
      icon: Lightbulb,
      title: "Daily Tips & Insights",
      description:
        "Personalized daily insights and tips to improve your study habits, productivity, and overall college experience.",
      details: [
        "Daily productivity tips and tricks",
        "Study technique recommendations",
        "Time management strategies",
        "Wellness and mental health tips",
        "Academic success insights",
      ],
      color: "orange",
      borderColor: "orange-border",
      accentColor: "orange-accent",
    },
  ];

  const additionalFeatures = [
    {
      icon: MessageCircle,
      title: "Link Up with Peers",
      description:
        "Connect with students who share your interests, courses, and academic goals for collaborative learning.",
      color: "purple",
    },
    {
      icon: BookOpen,
      title: "Semester Management",
      description:
        "Comprehensive tools to manage your academic workload, assignments, and exam schedules effectively.",
      color: "indigo",
    },
    {
      icon: Target,
      title: "College Life Tips",
      description:
        "Expert advice on navigating campus life, building relationships, and making the most of your college experience.",
      color: "teal",
    },
    {
      icon: GraduationCap,
      title: "Career Test",
      description:
        "Discover your strengths and career paths with our comprehensive assessment tools and guidance.",
      color: "rose",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        {/* Header */}
        <div className="features-header">
          <div className="features-tagline">
            <span>✨ Everything You Need to Succeed</span>
          </div>

          <h2 className="features-title">
            <span>Features That Empower</span>
            <span className="features-subtitle">Your Academic Journey</span>
          </h2>

          <p className="features-description">
            Discover comprehensive tools and features designed specifically for
            college students to excel academically, build lasting connections,
            and thrive in your educational journey.
          </p>
        </div>

        {/* Main Features with Details */}
        <div className="features-main-grid">
          {mainFeatures.map((feature, index) => (
            <Card
              key={index}
              className={`features-card ${feature.borderColor} features-card-hover`}
            >
              <CardContent className="features-card-content">
                <div className={`features-icon-container ${feature.color}`}>
                  <feature.icon className="features-icon" />
                </div>

                <h3 className="features-card-title">{feature.title}</h3>
                <p className="features-card-description">
                  {feature.description}
                </p>

                {/* Feature Details */}
                <div className={`features-card-details ${feature.accentColor}`}>
                  <h4 className="features-details-title">Key Features:</h4>
                  <ul className="features-details-list">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="features-detail-item">
                        <div className="features-detail-bullet"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="features-card-button">
                  Explore Feature
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="features-additional-container">
          <div className="features-additional-header">
            <h3 className="features-additional-title">
              Comprehensive Support System
            </h3>
            <p className="features-additional-description">
              Additional features designed to enhance every aspect of your
              college experience
            </p>
          </div>

          <div className="features-additional-grid">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="features-additional-card">
                <div className={`additional-icon-container ${feature.color}`}>
                  <feature.icon className="additional-icon" />
                </div>
                <h4 className="additional-card-title">{feature.title}</h4>
                <p className="additional-card-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="features-cta">
            <Button className="features-cta-button">Get Started Today</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
