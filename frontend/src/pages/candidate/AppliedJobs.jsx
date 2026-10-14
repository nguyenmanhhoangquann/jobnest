import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa';
import applicationApi from '../../api/applicationApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { Spinner } from '../../components/common/Loading.jsx';

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    applicationApi
      .getMyApplications()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.content || [];
        setApplications(list);
        setLoading(false);
      })
      .catch(() => {
        setApplications([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="applied-jobs-page py-4">
      <div className="container-app">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fs-4 fw-bold mb-1">Việc làm đã ứng tuyển</h1>
            <p className="text-muted small mb-0">Theo dõi tiến độ xét duyệt hồ sơ của bạn từ các nhà tuyển dụng</p>
          </div>
          <span className="badge bg-warning text-dark px-3 py-2 fw-semibold">
            {applications.length} hồ sơ đã nộp
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner size="lg" className="my-4" />
            <p className="text-muted">Đang tải danh sách hồ sơ đã ứng tuyển...</p>
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            title="Bạn chưa ứng tuyển công việc nào"
            description="Hãy khám phá hàng ngàn cơ hội việc làm hấp dẫn và nộp hồ sơ ngay hôm nay."
            actionText="Tìm kiếm việc làm ngay"
            onAction={() => window.location.href = '/jobs'}
          />
        ) : (
          <div className="card border shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Vị trí công việc</th>
                    <th scope="col">Công ty</th>
                    <th scope="col">Ngày nộp</th>
                    <th scope="col">Hồ sơ đính kèm</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col" className="text-end pe-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="ps-4">
                        <Link to={`/jobs/${app.jobId}`} className="fw-semibold text-dark text-decoration-none">
                          {app.jobTitle}
                        </Link>
                      </td>
                      <td className="text-muted">{app.companyName || 'Tập đoàn Công nghệ Hoàng Quân'}</td>
                      <td className="text-muted small">
                        <FaCalendarAlt className="me-1 text-muted" size={12} />
                        {app.appliedAt || '25/10/2026'}
                      </td>
                      <td>
                        <a
                          href={app.cvUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="badge bg-light text-primary border text-decoration-none d-inline-flex align-items-center gap-1 py-1 px-2"
                        >
                          <FaFilePdf size={12} className="text-danger" />
                          <span>Xem CV</span>
                        </a>
                      </td>
                      <td>
                        <StatusBadge status={app.status || 'PENDING'} />
                      </td>
                      <td className="text-end pe-4">
                        <Link to={`/jobs/${app.jobId}`} className="btn btn-sm btn-outline-secondary">
                          Xem JD <FaExternalLinkAlt size={10} className="ms-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
