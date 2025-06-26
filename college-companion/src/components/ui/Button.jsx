import React from "react";
import { Slot } from "@radix-ui/react-slot";
import "../ui/card.css";

const Button = React.forwardRef(
  (
    {
      asChild = false,
      variant = "default",
      size = "default",
      className = "",
      ...props
    },
    ref
  ) => {
    // When using asChild, render the Slot component, otherwise use a <button>.
    const Comp = asChild ? Slot : "button";
    // Compose our className based on our props.
    const buttonClass = `button button--${variant} button-size-${size} ${className}`;
    return <Comp ref={ref} className={buttonClass} {...props} />;
  }
);
Button.displayName = "Button";

export { Button };
