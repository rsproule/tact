'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (toastId: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto dismiss after duration (default 3 seconds)
    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = useCallback((toastId: string) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm">
      {toasts.map(toast => (
        <ToastComponent key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastComponent({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }[toast.type];

  const textColor = 'text-white';

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-semibold text-sm">{toast.title}</div>
          {toast.description && (
            <div className="text-xs mt-1 opacity-90">{toast.description}</div>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="ml-3 text-white/80 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}