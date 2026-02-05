import React, { useState, useEffect, useCallback } from 'react';
import styles from "./Toastcomponent.module.scss";


type ToastType = "success" | "error" | "warning";
type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";


interface ToastProps {
    message: string;
    type?: ToastType;
    visible: boolean;
    id?: number;
}

interface ToastContainerProps {
    toasts: ToastProps[];
    position?: ToastPosition;
}



const Toast: React.FC<ToastProps> = ({ message, type = "success" }) => (
<div className={`${styles.toast} ${styles[type]}`}>
            {message}
        </div>
)

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => (
    <div className={`${styles.toastContainer}`}>
        {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
        ))}
    </div>
);

export function useToast(timeout = 3000, position: ToastPosition = "top-right") {
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const toastId = React.useRef(0);

    const showToast = useCallback((message: string, type?: ToastType) => {
        toastId.current += 1;
        setToasts((prev) => [
            ...prev,
            { message, type: type || "success", id: toastId.current, visible: true }
        ]);
    }, []);



    useEffect(() => {
    
        if (toasts.length === 0) return;
        const timers = toasts.map((toast) =>
            setTimeout(() => {
            
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, timeout)
        );
            return () => timers.forEach(clearTimeout);   
        }, [toasts, timeout]);

        return { toasts, showToast, position };
    }
      
       


const ToastComponent: React.FC = () => {
    const { toasts, showToast, position } = useToast(3000, "top-right");

    return (
        <div>
            <button onClick={()=> showToast("Besked success!", "success") }>Succes vise</button>
            <button onClick={()=> showToast("Besked advarsel!", "warning") }>Advarsel vise</button>
            <button onClick={()=> showToast("Besked fejl!", "error") }>Fejl vise</button>
            <ToastContainer toasts={toasts} position={position} />
            </div>
    )
}

export default ToastComponent;