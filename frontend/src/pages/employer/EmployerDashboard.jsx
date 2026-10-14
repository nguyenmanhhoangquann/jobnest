import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFileAlt,
  FaBriefcase,
  FaEye,
  FaPlusCircle,
  FaCheckCircle,
  FaArrowRight,
  FaMagic,
  FaBuilding,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import jobApi from '../../api/jobApi.js';
import applicationApi from '../../api/applicationApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { Spinner } from '../../components/common/Loading.jsx';
import aiBannerBg from '../../assets/ai-assistant-bg.jpg';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobApi.getMyJobs(),
      applicationApi.getReceivedApplications({ size: 10 }),
    ])
      .then(([jobsRes, appsRes]) => {
        const myJobs = Array.isArray(jobsRes) ? jobsRes : jobsRes?.content || [];
        setJobs(myJobs);
        const appsList = Array.isArray(appsRes) ? appsRes : appsRes?.content || [];
        setApplications(appsList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pendingAppsCount = applications.filter((a) => a.status === 'PENDING').length;
  const acceptedAppsCount = applications.filter((a) => a.status === 'ACCEPTED').length;

  return (
    <div className="employer-dashboard">
      {/* 1. Header Trang Tổng quan */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-light text-dark border px-2 py-0.5 fw-semibold" style={{ fontSize: '11px' }}>
              <FaBuilding className="me-1 text-secondary" size={10} />
              {user?.companyName || user?.fullName || 'Doanh nghiệp'}
            </span>
            <span className="small text-muted">• Cập nhật thời gian thực</span>
          </div>
          <h1 className="h4 fw-bold mb-0 text-dark">Tổng quan hoạt động tuyển dụng</h1>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link to="/employer/post-job" className="btn btn-sm btn-brand fw-semibold d-inline-flex align-items-center gap-1.5">
            <FaPlusCircle size={12} />
            <span>Đăng tin mới</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner size="lg" className="my-4 text-warning" />
          <p className="text-muted">Đang tải dữ liệu tuyển dụng...</p>
        </div>
      ) : (
        <>
          {/* 2. Bốn chỉ số KPI đồng bộ phong cách tối giản */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border shadow-sm rounded-3 p-3 bg-white h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="text-muted small fw-medium">Tin đang mở</span>
                  <span className="p-1.5 bg-light rounded text-secondary">
                    <FaBriefcase size={14} />
                  </span>
                </div>
                <div className="fs-3 fw-bold text-dark mb-1">{jobs.length}</div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                  <span className="small text-muted" style={{ fontSize: '11.5px' }}>Đang hoạt động</span>
                  <Link to="/employer/jobs" className="small text-decoration-none fw-medium text-dark">
                    Quản lý →
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border shadow-sm rounded-3 p-3 bg-white h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="text-muted small fw-medium">Hồ sơ đã nhận</span>
                  <span className="p-1.5 bg-light rounded text-secondary">
                    <FaFileAlt size={14} />
                  </span>
                </div>
                <div className="fs-3 fw-bold text-dark mb-1">{applications.length}</div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                  <span className="small text-warning-emphasis fw-medium" style={{ fontSize: '11.5px' }}>
                    {pendingAppsCount} chờ duyệt
                  </span>
                  <Link to="/employer/applications" className="small text-decoration-none fw-medium text-dark">
                    Xem CV →
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border shadow-sm rounded-3 p-3 bg-white h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="text-muted small fw-medium">Ứng viên phù hợp</span>
                  <span className="p-1.5 bg-light rounded text-secondary">
                    <FaCheckCircle size={14} />
                  </span>
                </div>
                <div className="fs-3 fw-bold text-success mb-1">{acceptedAppsCount}</div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                  <span className="small text-muted" style={{ fontSize: '11.5px' }}>Đã phê duyệt</span>
                  <Link to="/employer/applications?status=ACCEPTED" className="small text-decoration-none fw-medium text-dark">
                    Danh sách →
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border shadow-sm rounded-3 p-3 bg-white h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="text-muted small fw-medium">Lượt xem tin</span>
                  <span className="p-1.5 bg-light rounded text-secondary">
                    <FaEye size={14} />
                  </span>
                </div>
                <div className="fs-3 fw-bold text-dark mb-1">1.450</div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                  <span className="small text-muted" style={{ fontSize: '11.5px' }}>30 ngày qua</span>
                  <span className="badge bg-light text-secondary border fw-normal" style={{ fontSize: '10.5px' }}>
                    Ổn định
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Khối nội dung chính: 2 Cột to ngang nhau (50% - 50%) */}
          <div className="row g-4 align-items-stretch">
            {/* Cột trái (6/12): Bảng hồ sơ ứng tuyển mới nhất */}
            <div className="col-12 col-lg-6">
              <div className="card border shadow-sm rounded-3 bg-white h-100 overflow-hidden d-flex flex-column">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                  <div>
                    <h2 className="h6 fw-bold mb-0 text-dark">Hồ sơ ứng tuyển gần đây</h2>
                    <small className="text-muted" style={{ fontSize: '12px' }}>
                      Ứng viên nộp CV trực tuyến vào các vị trí đang mở
                    </small>
                  </div>
                  <Link
                    to="/employer/applications"
                    className="small fw-semibold text-decoration-none text-dark d-inline-flex align-items-center gap-1"
                  >
                    Xem tất cả ({applications.length}) <FaArrowRight size={10} />
                  </Link>
                </div>

                <div className="table-responsive flex-grow-1">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-muted">
                      <tr>
                        <th scope="col" className="ps-3 py-2.5">Ứng viên</th>
                        <th scope="col" className="py-2.5">Vị trí</th>
                        <th scope="col" className="py-2.5">Ngày nộp</th>
                        <th scope="col" className="py-2.5">Trạng thái</th>
                        <th scope="col" className="text-end pe-3 py-2.5">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted small">
                            Chưa có hồ sơ nào nộp gần đây.
                          </td>
                        </tr>
                      ) : (
                        applications.slice(0, 5).map((app) => {
                          const candidate = app.candidate || {};
                          return (
                            <tr key={app.id}>
                              <td className="ps-3 py-2.5">
                                <Link
                                  to={`/employer/applications?appId=${app.id}`}
                                  className="fw-semibold text-dark small text-decoration-none"
                                  title={`Xem chi tiết hồ sơ ${candidate.fullName}`}
                                >
                                  {candidate.fullName || 'Ứng viên'}
                                </Link>
                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                  {candidate.email}
                                </div>
                              </td>
                              <td className="py-2.5">
                                <span className="small text-dark text-truncate d-block" style={{ maxWidth: '140px' }}>
                                  {app.jobTitle}
                                </span>
                              </td>
                              <td className="py-2.5 text-muted small" style={{ fontSize: '12px' }}>
                                {app.appliedAt ? (app.appliedAt.includes('T') ? app.appliedAt.split('T')[0] : app.appliedAt) : '26/10/2026'}
                              </td>
                              <td className="py-2.5">
                                <StatusBadge status={app.status || 'PENDING'} />
                              </td>
                              <td className="text-end pe-3 py-2.5">
                                <Link
                                  to={`/employer/applications?appId=${app.id}`}
                                  className="btn btn-sm btn-light border py-1 px-2.5 small fw-medium text-dark"
                                  style={{ fontSize: '11.5px' }}
                                  title={`Xem chi tiết hồ sơ ${candidate.fullName}`}
                                >
                                  Chi tiết
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Cột phải (6/12): Gợi ý JD với AI to ngang với div bên trái, background đẹp không logo Gemini */}
            <div className="col-12 col-lg-6">
              <div
                className="card border shadow-sm rounded-3 p-4 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden"
                style={{
                  background: `linear-gradient(110deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.80) 48%, rgba(255, 255, 255, 0.20) 100%), url(${aiBannerBg}) center right / cover no-repeat`,
                  borderColor: '#FDE68A',
                  minHeight: '380px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span
                      className="badge text-dark fw-bold px-2.5 py-1 shadow-sm"
                      style={{ backgroundColor: '#FBC725', fontSize: '11px' }}
                    >
                      <FaMagic className="me-1" size={11} /> TRỢ LÝ TUYỂN DỤNG AI
                    </span>
                    <span
                      className="small fw-semibold px-2 py-0.5 rounded bg-white bg-opacity-90 border shadow-sm"
                      style={{ fontSize: '11.5px', color: '#111827' }}
                    >
                      Chuẩn hóa tuyển dụng thông minh
                    </span>
                  </div>

                  <h2 className="h4 fw-bold text-dark mb-2">
                    Gợi ý mô tả công việc (JD)
                  </h2>

                  <p
                    className="small fw-medium mb-3"
                    style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#111827' }}
                  >
                    Tự động tạo bản mô tả công việc chuyên nghiệp, chuẩn hóa yêu cầu kỹ năng và quyền lợi chỉ trong 3 giây để tiếp cận đúng ứng viên tiềm năng trên JobNest.
                  </p>

                  <div className="d-flex flex-column gap-2 mb-4">
                    <div className="p-2.5 rounded bg-white bg-opacity-80 border small d-flex align-items-center gap-2 shadow-sm">
                      <span className="text-warning fw-bold fs-6">⚡</span>
                      <span className="text-dark fw-medium">Tạo nhanh JD hoàn chỉnh từ chức danh công việc</span>
                    </div>
                    <div className="p-2.5 rounded bg-white bg-opacity-80 border small d-flex align-items-center gap-2 shadow-sm">
                      <span className="text-success fw-bold fs-6">🎯</span>
                      <span className="text-dark fw-medium">Tự động gợi ý từ khóa kỹ năng công nghệ chuẩn ngành</span>
                    </div>
                    <div className="p-2.5 rounded bg-white bg-opacity-80 border small d-flex align-items-center gap-2 shadow-sm">
                      <span className="text-primary fw-bold fs-6">📈</span>
                      <span className="text-dark fw-medium">Thu hút ứng viên tiềm năng nộp CV nhanh hơn</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/employer/post-job"
                    className="btn btn-brand fw-bold px-4 py-2.5 shadow-sm d-inline-flex align-items-center gap-2"
                  >
                    <FaMagic size={14} />
                    <span>Tạo tin tuyển dụng với AI ngay</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}