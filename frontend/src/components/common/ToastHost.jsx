import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

let toastSubscriber = null;

export const showToast = (type, message) => {
  if (toastSubscriber) {
    toastSubscriber({ id: Date.now(), type, message });
  }
};

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastSubscriber = (toast) => {
      setToasts((prev) => [...prev, toast]);
    };
    return () => {
      toastSubscriber = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-success me-2" size={16} />;
      case 'error':
        return <FaExclamationCircle className="text-danger me-2" size={16} />;
      default:
        return <FaInfoCircle className="me-2" style={{ color: 'var(--color-primary-dark)' }} size={16} />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'var(--color-success)';
      case 'error':
        return 'var(--color-danger)';
      default:
        return 'var(--color-primary)';
    }
  };

  return (
    <ToastContainer
      position="bottom-end"
      className="p-3 position-fixed"
      style={{ zIndex: 9999 }}
    >
      {toasts.map((item) => (
        <Toast
          key={item.id}
          onClose={() => removeToast(item.id)}
          delay={3500}
          autohide
          className="shadow-lg border-start border-4 bg-white"
          style={{
            borderLeftColor: `${getBorderColor(item.type)} !important`,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <Toast.Body className="d-flex align-items-center py-2 px-3 fs-6">
            {getIcon(item.type)}
            <span className="flex-grow-1 text-dark" style={{ fontSize: '14px' }}>
              {item.message}
            </span>
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}
