import React from "react";
import "./Button.css";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const buttonClass = `button button--${variant} button-size-${size} ${className || ""}`;
    return <button className={buttonClass} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button };
