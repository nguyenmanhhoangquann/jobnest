import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaTrash,
} from 'react-icons/fa';
import { showToast } from '../../components/common/ToastHost.jsx';
import { VIOLATION_TYPES } from '../../constants.js';
import reportApi from '../../api/reportApi.js';
import adminApi from '../../api/adminApi.js';

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  // Thống kê thực tế từ Backend
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployers: 0,
    activeJobs: 0,
    pendingJobs: 0,
    pendingCompanies: 0,
    reportedContent: 0,
  });

  const [userList, setUserList] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Dữ liệu thực tế từ Backend
  const [adminJobs, setAdminJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState('');
  const [adminCompanies, setAdminCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState('');

  // Quản lý & Lịch sử báo cáo vi phạm qua reportApi
  const [reports, setReports] = useState([]);
  const [reportFilter, setReportFilter] = useState('ALL');

  useEffect(() => {
    reportApi.getReports().then((data) => setReports(data || []));
    adminApi.getStats().then((data) => {
      if (data) setStats((prev) => ({ ...prev, ...data }));
    }).catch(() => {});
    adminApi.getUsers().then((data) => {
      if (Array.isArray(data)) setUserList(data);
    }).catch(() => {});
    adminApi.getAdminJobs().then((data) => {
      if (Array.isArray(data)) setAdminJobs(data);
    }).catch(() => {});
    adminApi.getCompanies().then((data) => {
      if (Array.isArray(data)) setAdminCompanies(data);
    }).catch(() => {});
  }, []);

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}" không? Thao tác này không thể hoàn tác.`)) {
      return;
    }
    try {
      await adminApi.deleteUser(userId);
      setUserList((prev) => prev.filter((u) => u.id !== userId));
      setStats((prev) => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
      showToast('success', `Đã xóa tài khoản "${username}" thành công.`);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Không thể xóa tài khoản này.');
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Bạn có chắc muốn gỡ bài tuyển dụng "${title || ''}" khỏi hệ thống không?`)) {
      return;
    }
    try {
      await adminApi.deleteJob(jobId);
      setAdminJobs((prev) => prev.filter((j) => j.id !== jobId));
      setStats((prev) => ({ ...prev, activeJobs: Math.max(0, prev.activeJobs - 1) }));
      showToast('success', `Đã gỡ bài đăng #${jobId} thành công.`);
    } catch {
      showToast('error', 'Không thể gỡ bài đăng lúc này.');
    }
  };

  const filteredJobs = useMemo(() => {
    if (!jobSearch.trim()) return adminJobs;
    const kw = jobSearch.toLowerCase();
    return adminJobs.filter((j) =>
      (j.title || '').toLowerCase().includes(kw) ||
      (j.company?.name || '').toLowerCase().includes(kw) ||
      (j.location || '').toLowerCase().includes(kw)
    );
  }, [adminJobs, jobSearch]);

  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return adminCompanies;
    const kw = companySearch.toLowerCase();
    return adminCompanies.filter((c) =>
      (c.name || '').toLowerCase().includes(kw) ||
      (c.location || '').toLowerCase().includes(kw)
    );
  }, [adminCompanies, companySearch]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return userList;
    const kw = userSearch.toLowerCase();
    return userList.filter((u) =>
      (u.fullName || '').toLowerCase().includes(kw) ||
      (u.username || '').toLowerCase().includes(kw) ||
      (u.email || '').toLowerCase().includes(kw) ||
      (u.companyName || '').toLowerCase().includes(kw)
    );
  }, [userList, userSearch]);

  const handleUpdateReportStatus = async (reportId, newStatus, message) => {
    const updated = await reportApi.updateStatus(reportId, newStatus);
    setReports(updated);
    showToast('success', message);
  };

  const targetReportCounts = useMemo(() => {
    return reports.reduce((acc, r) => {
      const key = `${r.targetType}_${r.targetId}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (reportFilter === 'ALL') return reports;
    return reports.filter((r) => r.status === reportFilter);
  }, [reports, reportFilter]);

  const pendingReportsCount = useMemo(() => {
    return reports.filter((r) => r.status === 'PENDING').length;
  }, [reports]);

  // Xử lý duyệt hoặc từ chối tin tuyển dụng
  const handleApproveJob = (jobId, approve) => {
    setPendingJobs((prev) => prev.filter((j) => j.id !== jobId));
    showToast(
      approve ? 'success' : 'info',
      approve ? `Đã phê duyệt tin tuyển dụng #${jobId}` : `Đã từ chối tin tuyển dụng #${jobId}`
    );
  };

  // Xử lý duyệt công ty
  const handleApproveCompany = (companyId, approve) => {
    setPendingEmployers((prev) => prev.filter((c) => c.id !== companyId));
    showToast(
      approve ? 'success' : 'info',
      approve ? `Đã xác thực hồ sơ công ty #${companyId}` : `Đã từ chối hồ sơ công ty #${companyId}`
    );
  };

  return (
    <div className="admin-dashboard-page py-4">
      <div className="container-app">
        {/* Header trang Quản trị */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <Link to="/" title="Về trang chủ JobNest">
              <img
                src="/images/jobnest-logo.png"
                alt="JobNest"
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-danger px-2.5 py-1 fw-bold">ADMIN PANEL</span>
                <span className="small text-muted fw-semibold">Hệ thống quản lý JobNest</span>
              </div>
              <h1 className="h4 fw-bold mb-0 text-dark">Bảng điều khiển Quản trị viên</h1>
            </div>
          </div>

          {/* Dải Tab chuyển đổi nhanh */}
          <div className="btn-group shadow-sm bg-white p-1 rounded-3 border">
            <button
              type="button"
              className={`btn btn-sm ${currentTab === 'overview' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setSearchParams({ tab: 'overview' })}
            >
              <FaChartLine className="me-1" /> Thống kê
            </button>
            <button
              type="button"
              className={`btn btn-sm ${currentTab === 'jobs' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setSearchParams({ tab: 'jobs' })}
            >
              <FaBriefcase className="me-1" /> Quản lý tin ({adminJobs.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${currentTab === 'companies' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setSearchParams({ tab: 'companies' })}
            >
              <FaBuilding className="me-1" /> Doanh nghiệp ({adminCompanies.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${currentTab === 'users' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setSearchParams({ tab: 'users' })}
            >
              <FaUsers className="me-1" /> Quản lý User ({userList.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${currentTab === 'reports' ? 'btn-danger text-white' : 'btn-light text-danger'}`}
              onClick={() => setSearchParams({ tab: 'reports' })}
            >
              <FaShieldAlt className="me-1" /> Báo cáo ({pendingReportsCount > 0 ? `${pendingReportsCount} mới` : reports.length})
            </button>
          </div>
        </div>

        {/* 1. KHỐI THỐNG KÊ (OVERVIEW) */}
        {(currentTab === 'overview' || !currentTab) && (
          <div>
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-semibold">Người tìm việc (User)</span>
                    <span className="p-2 rounded-circle bg-primary-subtle text-primary">
                      <FaUsers size={16} />
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0">{stats.totalUsers.toLocaleString('vi-VN')}</h3>
                  <small className="text-success mt-1 d-block">{userList.length} tài khoản trong hệ thống</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-semibold">Nhà tuyển dụng (Employer)</span>
                    <span className="p-2 rounded-circle bg-warning-subtle text-warning-emphasis">
                      <FaBuilding size={16} />
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0">{stats.totalEmployers.toLocaleString('vi-VN')}</h3>
                  <small className="text-muted mt-1 d-block">{adminCompanies.length} đối tác doanh nghiệp</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-semibold">Tin tuyển dụng hoạt động</span>
                    <span className="p-2 rounded-circle bg-success-subtle text-success">
                      <FaBriefcase size={16} />
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0">{stats.activeJobs.toLocaleString('vi-VN')}</h3>
                  <small className="text-success mt-1 d-block">{adminJobs.length} tin đăng đang mở</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-semibold">Báo cáo vi phạm</span>
                    <span className="p-2 rounded-circle bg-danger-subtle text-danger">
                      <FaShieldAlt size={16} />
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0 text-danger">{pendingReportsCount}</h3>
                  <small className="text-danger mt-1 d-block">{reports.length} bản ghi lịch sử</small>
                </div>
              </div>
            </div>

            {/* Bảng việc làm mới nhất */}
            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0 d-flex align-items-center gap-2">
                  <FaBriefcase className="text-primary" /> Tin tuyển dụng mới nhất trong hệ thống
                </h2>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none"
                  onClick={() => setSearchParams({ tab: 'jobs' })}
                >
                  Xem tất cả ({adminJobs.length})
                </button>
              </div>

              {adminJobs.length === 0 ? (
                <div className="p-4 text-center text-muted">Đang tải tin tuyển dụng...</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Mã</th>
                        <th>Vị trí tuyển dụng</th>
                        <th>Doanh nghiệp</th>
                        <th>Mức lương</th>
                        <th>Địa điểm</th>
                        <th className="text-end">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminJobs.slice(0, 5).map((job) => (
                        <tr key={job.id}>
                          <td><code>#{job.id}</code></td>
                          <td className="fw-bold text-dark">{job.title}</td>
                          <td>{job.company?.name || 'Doanh nghiệp'}</td>
                          <td><span className="badge bg-warning-subtle text-dark">{job.salaryText || 'Thỏa thuận'}</span></td>
                          <td className="small text-muted">{job.location}</td>
                          <td className="text-end text-nowrap">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteJob(job.id, job.title)}
                              title="Gỡ tin này khỏi hệ thống"
                              style={{ fontSize: '11px' }}
                            >
                              <FaTrash size={10} className="me-1" /> Gỡ tin
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. KHỐI QUẢN LÝ TIN TUYỂN DỤNG */}
        {currentTab === 'jobs' && (
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h2 className="h5 fw-bold mb-1">Quản lý Tin tuyển dụng toàn hệ thống</h2>
                <small className="text-muted">Tổng cộng {adminJobs.length} tin tuyển dụng thực tế</small>
              </div>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Tìm theo tiêu đề, công ty, địa điểm..."
                  style={{ width: '280px' }}
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="p-5 text-center text-muted">Không tìm thấy tin tuyển dụng nào phù hợp.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Mã</th>
                      <th>Tiêu đề tuyển dụng</th>
                      <th>Công ty</th>
                      <th>Mức lương</th>
                      <th>Khu vực</th>
                      <th className="text-end">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.slice(0, 50).map((job) => (
                      <tr key={job.id}>
                        <td><code>#{job.id}</code></td>
                        <td className="fw-bold text-dark">{job.title}</td>
                        <td className="small text-muted">{job.company?.name || 'Doanh nghiệp'}</td>
                        <td><span className="badge bg-warning-subtle text-dark">{job.salaryText || 'Thỏa thuận'}</span></td>
                        <td className="small">{job.location}</td>
                        <td className="text-end text-nowrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            title="Gỡ tin này khỏi hệ thống"
                            style={{ fontSize: '11px' }}
                          >
                            <FaTrash size={10} /> Gỡ bài
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. KHỐI DOANH NGHIỆP & ĐỐI TÁC */}
        {currentTab === 'companies' && (
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h2 className="h5 fw-bold mb-1">Doanh nghiệp & Đối tác tuyển dụng</h2>
                <small className="text-muted">Tổng cộng {adminCompanies.length} doanh nghiệp đối tác</small>
              </div>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Tìm theo tên công ty, địa điểm..."
                  style={{ width: '280px' }}
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                />
              </div>
            </div>

            {filteredCompanies.length === 0 ? (
              <div className="p-5 text-center text-muted">Không tìm thấy doanh nghiệp nào phù hợp.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Logo</th>
                      <th>Tên công ty / Doanh nghiệp</th>
                      <th>Địa điểm</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.slice(0, 50).map((comp) => (
                      <tr key={comp.id}>
                        <td style={{ width: '60px' }}>
                          <img
                            src={comp.logoUrl || '/images/companies/fpt.svg'}
                            alt={comp.name}
                            style={{ height: '28px', maxWidth: '50px', objectFit: 'contain' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </td>
                        <td className="fw-bold text-dark">{comp.name}</td>
                        <td className="small text-muted">{comp.location || 'Toàn quốc'}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1">
                            <FaCheckCircle size={10} /> Đã xác thực
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. KHỐI QUẢN LÝ TÀI KHOẢN (USER & EMPLOYER) */}
        {currentTab === 'users' && (
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h2 className="h5 fw-bold mb-1">Quản lý Tài khoản (User, NTD & Quản trị)</h2>
                <small className="text-muted">Tổng cộng {userList.length} tài khoản trong cơ sở dữ liệu hệ thống</small>
              </div>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Tìm theo tên, email, username..."
                  style={{ width: '260px' }}
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Họ và tên / Doanh nghiệp</th>
                    <th>Tài khoản</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th className="text-end">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        Không tìm thấy tài khoản nào phù hợp
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="fw-bold text-dark">{u.fullName || u.displayName || 'Người dùng'}</div>
                          {u.companyName && (
                            <small className="text-muted d-block">{u.companyName}</small>
                          )}
                        </td>
                        <td><code>{u.username}</code></td>
                        <td className="small">{u.email || 'Chưa cập nhật'}</td>
                        <td>
                          <span
                            className={`badge ${
                              u.role === 'ADMIN'
                                ? 'bg-danger text-white'
                                : u.role === 'EMPLOYER'
                                ? 'bg-warning text-dark'
                                : 'bg-primary text-white'
                            }`}
                          >
                            {u.role === 'ADMIN'
                              ? 'Quản trị viên'
                              : u.role === 'EMPLOYER'
                              ? 'Nhà tuyển dụng'
                              : 'Người tìm việc'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success">Hoạt động</span>
                        </td>
                        <td className="text-end">
                          {u.role !== 'ADMIN' ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                              onClick={() => handleDeleteUser(u.id, u.username)}
                              title="Xóa tài khoản này khỏi hệ thống"
                              style={{ fontSize: '11px' }}
                            >
                              <FaTrash size={10} /> Xóa
                            </button>
                          ) : (
                            <span className="badge bg-light text-muted border">Bảo vệ</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. KHỐI QUẢN LÝ & LỊCH SỬ BÁO CÁO VI PHẠM */}
        {currentTab === 'reports' && (
          <div>
            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h2 className="h5 fw-bold mb-1 text-danger d-flex align-items-center gap-2">
                    <FaShieldAlt /> Lịch sử & Quản lý báo cáo vi phạm
                  </h2>
                  <p className="small text-muted mb-0">
                    Lưu trữ toàn bộ báo cáo từ người dùng. Luồng xử lý: PENDING → REVIEWING → RESOLVED / REJECTED.
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <span className="badge bg-warning-subtle text-warning-emphasis fs-6 px-3 py-2">
                    {pendingReportsCount} chờ xử lý
                  </span>
                  <span className="badge bg-secondary-subtle text-secondary fs-6 px-3 py-2">
                    {reports.length} tổng số
                  </span>
                </div>
              </div>

              {/* Bộ lọc trạng thái */}
              <div className="d-flex gap-2 mb-3 flex-wrap">
                {[
                  { key: 'ALL', label: `Tất cả (${reports.length})` },
                  { key: 'PENDING', label: `Chờ xử lý (${reports.filter((r) => r.status === 'PENDING').length})` },
                  { key: 'REVIEWING', label: `Đang xem xét (${reports.filter((r) => r.status === 'REVIEWING').length})` },
                  { key: 'RESOLVED', label: `Đã xử lý / Vi phạm (${reports.filter((r) => r.status === 'RESOLVED').length})` },
                  { key: 'REJECTED', label: `Đã bác bỏ / Hợp lệ (${reports.filter((r) => r.status === 'REJECTED').length})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    className={`btn btn-sm ${reportFilter === tab.key ? 'btn-danger' : 'btn-outline-secondary'}`}
                    onClick={() => setReportFilter(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {filteredReports.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <FaCheckCircle size={36} className="text-success mb-2 d-block mx-auto" />
                  Không có báo cáo nào ở trạng thái này.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Mã</th>
                        <th>Đối tượng bị báo cáo</th>
                        <th>Bên bị tố cáo</th>
                        <th>Lý do & Bằng chứng</th>
                        <th>Người báo cáo</th>
                        <th>Trạng thái</th>
                        <th className="text-end">Hành động xử lý</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((r) => {
                        const targetKey = `${r.targetType}_${r.targetId}`;
                        const count = targetReportCounts[targetKey] || 1;
                        return (
                          <tr key={r.id}>
                            <td className="text-muted small">#{r.id}</td>
                            <td>
                              <div className="d-flex align-items-center gap-1 flex-wrap">
                                <span className={`badge ${r.targetType === 'JOB' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                                  {r.targetType === 'JOB' ? `Job #${r.targetId}` : `User #${r.targetId}`}
                                </span>
                                {count > 1 && (
                                  <span className="badge bg-danger-subtle text-danger" title={`${count} lượt tố cáo cùng trỏ vào đối tượng này`}>
                                    {count} lượt báo cáo
                                  </span>
                                )}
                              </div>
                              <div className="fw-bold mt-1 text-dark" style={{ maxWidth: '220px' }}>
                                {r.targetTitle}
                              </div>
                            </td>
                            <td>
                              <code>{r.companyName || r.violator || 'N/A'}</code>
                            </td>
                            <td style={{ maxWidth: '240px' }}>
                              <div className="badge bg-danger-subtle text-danger text-wrap text-start mb-1">
                                {r.reasonLabel || r.reason}
                              </div>
                              {(r.description || r.details) && (
                                <div className="small text-muted text-break">
                                  {r.description || r.details}
                                </div>
                              )}
                              {r.adminNote && (
                                <div className="small text-info mt-1 fst-italic">
                                  Ghi chú: {r.adminNote}
                                </div>
                              )}
                            </td>
                            <td className="small">
                              <div><strong>{r.reporterName || r.reportedBy}</strong></div>
                              {r.reporterUsername && <div className="text-muted">@{r.reporterUsername}</div>}
                              <span className="text-muted" style={{ fontSize: '11px' }}>{r.createdAt || r.date}</span>
                            </td>
                            <td>
                              {r.status === 'PENDING' && <span className="badge bg-warning text-dark">Chờ xử lý</span>}
                              {r.status === 'REVIEWING' && <span className="badge bg-info text-dark">Đang xem xét</span>}
                              {r.status === 'RESOLVED' && <span className="badge bg-danger">Đã xử lý (Vi phạm)</span>}
                              {r.status === 'REJECTED' && <span className="badge bg-secondary">Đã bác bỏ (Hợp lệ)</span>}
                            </td>
                            <td className="text-end text-nowrap">
                              {r.status === 'PENDING' && (
                                <div className="btn-group btn-group-sm">
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleUpdateReportStatus(r.id, 'REVIEWING', `Chuyển #${r.id} sang đang xem xét`)}
                                  >
                                    Xem xét
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => handleUpdateReportStatus(r.id, 'RESOLVED', `Xác nhận vi phạm #${r.id}: Khóa nội dung`)}
                                  >
                                    Khóa vi phạm
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleUpdateReportStatus(r.id, 'REJECTED', `Bác bỏ báo cáo #${r.id}`)}
                                  >
                                    Bác bỏ
                                  </button>
                                </div>
                              )}
                              {r.status === 'REVIEWING' && (
                                <div className="btn-group btn-group-sm">
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleUpdateReportStatus(r.id, 'RESOLVED', `Xác nhận vi phạm #${r.id}: Khóa nội dung`)}
                                  >
                                    Khóa vi phạm
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleUpdateReportStatus(r.id, 'REJECTED', `Bác bỏ báo cáo #${r.id}`)}
                                  >
                                    Bác bỏ
                                  </button>
                                </div>
                              )}
                              {(r.status === 'RESOLVED' || r.status === 'REJECTED') && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handleUpdateReportStatus(r.id, 'REVIEWING', `Mở lại kiểm duyệt #${r.id}`)}
                                >
                                  Mở lại
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Khung quy chuẩn 9 hành vi vi phạm tiêu chuẩn cộng đồng */}
            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
              <h3 className="h6 fw-bold mb-3 text-dark">
                📋 9 Quy chuẩn đánh giá vi phạm hệ thống JobNest
              </h3>
              <div className="row g-2">
                {VIOLATION_TYPES.map((v, i) => (
                  <div key={v.id} className="col-12 col-md-6 col-lg-4">
                    <div className="p-2.5 rounded bg-light border small d-flex align-items-center gap-2">
                      <span className="text-danger fw-bold">{i + 1}.</span>
                      <span className="text-secondary">{v.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
