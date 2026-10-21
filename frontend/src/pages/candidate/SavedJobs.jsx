import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FaBookmark,
  FaArrowRight,
  FaTrashAlt,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import jobApi from '../../api/jobApi.js';
import companyApi from '../../api/companyApi.js';
import JobCard from '../../components/job/JobCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingGrid from '../../components/common/Loading.jsx';
import { showToast } from '../../components/common/ToastHost.jsx';
import '../../styles/saved-jobs.css';

export default function SavedJobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'companies' ? 'companies' : 'jobs';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      jobApi.getSavedJobs().catch(() => ({ content: [] })),
      companyApi.getFollowedCompanies().catch(() => []),
    ]).then(([jobsRes, compsRes]) => {
      const list = jobsRes?.content || (Array.isArray(jobsRes) ? jobsRes : []);
      setJobs(list);
      setCompanies(compsRes || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadData();
    const handleSyncJobs = () => {
      jobApi.getSavedJobs().then((data) => {
        const list = data?.content || (Array.isArray(data) ? data : []);
        setJobs(list);
      });
    };
    const handleSyncComps = () => {
      companyApi.getFollowedCompanies().then((comps) => setCompanies(comps || []));
    };

    window.addEventListener('saved-jobs-updated', handleSyncJobs);
    window.addEventListener('followed-companies-updated', handleSyncComps);
    return () => {
      window.removeEventListener('saved-jobs-updated', handleSyncJobs);
      window.removeEventListener('followed-companies-updated', handleSyncComps);
    };
  }, [loadData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'companies' ? { tab: 'companies' } : {});
  };

  const handleUnsave = (jobId) => {
    setJobs((prev) => prev.filter((j) => String(j.id) !== String(jobId)));
    jobApi.unsaveJob(jobId);
    showToast('info', 'Đã bỏ lưu công việc thành công.', 'BỎ QUAN TÂM');
  };

  const handleUnfollowCompany = (compId, compName) => {
    companyApi.toggleFollow(compId);
    setCompanies((prev) => prev.filter((c) => Number(c.id) !== Number(compId)));
    showToast('info', `Đã bỏ quan tâm ${compName || 'doanh nghiệp'}.`, 'BỎ QUAN TÂM');
  };

  return (
    <div className="saved-jobs-page-root">
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Header Section */}
        <div className="text-start">
          <div className="saved-jobs-eyebrow">
            <span className="saved-jobs-eyebrow-dot" />
            <span>Mục quan tâm • Tuyển dụng & Doanh nghiệp đã lưu</span>
          </div>

          <h1 className="saved-jobs-header-title">Mục yêu thích & Đã lưu</h1>
          <p className="saved-jobs-header-desc">
            Theo dõi các vị trí việc làm và doanh nghiệp bạn đã đánh dấu để ứng tuyển nhanh và không bỏ lỡ cơ hội.
          </p>
        </div>

        {/* Double-Bezel Shell */}
        <div className="saved-jobs-outer-shell">
          <div className="saved-jobs-inner-core">
            <div className="saved-jobs-toolbar">
              <span className="fw-bold fs-6">
                {activeTab === 'jobs' ? 'Danh sách việc làm đã lưu' : 'Danh sách doanh nghiệp quan tâm'}
              </span>
              <span className="saved-jobs-count-badge">
                {activeTab === 'jobs' ? `${jobs.length} VỊ TRÍ ĐÃ LƯU` : `${companies.length} DOANH NGHIỆP`}
              </span>
            </div>

            {/* Tab switchers */}
            <div className="saved-page-tabs">
              <button
                type="button"
                className={`saved-page-tab-btn ${activeTab === 'jobs' ? 'saved-page-tab-btn--active' : ''}`}
                onClick={() => handleTabChange('jobs')}
              >
                <FaBriefcase size={13} />
                <span>Việc làm quan tâm</span>
                <span className="saved-page-tab-badge">{jobs.length}</span>
              </button>
              <button
                type="button"
                className={`saved-page-tab-btn ${activeTab === 'companies' ? 'saved-page-tab-btn--active' : ''}`}
                onClick={() => handleTabChange('companies')}
              >
                <FaBuilding size={13} />
                <span>Công ty quan tâm</span>
                <span className="saved-page-tab-badge">{companies.length}</span>
              </button>
            </div>

            <div className="p-4">
              {loading ? (
                <LoadingGrid count={4} />
              ) : activeTab === 'jobs' ? (
                jobs.length === 0 ? (
                  <EmptyState
                    title="Bạn chưa lưu công việc nào"
                    description="Bấm vào biểu tượng bookmark trên các thẻ việc làm để lưu lại và theo dõi tại đây."
                    actionText="Khám phá việc làm ngay"
                    onAction={() => (window.location.href = '/jobs')}
                  />
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {jobs.map((job) => (
                      <div key={job.id} className="position-relative">
                        <JobCard
                          job={{ ...job, saved: true }}
                          onToggleSave={(id, isSaved) => {
                            if (!isSaved) handleUnsave(id);
                          }}
                          extra={
                            <div className="d-flex align-items-center justify-content-between w-100 pt-2 border-top mt-2">
                              <span
                                className="badge bg-light text-muted border small rounded-0"
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                              >
                                Đã lưu trong mục quan tâm
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1.5 py-1 px-2.5 rounded-1"
                                style={{ fontSize: '12px' }}
                                onClick={() => handleUnsave(job.id)}
                              >
                                <FaTrashAlt size={11} />
                                <span>Bỏ lưu</span>
                              </button>
                            </div>
                          }
                        />
                      </div>
                    ))}
                  </div>
                )
              ) : companies.length === 0 ? (
                <EmptyState
                  title="Bạn chưa quan tâm công ty nào"
                  description="Bấm nút quan tâm trên danh sách doanh nghiệp để theo dõi hoạt động tuyển dụng mới nhất."
                  actionText="Khám phá doanh nghiệp ngay"
                  onAction={() => (window.location.href = '/companies')}
                />
              ) : (
                <div className="d-flex flex-column gap-3">
                  {companies.map((comp) => {
                    const compName = comp.name || 'Doanh nghiệp uy tín';
                    const logoUrl = comp.logo || comp.logoUrl;
                    const location = comp.location || comp.hq || 'Toàn quốc';
                    const jobsCount = comp.jobs?.length || 0;

                    return (
                      <div key={comp.id} className="saved-comp-card">
                        <div className="saved-comp-logo">
                          {logoUrl ? (
                            <img src={logoUrl} alt={compName} />
                          ) : (
                            <FaBuilding size={20} className="text-muted" />
                          )}
                        </div>

                        <div className="flex-grow-1 min-w-0">
                          <Link
                            to={`/companies?id=${comp.id}`}
                            className="fw-bold text-dark text-decoration-none d-block text-truncate"
                            style={{ fontSize: '16px' }}
                          >
                            {compName}
                          </Link>
                          <div className="small text-muted mb-1">{comp.industry || 'Công nghệ thông tin'}</div>
                          <div className="d-flex align-items-center gap-3 small text-secondary">
                            <span>
                              <FaBriefcase className="me-1 text-warning" size={12} />
                              {jobsCount} vị trí đang tuyển
                            </span>
                            <span>
                              <FaMapMarkerAlt className="me-1 text-muted" size={12} />
                              {location}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 py-1.5 px-3 rounded-1"
                            style={{ fontSize: '12.5px' }}
                            onClick={() => handleUnfollowCompany(comp.id, compName)}
                          >
                            <FaTrashAlt size={11} />
                            <span>Bỏ quan tâm</span>
                          </button>
                          <Link
                            to={`/companies?id=${comp.id}`}
                            className="btn btn-sm btn-dark d-inline-flex align-items-center gap-1 py-1.5 px-3 rounded-1 text-decoration-none"
                            style={{ fontSize: '12.5px' }}
                          >
                            <span>Xem trang</span>
                            <FaArrowRight size={10} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}