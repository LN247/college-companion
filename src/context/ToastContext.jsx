import  {createContext,useContext,useState} from 'react'
import Toast from '../components/Toast'




const ToastContext = createContext();


// Enhanced Toast Provider
export const ToastProvider = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (options) => {
    // Handle both string and object parameters for backward compatibility
    let toastOptions;

    if (typeof options === 'string') {
      // Legacy support: addToast(message, type, duration)
      toastOptions = {
        message: arguments[0],
        type: arguments[1] || 'info',
        duration: arguments[2] || 4000
      };
    } else {
      // New object-based approach
      toastOptions = {
        message: '',
        type: 'info',
        duration: 4000,
        title: null,
        action: null,
        ...options
      };
    }

    const id = Date.now() + Math.random();
    const toast = { id, ...toastOptions };

    setToasts(prev => {
      const newToasts = [toast, ...prev];
      // Limit number of toasts
      return newToasts.slice(0, maxToasts);
    });

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts, toasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <div className="space-y-3 pointer-events-auto">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};



export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};