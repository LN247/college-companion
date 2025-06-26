import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import "./Avartar.css"; // Import your custom CSS for styling

const Avatar = React.forwardRef(function Avatar(
  { className = "", ...props },
  ref
) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={`avatar-root ${className}`}
      {...props}
    />
  );
});

const AvatarImage = React.forwardRef(function AvatarImage(
  { className = "", ...props },
  ref
) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={`avatar-image ${className}`}
      {...props}
    />
  );
});

const AvatarFallback = React.forwardRef(function AvatarFallback(
  { className = "", ...props },
  ref
) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={`avatar-fallback ${className}`}
      {...props}
    />
  );
});

export { Avatar, AvatarImage, AvatarFallback };
