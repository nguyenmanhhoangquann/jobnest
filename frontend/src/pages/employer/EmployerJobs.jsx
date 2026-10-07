import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEye, FaCalendarAlt } from 'react-icons/fa';
import jobApi from '../../api/jobApi.js';
import { Spinner } from '../../components/common/Loading.jsx';

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    jobApi
      .getJobs({ size: 6 })
      .then((data) => {
        setJobs(data.content || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="employer-jobs-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fs-4 fw-bold mb-1">Tin tuyển dụng của tôi</h1>
          <p className="text-muted small mb-0">Quản lý trạng thái các bài đăng tuyển dụng đang hoạt động</p>
        </div>
        <Link to="/employer/post-job" className="btn btn-brand fw-semibold">
          <FaPlus className="me-1" /> Đăng tin mới
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner size="lg" className="my-4" />
          <p className="text-muted">Đang tải danh sách tin tuyển dụng...</p>
        </div>
      ) : (
        <div className="card border shadow-sm bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Tiêu đề bài đăng</th>
                  <th scope="col">Mức lương</th>
                  <th scope="col">Địa điểm</th>
                  <th scope="col">Hạn nộp</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col" className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="ps-4">
                      <Link to={`/jobs/${job.id}`} className="fw-semibold text-dark text-decoration-none">
                        {job.title}
                      </Link>
                    </td>
                    <td>{job.salaryText}</td>
                    <td className="text-muted small">{job.location}</td>
                    <td className="text-muted small">
                      <FaCalendarAlt className="me-1 text-muted" size={11} />
                      {job.deadline || '30/11/2026'}
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        Đang hiển thị
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-secondary">
                        <FaEye className="me-1" /> Xem live
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
  );
}
