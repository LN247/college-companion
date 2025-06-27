
import React  from  'react'
export  function  useToastStore () {
  const [toasts, setToasts] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState('default');
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const addToast = (variant) => {
    const id = Date.now();
    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        variant,
        title: variant === 'destructive' ? 'Error' : 'Success',
        description: variant === 'destructive' ? 'Something went wrong. Please try again.' : 'Your action was completed successfully.'
      }
    ]);

    setType(variant);
    setOpen(false);

    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  };

  const removeToast = (id) => {
    setToasts((currentToasts) => currentToasts.filter(toast => toast.id !== id));
  };
 return {addToast,removeToast}
}