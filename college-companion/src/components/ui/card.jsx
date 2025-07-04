import React from "react";
import "../ui/Button.css";

const Card = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div ref={ref} className={`card ${className}`} {...props} />;
});
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div ref={ref} className={`card-header ${className}`} {...props} />;
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className = "", ...props }, ref) => {
  return <h3 ref={ref} className={`card-title ${className}`} {...props} />;
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(
  ({ className = "", ...props }, ref) => {
    return (
      <p ref={ref} className={`card-description ${className}`} {...props} />
    );
  }
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div ref={ref} className={`card-content ${className}`} {...props} />;
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div ref={ref} className={`card-footer ${className}`} {...props} />;
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
