import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTimes,
  FaBookmark,
  FaTrashAlt,
  FaArrowRight,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
} from 'react-icons/fa';
import jobApi from '../../api/jobApi.js';
import { showToast } from '../common/ToastHost.jsx';
import '../../styles/saved-jobs-drawer.css';

export default function SavedJobsDrawer({ isOpen, onClose, savedJobs = [], onUpdateJobs }) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [closing, setClosing] = useState(false);

  // Smooth GPU enter & exit transitions
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setClosing(false);
      const rAF = requestAnimationFrame(() => {
        setActive(true);
      });
      document.body.style.overflow = 'hidden';
      return () => cancelAnimationFrame(rAF);
    } else if (mounted) {
      setActive(false);
      setClosing(true);
      const timer = setTimeout(() => {
        setMounted(false);
        setClosing(false);
        document.body.style.overflow = '';
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setActive(false);
    setClosing(true);
    setTimeout(() => {
      setMounted(false);
      setClosing(false);
      document.body.style.overflow = '';
      onClose();
    }, 220);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!mounted) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mounted, handleClose]);

  if (!mounted) return null;

  const handleUnsave = async (jobId, e) => {
    if (e) e.stopPropagation();
    // Optimistic UI update
    if (onUpdateJobs) {
      onUpdateJobs(savedJobs.filter((j) => j.id !== jobId));
    }
    showToast('info', 'Đã bỏ lưu công việc.', 'BỎ QUAN TÂM');
    try {
      await jobApi.unsaveJob(jobId);
    } catch {
      showToast('error', 'Không thể bỏ lưu công việc này.');
    }
  };

  const handleGoToJob = (jobId) => {
    handleClose();
    navigate(`/jobs/${jobId}`);
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Thoả thuận';
    if (typeof salary === 'number') {
      return `${(salary / 1000000).toFixed(0)} triệu`;
    }
    return salary;
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`saved-drawer-backdrop ${active ? 'saved-drawer-backdrop--active' : ''} ${closing ? 'saved-drawer-backdrop--closing' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-over Right Panel */}
      <aside
        className={`saved-drawer-panel ${active ? 'saved-drawer-panel--active' : ''} ${closing ? 'saved-drawer-panel--closing' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="saved-drawer-header">
          <div className="saved-drawer-eyebrow">
            <span className="saved-drawer-tag">
              <span className="saved-drawer-tag-dot" />
              <span>[ VIỆC LÀM ĐÃ LƯU ]</span>
            </span>

            <button
              type="button"
              className="saved-drawer-close"
              onClick={handleClose}
              aria-label="Đóng"
            >
              <FaTimes size={12} />
            </button>
          </div>

          <div className="saved-drawer-title-row">
            <h2 className="saved-drawer-title">Danh sách việc làm quan tâm</h2>
            <span className="badge rounded-0 bg-warning text-dark font-monospace fw-bold" style={{ fontSize: '11px', padding: '4px 8px' }}>
              {savedJobs.length} ĐÃ LƯU
            </span>
          </div>
        </div>

        {/* Sub-bar */}
        <div className="saved-drawer-bar">
          <span className="saved-drawer-bar-title">Các cơ hội đã đánh dấu</span>
          <Link
            to="/candidate/saved-jobs"
            onClick={handleClose}
            className="saved-drawer-view-all"
          >
            <span>Trang chi tiết</span>
            <FaArrowRight size={10} />
          </Link>
        </div>

        {/* Body Items List */}
        <div className="saved-drawer-body">
          {savedJobs.length === 0 ? (
            <div className="saved-drawer-empty">
              <div className="saved-drawer-empty-sq">
                <FaBookmark size={20} />
              </div>
              <p className="fw-bold mb-1 text-dark" style={{ fontSize: '15px' }}>
                Chưa có việc làm nào được lưu
              </p>
              <p className="small text-muted mb-0">
                Bấm vào biểu tượng bookmark trên các tin tuyển dụng để lưu lại và theo dõi tại đây.
              </p>
              <button
                type="button"
                className="saved-drawer-empty-btn"
                onClick={() => {
                  handleClose();
                  navigate('/jobs');
                }}
              >
                <span>Khám phá việc làm ngay</span>
                <FaArrowRight size={10} />
              </button>
            </div>
          ) : (
            savedJobs.map((job) => {
              const compName = job.company?.name || job.companyName || 'Doanh nghiệp uy tín';
              const logoUrl = job.company?.logoUrl || job.logoUrl;
              const location = job.location || 'Toàn quốc';

              return (
                <div key={job.id} className="saved-drawer-item">
                  {/* Logo Square */}
                  <div className="saved-drawer-logo-sq">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={compName}
                        className="saved-drawer-logo-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <FaBriefcase size={18} className="text-muted" />
                    )}
                  </div>

                  {/* Content Column */}
                  <div className="saved-drawer-content">
                    <span
                      className="saved-drawer-job-title"
                      onClick={() => handleGoToJob(job.id)}
                      role="button"
                      tabIndex={0}
                    >
                      {job.title}
                    </span>

                    <div className="saved-drawer-comp-name">
                      {compName}
                    </div>

                    <div className="saved-drawer-meta-pills">
                      <span className="saved-drawer-pill saved-drawer-pill--salary">
                        <FaMoneyBillWave size={10} className="me-1" />
                        {formatSalary(job.salary)}
                      </span>
                      <span className="saved-drawer-pill">
                        <FaMapMarkerAlt size={10} className="me-1 text-muted" />
                        {location}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="saved-drawer-actions">
                    <button
                      type="button"
                      className="saved-drawer-unsave-btn"
                      onClick={(e) => handleUnsave(job.id, e)}
                      title="Bỏ lưu việc làm này"
                    >
                      <FaTrashAlt size={11} />
                    </button>

                    <button
                      type="button"
                      className="saved-drawer-apply-link border-0"
                      onClick={() => handleGoToJob(job.id)}
                    >
                      <span>Xem tin</span>
                      <FaArrowRight size={9} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>,
    document.body
  );
}
