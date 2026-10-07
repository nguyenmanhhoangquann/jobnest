import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { showToast } from '../common/ToastHost.jsx';
import jobApi from '../../api/jobApi.js';

export default function SaveButton({ jobId, initialSaved = false, onToggle }) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const { user, isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuth) {
      showToast('info', 'Đăng nhập để lưu việc làm');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (user?.role === 'EMPLOYER') {
      showToast('error', 'Chỉ người tìm việc mới lưu được việc làm');
      return;
    }

    if (loading) return;

    const nextState = !saved;
    setSaved(nextState);
    if (onToggle) onToggle(jobId, nextState);

    setLoading(true);
    try {
      if (nextState) {
        await jobApi.saveJob(jobId);
        showToast('success', 'Đã lưu việc làm vào danh sách của bạn');
      } else {
        await jobApi.unsaveJob(jobId);
        showToast('info', 'Đã bỏ lưu việc làm');
      }
    } catch {
      setSaved(!nextState);
      if (onToggle) onToggle(jobId, !nextState);
      showToast('error', 'Không thể cập nhật trạng thái lưu việc làm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`save-btn ${saved ? 'save-btn--active' : ''}`}
      aria-label={saved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
      aria-pressed={saved}
      onClick={handleToggle}
      disabled={loading}
      title={saved ? 'Bỏ lưu' : 'Lưu tin'}
    >
      {saved ? (
        <FaHeart size={16} color="var(--color-hot)" />
      ) : (
        <FaRegHeart size={16} color="var(--color-text)" />
      )}
    </button>
  );
}
