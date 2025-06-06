import React from "react";
import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";
import "../Styles/Testimonials.css";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Major",
      university: "MIT",
      image: "photo-1649972904349-6e44c42644a7",
      rating: 5,
      text: "This app completely transformed my college experience. The semester planning feature helped me graduate a semester early while maintaining a 3.9 GPA!",
    },
    {
      name: "Marcus Rodriguez",
      role: "Business Administration",
      university: "Stanford University",
      image: "photo-1519389950473-47ba0277781c",
      rating: 5,
      text: "The community feature connected me with amazing study partners. We're still friends three years after graduation. Absolutely life-changing!",
    },
    {
      name: "Emily Johnson",
      role: "Pre-Med Student",
      university: "Harvard University",
      image: "photo-1488590528505-98d2b5aba04b",
      rating: 5,
      text: "Daily tips kept me motivated during the toughest semesters. The personalized advice felt like having a mentor in my pocket 24/7.",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        {/* Header */}
        <div className="testimonials-header">
          <div className="testimonials-tagline">
            <span>💬 Student Stories</span>
          </div>

          <h2 className="testimonials-title">
            Trusted by Students
            <span className="testimonials-title-highlight">Worldwide</span>
          </h2>

          <p className="testimonials-description">
            See how students from top universities are using our platform to
            achieve academic excellence and build meaningful connections.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card">
              <CardContent className="testimonial-card-content">
                {/* Quote Icon */}
                <div className="testimonial-quote-icon">
                  <Quote />
                </div>

                {/* Rating */}
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="testimonial-text">
                  "{testimonial.text}"
                </blockquote>

                {/* Author Info */}
                <div className="testimonial-author">
                  <img
                    src={`https://images.unsplash.com/${testimonial.image}?w=64&h=64&fit=crop&crop=face`}
                    alt={testimonial.name}
                    className="testimonial-author-image"
                  />
                  <div className="testimonial-author-info">
                    <div className="testimonial-author-name">
                      {testimonial.name}
                    </div>
                    <div className="testimonial-author-role">
                      {testimonial.role}
                    </div>
                    <div className="testimonial-author-university">
                      {testimonial.university}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="testimonials-cta">
          <h3 className="testimonials-cta-title">
            Ready to Join Thousands of Successful Students?
          </h3>
          <p className="testimonials-cta-description">
            Start your journey to academic excellence today. Join our community
            and discover the tools that will transform your college experience.
          </p>

          <div className="testimonials-cta-buttons">
            <button className="cta-button primary">Start Now</button>
            <button className="cta-button secondary">Schedule Demo</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
