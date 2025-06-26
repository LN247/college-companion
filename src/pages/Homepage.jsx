import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import Debug from "../components/Debug";

function Homepage() {
  console.log('Homepage rendering');
  
  return (
    <>
      <Debug>
        <Hero />
      </Debug>
      <Features />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Homepage;
