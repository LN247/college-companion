import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import '../Styles/Toast.css';

const Toast = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Progress bar animation
    if (toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (toast.duration / 100));
          if (newProgress <= 0) {
            clearInterval(interval);
            handleClose();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  };

  const getIcon = () => {
    const iconClasses = "toast-icon flex-shrink-0";
    
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} toast-icon-success`} />;
      case 'error':
        return <AlertCircle className={`${iconClasses} toast-icon-error`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} toast-icon-warning`} />;
      default:
        return <Info className={`${iconClasses} toast-icon-info`} />;
    }
  };

  const getToastClasses = () => {
    const baseClasses = "toast-container";
    switch (toast.type) {
      case 'success':
        return `${baseClasses} toast-success`;
      case 'error':
        return `${baseClasses} toast-error`;
      case 'warning':
        return `${baseClasses} toast-warning`;
      default:
        return `${baseClasses} toast-default`;
    }
  };

  const getProgressColor = () => {
    switch (toast.type) {
      case 'success':
        return "toast-progress-success";
      case 'error':
        return "toast-progress-error";
      case 'warning':
        return "toast-progress-warning";
      default:
        return "toast-progress-default";
    }
  };

  const getVisibilityClasses = () => {
    return isVisible ? "toast-visible" : "toast-hidden";
  };

  return (
    <div className={`${getToastClasses()} ${getVisibilityClasses()}`}>
      {/* Progress bar */}
      {toast.duration > 0 && (
        <div className="toast-progress-container">
          <div 
            className={`toast-progress ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="toast-content">
        <div className="toast-inner">
          {getIcon()}
          
          <div className="toast-text">
            {toast.title && (
              <h4 className="toast-title">
                {toast.title}
              </h4>
            )}
            <p className="toast-message">
              {toast.message}
            </p>
            {toast.action && (
              <button 
                onClick={toast.action.onClick}
                className="toast-action"
              >
                {toast.action.label}
              </button>
            )}
          </div>

          <button
            onClick={handleClose}
            className="toast-close-button"
          >
            <X className="toast-close-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;