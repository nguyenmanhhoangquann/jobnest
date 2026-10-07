import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jobApi from '../../api/jobApi.js';
import JobCard from '../../components/job/JobCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingGrid from '../../components/common/Loading.jsx';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    jobApi
      .getSavedJobs()
      .then((data) => {
        setJobs(data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleUnsave = (jobId) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  return (
    <div className="saved-jobs-page py-4">
      <div className="container-app">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fs-4 fw-bold mb-1">Công việc đã lưu</h1>
            <p className="text-muted small mb-0">Danh sách các vị trí bạn đang quan tâm và dự định ứng tuyển</p>
          </div>
          <span className="badge bg-warning text-dark px-3 py-2 fw-semibold">
            {jobs.length} việc làm đã lưu
          </span>
        </div>

        {loading ? (
          <LoadingGrid count={6} />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="Bạn chưa lưu công việc nào"
            description="Bấm vào biểu tượng trái tim trên các thẻ việc làm để lưu lại và xem sau tại đây."
            actionText="Khám phá việc làm ngay"
            onAction={() => window.location.href = '/jobs'}
          />
        ) : (
          <div className="d-flex flex-column gap-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={{ ...job, saved: true }}
                extra={
                  <span className="badge bg-light text-muted border small">
                    Đã lưu trong mục yêu thích
                  </span>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
