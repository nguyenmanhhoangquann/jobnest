import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaSearch,
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from 'react-icons/fa';
import jobApi from '../../api/jobApi.js';
import { Spinner } from '../../components/common/Loading.jsx';
import { showToast } from '../../components/common/ToastHost.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    setLoading(true);
    jobApi
      .getJobs({ size: 20 })
      .then((data) => {
        setJobs(data.content || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleRemoveJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Bạn có chắc muốn gỡ tin tuyển dụng "${jobTitle}" khỏi cộng đồng không?`)) {
      return;
    }
    try {
      await jobApi.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      showToast('success', `Đã gỡ tin tuyển dụng #${jobId} khỏi cộng đồng.`);
    } catch {
      showToast('error', 'Không thể gỡ bài đăng lúc này.');
    }
  };

  const filteredJobs = useMemo(() => {
    if (!searchKeyword.trim()) return jobs;
    const kw = searchKeyword.toLowerCase();
    return jobs.filter(
      (j) =>
        (j.title || '').toLowerCase().includes(kw) ||
        (j.location || '').toLowerCase().includes(kw)
    );
  }, [jobs, searchKeyword]);

  return (
    <div className="employer-jobs-page">
      {/* 1. Header Trang */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-warning-subtle text-warning-emphasis px-2.5 py-1 fw-semibold">
              <FaBriefcase className="me-1" size={11} /> CHIẾN DỊCH TUYỂN DỤNG
            </span>
            <span className="small text-muted">Quản lý bài đăng cộng đồng</span>
          </div>
          <h1 className="h4 fw-bold mb-0 text-dark">Tin tuyển dụng của bạn</h1>
        </div>

        <div className="d-flex gap-2">
          <Link to="/employer/post-job" className="btn btn-brand btn-sm px-3 fw-semibold">
            <FaPlus className="me-1" /> Đăng tin mới
          </Link>
        </div>
      </div>

      {/* 2. Thanh tìm kiếm và tóm tắt số lượng */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-dark text-white rounded-pill px-3 py-1.5 fw-medium">
            Tất cả: {jobs.length} tin
          </span>
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1.5 fw-medium">
            Đang hiển thị: {jobs.length}
          </span>
        </div>

        <div className="input-group" style={{ maxWidth: '300px' }}>
          <span className="input-group-text bg-white border-end-0 text-muted">
            <FaSearch size={12} />
          </span>
          <input
            type="text"
            className="form-control form-control-sm border-start-0 ps-0"
            placeholder="Tìm theo tiêu đề, địa điểm..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner size="lg" className="my-4 text-warning" />
          <p className="text-muted">Đang tải danh sách bài đăng...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-3 p-5 text-center bg-white">
          <EmptyState
            title="Không tìm thấy bài đăng nào"
            description={
              searchKeyword
                ? 'Không có bài đăng nào khớp với từ khóa tìm kiếm của bạn.'
                : 'Bạn chưa có bài đăng tuyển dụng nào đang hoạt động.'
            }
          />
          {searchKeyword ? (
            <div className="mt-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSearchKeyword('')}
              >
                Xóa từ khóa tìm kiếm
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <Link to="/employer/post-job" className="btn btn-sm btn-brand fw-semibold">
                <FaPlus className="me-1" /> Tạo tin tuyển dụng đầu tiên
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small">
                <tr>
                  <th scope="col" className="ps-4 py-3">Bài đăng tuyển dụng</th>
                  <th scope="col" className="py-3">Mức lương & Khu vực</th>
                  <th scope="col" className="py-3">Hạn nộp hồ sơ</th>
                  <th scope="col" className="py-3">Trạng thái</th>
                  <th scope="col" className="text-end pe-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-1.5 mb-1 flex-wrap">
                        <span className="badge bg-light text-muted border" style={{ fontSize: '11px' }}>
                          #{job.id}
                        </span>
                        {job.jobType && (
                          <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '11px' }}>
                            {job.jobType === 'FULL_TIME'
                              ? 'Toàn thời gian'
                              : job.jobType === 'PART_TIME'
                              ? 'Bán thời gian'
                              : 'Thực tập'}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/jobs/${job.id}`}
                        state={{ from: '/employer/jobs' }}
                        className="fw-bold text-dark text-decoration-none d-block small"
                        style={{ maxWidth: '320px' }}
                      >
                        {job.title}
                      </Link>
                    </td>

                    <td>
                      <div className="d-flex flex-column gap-1 small" style={{ fontSize: '12px' }}>
                        <span className="text-success fw-semibold d-inline-flex align-items-center gap-1">
                          <FaMoneyBillWave size={12} />
                          {job.salaryText || 'Thỏa thuận'}
                        </span>
                        <span className="text-muted d-inline-flex align-items-center gap-1">
                          <FaMapMarkerAlt size={11} className="text-secondary" />
                          {job.location || 'Toàn quốc'}
                        </span>
                      </div>
                    </td>

                    <td className="text-muted small">
                      <span className="d-inline-flex align-items-center gap-1">
                        <FaCalendarAlt size={11} className="text-muted" />
                        {job.deadline ? (job.deadline.includes('T') ? job.deadline.split('T')[0] : job.deadline) : '30/11/2026'}
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 fw-medium" style={{ fontSize: '11.5px' }}>
                        ● Đang hiển thị
                      </span>
                    </td>

                    <td className="text-end pe-4 text-nowrap">
                      <div className="btn-group btn-group-sm">
                        <Link
                          to={`/jobs/${job.id}`}
                          state={{ from: '/employer/jobs' }}
                          className="btn btn-outline-secondary"
                          title="Xem trên cộng đồng"
                        >
                          <FaEye className="me-1" /> Xem
                        </Link>
                        <Link
                          to={`/employer/edit-job/${job.id}`}
                          state={{ from: '/employer/jobs' }}
                          className="btn btn-outline-primary"
                          title="Chỉnh sửa nội dung tin"
                        >
                          <FaEdit className="me-1" /> Sửa
                        </Link>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleRemoveJob(job.id, job.title)}
                          title="Gỡ tin này khỏi cộng đồng"
                        >
                          <FaTrash className="me-1" /> Gỡ
                        </button>
                      </div>
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