import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { showToast } from '../common/ToastHost.jsx';
import jobApi from '../../api/jobApi.js';

export default function SaveButton({ jobId, initialSaved = false, onToggle, variant = 'heart' }) {
  const [saved, setSaved] = useState(
    () => initialSaved || (JSON.parse(localStorage.getItem('jn_local_saved_jobs') || '[]')).includes(String(jobId))
  );
  const [loading, setLoading] = useState(false);
  const { user, isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const handleSync = (e) => {
      if (e?.detail?.id === String(jobId)) {
        setSaved(!!e.detail.saved);
      }
    };
    window.addEventListener('saved-jobs-updated', handleSync);
    return () => window.removeEventListener('saved-jobs-updated', handleSync);
  }, [jobId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
        showToast('success', 'Đã lưu việc làm vào danh sách quan tâm!');
        window.dispatchEvent(new CustomEvent('open-saved-jobs', { detail: { tab: 'jobs' } }));
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

  if (variant === 'star') {
    return (
      <button
        type="button"
        className={`himalayas-star-btn ${saved ? 'himalayas-star-btn--active' : ''}`}
        aria-label={saved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
        aria-pressed={saved}
        onClick={handleToggle}
        disabled={loading}
        title={saved ? 'Đã lưu việc làm' : 'Lưu việc làm'}
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill={saved ? '#F59E0B' : 'none'}
          stroke={saved ? '#F59E0B' : '#94A3B8'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    );
  }

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
