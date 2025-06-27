import React from "react";
import "./Textarea.css"; // Reference the external CSS file

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`textarea-field ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
