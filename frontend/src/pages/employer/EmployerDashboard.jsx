import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaBriefcase, FaEye, FaPlusCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';

export default function EmployerDashboard() {
  const { user } = useAuth();

  return (
    <div className="employer-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fs-4 fw-bold mb-1">Bảng điều khiển tuyển dụng</h1>
          <p className="text-muted small mb-0">
            Xin chào, <strong>{user?.companyName || user?.fullName || 'Doanh nghiệp'}</strong>
          </p>
        </div>
        <Link to="/employer/post-job" className="btn btn-brand fw-semibold">
          <FaPlusCircle className="me-1" /> Đăng tin mới
        </Link>
      </div>

      {/* 3 Thẻ thống kê */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border shadow-sm p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-light rounded text-warning">
                <FaBriefcase size={24} />
              </div>
              <div>
                <div className="text-muted small">Tin tuyển dụng đang mở</div>
                <div className="fs-3 fw-bold text-dark">4</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border shadow-sm p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-light rounded text-primary">
                <FaFileAlt size={24} />
              </div>
              <div>
                <div className="text-muted small">Hồ sơ ứng tuyển đã nhận</div>
                <div className="fs-3 fw-bold text-dark">5</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border shadow-sm p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-light rounded text-success">
                <FaEye size={24} />
              </div>
              <div>
                <div className="text-muted small">Lượt xem tin tuyển dụng</div>
                <div className="fs-3 fw-bold text-dark">1.280</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hành động nhanh */}
      <div className="card border shadow-sm p-4 bg-white">
        <h2 className="fs-5 fw-bold mb-3">Lối tắt nhanh</h2>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/employer/applications" className="btn btn-outline-secondary">
            Xem hồ sơ ứng viên
          </Link>
          <Link to="/employer/post-job" className="btn btn-outline-secondary">
            Tạo bài đăng việc làm
          </Link>
          <Link to="/" className="btn btn-outline-secondary">
            Trang chủ việc làm JobNest
          </Link>
        </div>
      </div>
    </div>
  );
}
