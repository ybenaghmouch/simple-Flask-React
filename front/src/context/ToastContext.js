import React, { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const useToast = () => {
    return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
    const notify = (type, message) => {
        switch (type) {
            case 'success':
                toast.success(message, { position: "top-right" });
                break;
            case 'error':
                toast.error(message, { position: "top-right" });
                break;
            default:
                break;
        }
    };

    return (
        <ToastContext.Provider value={{ notify }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};
