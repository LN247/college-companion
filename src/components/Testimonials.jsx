import React from "react";
import "../Styles/Testimonials.css";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      university: "Stanford University",
      image: "https://i.pravatar.cc/150?img=1",
      quote: "College Companion has transformed how I manage my academic life. The semester planning feature is a game-changer!",
    },
    {
      name: "Michael Chen",
      role: "Business Major",
      university: "NYU",
      image: "https://i.pravatar.cc/150?img=2",
      quote: "The study group feature helped me connect with amazing peers. It's like having a built-in support system!",
    },
    {
      name: "Emily Rodriguez",
      role: "Engineering Student",
      university: "MIT",
      image: "https://i.pravatar.cc/150?img=3",
      quote: "The daily insights and tips have significantly improved my study habits and productivity.",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">
            What Our Students Say
          </h2>
          <p className="testimonials-subtitle">
            Join thousands of students who have transformed their college experience
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="testimonial-image"
                  />
                  <div className="testimonial-info">
                    <h3 className="testimonial-name">{testimonial.name}</h3>
                    <p className="testimonial-role">{testimonial.role}</p>
                    <p className="testimonial-university">{testimonial.university}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
