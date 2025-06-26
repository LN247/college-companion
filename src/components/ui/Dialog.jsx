import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import "./Dialog.css";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn("dialog-overlay", className)}
      {...rest}
    />
  );
});
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn("dialog-content", className)}
        {...rest}
      >
        {children}
        <DialogPrimitive.Close className="dialog-close">
          <X className="close-icon" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = (props) => {
  const { className, ...rest } = props;
  return <div className={cn("dialog-header", className)} {...rest} />;
};
DialogHeader.displayName = "DialogHeader";

const DialogFooter = (props) => {
  const { className, ...rest } = props;
  return <div className={cn("dialog-footer", className)} {...rest} />;
};
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("dialog-title", className)}
      {...rest}
    />
  );
});
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("dialog-description", className)}
      {...rest}
    />
  );
});
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
