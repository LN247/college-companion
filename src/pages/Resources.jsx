import React, { useState } from "react";
import { Map, Users, GraduationCap } from "lucide-react";
import "../Styles/ResourcePage.css";
import "../Styles/ResourcePage.css";
import { RoadmapCard, Header, Navigation,CollegeResourceCard  } from "../components/RoadmapCard";
import ExpertAdviceCard from "../components/ExpertAdviceCard";

const ResourcesPage = ({
  roadmapsData,
  expertAdviceData,
  collegeResourcesData,
}) => {
  const [activeTab, setActiveTab] = useState("roadmaps");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - would typically come from props/database
  const defaultRoadmaps = roadmapsData || [
    {
      id: 1,
      title: "Computer Science Career Path",
      description:
        "A comprehensive guide from beginner to senior software engineer",
      difficulty: "Beginner to Advanced",
      duration: "12-24 months",
      tags: ["Programming", "CS", "Career"],
      rating: 4.8,
      downloads: 1250,
    },
    {
      id: 2,
      title: "Data Science Roadmap",
      description:
        "Master data science with Python, statistics, and machine learning",
      difficulty: "Intermediate",
      duration: "8-15 months",
      tags: ["Data Science", "Python", "ML"],
      rating: 4.7,
      downloads: 980,
    },
    {
      id: 3,
      title: "Web Development Journey",
      description: "Frontend and backend development from HTML to full-stack",
      difficulty: "Beginner",
      duration: "6-12 months",
      tags: ["Web Dev", "JavaScript", "React"],
      rating: 4.9,
      downloads: 2100,
    },
  ];

  const defaultExpertAdvice = expertAdviceData || [
    {
      id: 1,
      expert: "Dr. Sarah Chen",
      title: "Software Engineering Professor",
      advice: "Building a Strong Foundation in Programming",
      content:
        "Focus on understanding fundamental concepts rather than rushing through languages. Master one language deeply before exploring others.",
      category: "Programming",
      readTime: "5 min",
      featured: true,
    },
    {
      id: 2,
      expert: "Mark Rodriguez",
      title: "Senior Product Manager at Google",
      advice: "Transitioning from College to Tech Industry",
      content:
        "Build real projects, contribute to open source, and network with professionals. Your portfolio speaks louder than your GPA.",
      category: "Career",
      readTime: "7 min",
      featured: false,
    },
  ];

  const defaultCollegeResources = collegeResourcesData || [
    {
      id: 1,
      title: "College Application Checklist",
      type: "Guide",
      description:
        "Step-by-step guide for college applications, deadlines, and requirements",
      category: "Applications",
      useful: 95,
    },
    {
      id: 2,
      title: "Scholarship Finder Tool",
      type: "Tool",
      description:
        "Find scholarships based on your profile, interests, and academic performance",
      category: "Financial Aid",
      useful: 88,
    },
  ];

  const tabs = [
    { id: "roadmaps", label: "Roadmaps", icon: Map },
    { id: "advice", label: "Expert Advice", icon: Users },
    { id: "college", label: "College Resources", icon: GraduationCap },
  ];

  const filteredContent = () => {
    switch (activeTab) {
      case "roadmaps":
        return defaultRoadmaps.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      case "advice":
        return defaultExpertAdvice.filter(
          (item) =>
            item.advice.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "college":
        return defaultCollegeResources.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  return (
    <>
      <div className="resources-container">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />

        <div className="content">
          {activeTab === "roadmaps" && (
            <div>
              <div className="section-header">
                <h2 className="section-title">Learning Roadmaps</h2>
                <p className="section-description">
                  Structured learning paths to achieve your goals
                </p>
              </div>

              <div className="card-grid three-col">
                {filteredContent().map((roadmap) => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "advice" && (
            <div>
              <div className="section-header">
                <h2 className="section-title">Expert Advice</h2>
                <p className="section-description">
                  Insights from industry professionals and educators
                </p>
              </div>

              <div className="card-grid">
                {filteredContent().map((advice) => (
                  <ExpertAdviceCard key={advice.id} advice={advice} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "college" && (
            <div>
              <div className="section-header">
                <h2 className="section-title">College Orientation Resources</h2>
                <p className="section-description">
                  Everything you need for college planning and applications
                </p>
              </div>

              <div className="card-grid">
                {filteredContent().map((resource) => (
                  <CollegeResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResourcesPage;
