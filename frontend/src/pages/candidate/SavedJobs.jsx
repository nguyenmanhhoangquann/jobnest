import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaArrowRight, FaTrashAlt } from 'react-icons/fa';
import jobApi from '../../api/jobApi.js';
import JobCard from '../../components/job/JobCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingGrid from '../../components/common/Loading.jsx';
import { showToast } from '../../components/common/ToastHost.jsx';
import '../../styles/saved-jobs.css';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    jobApi
      .getSavedJobs()
      .then((data) => {
        const list = data?.content || (Array.isArray(data) ? data : []);
        setJobs(list);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleUnsave = (jobId) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    showToast('info', 'Đã bỏ lưu công việc thành công.', 'BỎ QUAN TÂM');
  };

  return (
    <div className="saved-jobs-page-root">
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Header Section */}
        <div className="text-start">
          <div className="saved-jobs-eyebrow">
            <span className="saved-jobs-eyebrow-dot" />
            <span>Mục quan tâm • Tuyển dụng đã lưu</span>
          </div>

          <h1 className="saved-jobs-header-title">Công việc đã lưu</h1>
          <p className="saved-jobs-header-desc">
            Theo dõi và ứng tuyển nhanh các vị trí việc làm bạn đã đánh dấu từ danh sách đối tác doanh nghiệp uy tín.
          </p>
        </div>

        {/* Double-Bezel Shell */}
        <div className="saved-jobs-outer-shell">
          <div className="saved-jobs-inner-core">
            <div className="saved-jobs-toolbar">
              <span className="fw-bold fs-6">Danh sách việc làm</span>
              <span className="saved-jobs-count-badge">
                {jobs.length} VỊ TRÍ ĐÃ LƯU
              </span>
            </div>

            <div className="p-4">
              {loading ? (
                <LoadingGrid count={4} />
              ) : jobs.length === 0 ? (
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
                        extra={
                          <span
                            className="badge bg-light text-muted border small rounded-0"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                          >
                            Đã lưu trong mục quan tâm
                          </span>
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
