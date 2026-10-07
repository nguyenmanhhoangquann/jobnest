import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../common/ToastHost';

export default function SaveButton({ jobId, initialSaved = false, onToggle }) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const { user, isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuth) {
      showToast('info', 'Đăng nhập để lưu việc làm');
      navigate('/login', { state: { from: location } });
      return;
    }

    if (user?.role === 'EMPLOYER') {
      showToast('error', 'Chỉ người tìm việc mới lưu được việc làm');
      return;
    }

    const nextState = !saved;
    setSaved(nextState);

    if (onToggle) {
      onToggle(jobId, nextState);
    }

    showToast('success', nextState ? 'Đã lưu việc làm thành công' : 'Đã bỏ lưu việc làm');
  };

  return (
    <button
      type="button"
      className={`save-btn ${saved ? 'save-btn--active' : ''}`}
      aria-label={saved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
      aria-pressed={saved}
      onClick={handleToggle}
      disabled={loading}
    >
      {saved ? (
        <FaHeart size={16} color="var(--color-hot)" />
      ) : (
        <FaRegHeart size={16} color="var(--color-text)" />
      )}
    </button>
  );
}
