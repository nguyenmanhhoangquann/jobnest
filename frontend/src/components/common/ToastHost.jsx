import React, { useState, useEffect } from 'react';
import { FaCheck, FaExclamation, FaInfo, FaTimes } from 'react-icons/fa';
import '../../styles/toast.css';

let toastSubscriber = null;

/**
 * Hiển thị thông báo nhỏ phong cách Swiss Architectural (góc vuông, trượt từ phải sang trái).
 * @param {'success'|'error'|'info'} type - Loại thông báo
 * @param {string} message - Nội dung thông báo
 * @param {string} [title] - Thẻ tiêu đề phụ (tùy chọn)
 * @param {number} [duration=4000] - Thời gian hiển thị (ms)
 */
export const showToast = (type, message, title = '', duration = 4000) => {
  if (toastSubscriber) {
    toastSubscriber({
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      type: type || 'info',
      message,
      title,
      duration,
      closing: false,
    });
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

  const handleClose = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, closing: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 240);
  };

  const getDefaultTitle = (type) => {
    switch (type) {
      case 'success':
        return 'THÀNH CÔNG';
      case 'error':
        return 'CẢNH BÁO';
      default:
        return 'THÔNG BÁO HỆ THỐNG';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheck size={11} />;
      case 'error':
        return <FaExclamation size={12} />;
      default:
        return <FaInfo size={11} />;
    }
  };

  return (
    <div className="swiss-toast-container" role="region" aria-label="Notifications">
      {toasts.map((item) => (
        <ToastItem
          key={item.id}
          item={item}
          onClose={handleClose}
          defaultTitle={getDefaultTitle(item.type)}
          icon={getIcon(item.type)}
        />
      ))}
    </div>
  );
}

function ToastItem({ item, onClose, defaultTitle, icon }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(item.id);
    }, item.duration || 4000);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, onClose]);

  const tagText = item.title || defaultTitle;

  return (
    <div
      className={`swiss-toast-card swiss-toast-card--${item.type} ${item.closing ? 'swiss-toast-card--closing' : ''}`}
      role="alert"
    >
      {/* Header Eyebrow Tag + Close button */}
      <div className="swiss-toast-header">
        <div className={`swiss-toast-tag swiss-toast-tag--${item.type}`}>
          <span className="swiss-toast-tag-dot" />
          <span>[ {tagText} ]</span>
        </div>

        <button
          type="button"
          className="swiss-toast-close"
          onClick={() => onClose(item.id)}
          aria-label="Đóng thông báo"
        >
          <FaTimes size={10} />
        </button>
      </div>

      {/* Message Body */}
      <div className="swiss-toast-body">
        <div className={`swiss-toast-icon-square swiss-toast-icon-square--${item.type}`}>
          {icon}
        </div>
        <div className="swiss-toast-message">
          {item.message}
        </div>
      </div>

      {/* Countdown progress bar */}
      <div
        className={`swiss-toast-progress swiss-toast-progress--${item.type}`}
        style={{ animationDuration: `${item.duration || 4000}ms` }}
      />
    </div>
  );
}
