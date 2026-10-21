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
  FaBuilding,
} from 'react-icons/fa';
import jobApi from '../../api/jobApi.js';
import companyApi from '../../api/companyApi.js';
import { showToast } from '../common/ToastHost.jsx';
import '../../styles/saved-jobs-drawer.css';

export default function SavedJobsDrawer({
  isOpen,
  onClose,
  savedJobs = [],
  onUpdateJobs,
  initialTab = 'jobs',
}) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [followedCompanies, setFollowedCompanies] = useState([]);

  // Load followed companies when drawer opens or updates
  const loadFollowedCompanies = useCallback(() => {
    companyApi
      .getFollowedCompanies()
      .then((comps) => setFollowedCompanies(comps || []))
      .catch(() => setFollowedCompanies([]));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      loadFollowedCompanies();
    }
  }, [isOpen, initialTab, loadFollowedCompanies]);

  useEffect(() => {
    const handleUpdate = () => {
      loadFollowedCompanies();
    };
    const handleJobsUpdate = () => {
      jobApi
        .getSavedJobs()
        .then((data) => {
          const list = data?.content || (Array.isArray(data) ? data : []);
          if (onUpdateJobs) onUpdateJobs(list);
        })
        .catch(() => {});
    };
    window.addEventListener('followed-companies-updated', handleUpdate);
    window.addEventListener('saved-jobs-updated', handleJobsUpdate);
    return () => {
      window.removeEventListener('followed-companies-updated', handleUpdate);
      window.removeEventListener('saved-jobs-updated', handleJobsUpdate);
    };
  }, [loadFollowedCompanies, onUpdateJobs]);

  // Smooth GPU enter & exit transitions
  useEffect(() => {
    let timer;
    if (isOpen) {
      setMounted(true);
      setClosing(false);
      timer = setTimeout(() => {
        setActive(true);
      }, 20);
      document.body.style.overflow = 'hidden';
    } else {
      setActive(false);
      setClosing(true);
      timer = setTimeout(() => {
        setMounted(false);
        setClosing(false);
        document.body.style.overflow = '';
      }, 220);
    }
    return () => clearTimeout(timer);
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

  const handleUnfollowCompany = (compId, compName, e) => {
    if (e) e.stopPropagation();
    companyApi.toggleFollow(compId);
    setFollowedCompanies((prev) => prev.filter((c) => Number(c.id) !== Number(compId)));
    showToast('info', `Đã bỏ quan tâm ${compName || 'công ty'}.`, 'BỎ QUAN TÂM');
  };

  const handleGoToJob = (jobId) => {
    handleClose();
    navigate(`/jobs/${jobId}`);
  };

  const handleGoToCompany = (compId) => {
    handleClose();
    navigate(`/companies?id=${compId}`);
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
              <span>[ MỤC QUAN TÂM ]</span>
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
            <h2 className="saved-drawer-title">
              {activeTab === 'jobs' ? 'Danh sách việc làm quan tâm' : 'Danh sách công ty quan tâm'}
            </h2>
            <span className="badge rounded-0 bg-warning text-dark font-monospace fw-bold" style={{ fontSize: '11px', padding: '4px 8px' }}>
              {activeTab === 'jobs' ? `${savedJobs.length} VIỆC LÀM` : `${followedCompanies.length} CÔNG TY`}
            </span>
          </div>
        </div>

        {/* 2 Tabs chuyển đổi Việc làm & Công ty */}
        <div className="saved-drawer-tabs">
          <button
            type="button"
            className={`saved-drawer-tab-btn ${activeTab === 'jobs' ? 'saved-drawer-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <FaBriefcase size={12} />
            <span>Việc làm quan tâm</span>
            <span className="saved-drawer-tab-badge">{savedJobs.length}</span>
          </button>
          <button
            type="button"
            className={`saved-drawer-tab-btn ${activeTab === 'companies' ? 'saved-drawer-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            <FaBuilding size={12} />
            <span>Công ty quan tâm</span>
            <span className="saved-drawer-tab-badge">{followedCompanies.length}</span>
          </button>
        </div>

        {/* Sub-bar */}
        <div className="saved-drawer-bar">
          <span className="saved-drawer-bar-title">
            {activeTab === 'jobs' ? 'Các cơ hội việc làm đã đánh dấu' : 'Các doanh nghiệp bạn đang theo dõi'}
          </span>
          {activeTab === 'jobs' ? (
            <Link
              to="/candidate/saved-jobs"
              onClick={handleClose}
              className="saved-drawer-view-all"
            >
              <span>Trang chi tiết</span>
              <FaArrowRight size={10} />
            </Link>
          ) : (
            <Link
              to="/candidate/saved-jobs?tab=companies"
              onClick={handleClose}
              className="saved-drawer-view-all"
            >
              <span>Trang chi tiết</span>
              <FaArrowRight size={10} />
            </Link>
          )}
        </div>

        {/* Body Items List */}
        <div className="saved-drawer-body">
          {activeTab === 'jobs' ? (
            savedJobs.length === 0 ? (
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
            )
          ) : (
            followedCompanies.length === 0 ? (
              <div className="saved-drawer-empty">
                <div className="saved-drawer-empty-sq">
                  <FaBuilding size={20} />
                </div>
                <p className="fw-bold mb-1 text-dark" style={{ fontSize: '15px' }}>
                  Chưa có công ty nào được quan tâm
                </p>
                <p className="small text-muted mb-0">
                  Bấm vào nút Quan tâm trên các thẻ doanh nghiệp để theo dõi tin tuyển dụng mới nhất tại đây.
                </p>
                <button
                  type="button"
                  className="saved-drawer-empty-btn"
                  onClick={() => {
                    handleClose();
                    navigate('/companies');
                  }}
                >
                  <span>Khám phá công ty ngay</span>
                  <FaArrowRight size={10} />
                </button>
              </div>
            ) : (
              followedCompanies.map((comp) => {
                const compName = comp.name || 'Doanh nghiệp uy tín';
                const logoUrl = comp.logo || comp.logoUrl;
                const location = comp.location || comp.hq || 'Toàn quốc';
                const jobsCount = comp.jobs?.length || 0;

                return (
                  <div key={comp.id} className="saved-drawer-item">
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
                        <FaBuilding size={18} className="text-muted" />
                      )}
                    </div>

                    {/* Content Column */}
                    <div className="saved-drawer-content">
                      <span
                        className="saved-drawer-job-title"
                        onClick={() => handleGoToCompany(comp.id)}
                        role="button"
                        tabIndex={0}
                      >
                        {compName}
                      </span>

                      <div className="saved-drawer-comp-name">
                        {comp.industry || 'Công nghệ thông tin'}
                      </div>

                      <div className="saved-drawer-meta-pills">
                        <span className="saved-drawer-pill saved-drawer-pill--salary">
                          <FaBriefcase size={10} className="me-1" />
                          {jobsCount} Việc làm đang tuyển
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
                        onClick={(e) => handleUnfollowCompany(comp.id, compName, e)}
                        title="Bỏ quan tâm công ty này"
                      >
                        <FaTrashAlt size={11} />
                      </button>

                      <button
                        type="button"
                        className="saved-drawer-apply-link border-0"
                        onClick={() => handleGoToCompany(comp.id)}
                      >
                        <span>Xem cty</span>
                        <FaArrowRight size={9} />
                      </button>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </aside>
    </>,
    document.body
  );
}