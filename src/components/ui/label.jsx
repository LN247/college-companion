import React from "react";
import "./Label.css"; // Import the CSS file

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return <label ref={ref} className={`label ${className}`} {...props} />;
});

Label.displayName = "Label";

export { Label };
