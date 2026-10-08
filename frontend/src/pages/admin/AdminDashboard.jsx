import React, { useState } from 'react';
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
} from 'react-icons/fa';
import { showToast } from '../../components/common/ToastHost.jsx';
import { VIOLATION_TYPES } from '../../constants.js';

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  // Thống kê nhanh hệ thống
  const [stats] = useState({
    totalUsers: 1420,
    totalEmployers: 320,
    activeJobs: 2450,
    pendingJobs: 18,
    pendingCompanies: 7,
    reportedContent: 3,
  });

  // Dữ liệu mock duyệt tin tuyển dụng
  const [pendingJobs, setPendingJobs] = useState([
    {
      id: 1,
      title: 'Senior Java Backend Engineer (Spring Boot)',
      company: 'Công ty Cổ phần Công nghệ VNPT',
      date: '08/10/2026',
      salary: '25 - 35 triệu',
      status: 'PENDING',
    },
    {
      id: 2,
      title: 'Frontend Developer (ReactJS / Vite)',
      company: 'Tech Solutions Global',
      date: '08/10/2026',
      salary: '18 - 25 triệu',
      status: 'PENDING',
    },
    {
      id: 3,
      title: 'Chuyên viên Tư vấn Tài chính Doanh nghiệp',
      company: 'Ngân hàng TMCP Việt Á',
      date: '07/10/2026',
      salary: '15 - 20 triệu',
      status: 'PENDING',
    },
  ]);

  // Dữ liệu mock duyệt công ty
  const [pendingEmployers, setPendingEmployers] = useState([
    {
      id: 101,
      name: 'Tập đoàn Đầu tư & Công nghệ Hưng Thịnh',
      email: 'tuyendung@hungthinhcorp.vn',
      taxCode: '0108923412',
      date: '08/10/2026',
      status: 'PENDING',
    },
    {
      id: 102,
      name: 'Công ty Cổ phần Sáng tạo Truyền thông NextGen',
      email: 'hr@nextgenmedia.vn',
      taxCode: '0315894120',
      date: '07/10/2026',
      status: 'PENDING',
    },
  ]);

  // Dữ liệu mock danh sách tài khoản User
  const [userList] = useState([
    { id: 1, username: 'nguyenvanhung', fullName: 'Nguyễn Văn Hùng', email: 'hung.nv@gmail.com', role: 'CANDIDATE', joined: '01/10/2026', status: 'ACTIVE' },
    { id: 2, username: 'lethithu', fullName: 'Lê Thị Thu', email: 'thu.lt@gmail.com', role: 'CANDIDATE', joined: '03/10/2026', status: 'ACTIVE' },
    { id: 3, username: 'tranminhduc', fullName: 'Trần Minh Đức', email: 'duc.tm@gmail.com', role: 'CANDIDATE', joined: '04/10/2026', status: 'ACTIVE' },
    { id: 4, username: 'fpt_recruitment', fullName: 'FPT Software HR', email: 'hr@fpt.com', role: 'EMPLOYER', joined: '20/09/2026', status: 'ACTIVE' },
    { id: 5, username: 'viettel_telecom', fullName: 'Viettel Telecom', email: 'tuyendung@viettel.com.vn', role: 'EMPLOYER', joined: '15/09/2026', status: 'ACTIVE' },
  ]);

  // Dữ liệu mock báo cáo vi phạm
  const [reports, setReports] = useState([
    {
      id: 1,
      targetType: 'JOB',
      targetTitle: 'Việc nhẹ lương cao - Nhập liệu tại nhà 30tr/tháng',
      violator: 'Công ty TNHH Đầu tư Thịnh Vượng 4.0',
      reason: 'Tin tuyển dụng giả, lừa đảo hoặc thông tin sai lệch',
      reasonCode: 'FAKE_JOB',
      details: 'Yêu cầu ứng viên chuyển khoản trước 500.000đ tiền cọc tài liệu.',
      reportedBy: 'nguyenvanhung',
      date: '08/10/2026',
    },
    {
      id: 2,
      targetType: 'JOB',
      targetTitle: 'Nhân viên lễ tân (Yêu cầu nữ độc thân, dưới 23 tuổi, cao > 1m65)',
      violator: 'Quán Cafe SkyView',
      reason: 'Nội dung phân biệt giới tính, tuổi, vùng miền, ngoại hình...',
      reasonCode: 'DISCRIMINATION',
      details: 'Phân biệt giới tính và yêu cầu ngoại hình trái quy định tuyển dụng.',
      reportedBy: 'lethithu',
      date: '07/10/2026',
    },
    {
      id: 3,
      targetType: 'USER',
      targetTitle: 'Hồ sơ ứng viên: Bot spam tự động nộp hồ sơ',
      violator: 'Tài khoản: bot_spammer_99',
      reason: 'Thu thập dữ liệu hàng loạt, spam ứng viên / CV giả mạo',
      reasonCode: 'DATA_CRAWL_SPAM',
      details: 'Gửi 150 đơn ứng tuyển trong 2 phút với nội dung rác.',
      reportedBy: 'fpt_recruitment',
      date: '06/10/2026',
    },
  ]);

  const handleResolveReport = (reportId, isActionTaken) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    showToast(
      isActionTaken ? 'success' : 'info',
      isActionTaken
        ? `Đã xử lý vi phạm #${reportId}: Nội dung đã bị khóa và cảnh cáo tài khoản!`
        : `Đã bác bỏ báo cáo #${reportId}: Nội dung được xác định là hợp lệ.`
    );
  };

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
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger px-2.5 py-1.5 fw-bold">ADMIN PANEL</span>
              <span className="small text-muted fw-semibold">Hệ thống quản lý JobNest</span>
            </div>
            <h1 className="h3 fw-bold mb-0 text-dark">Bảng điều khiển Quản trị viên</h1>
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
              <FaBriefcase className="me-1" /> Duyệt tin ({pendingJobs.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${currentTab === 'companies' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setSearchParams({ tab: 'companies' })}
            >
              <FaBuilding className="me-1" /> Duyệt NTD ({pendingEmployers.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${currentTab === 'users' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setSearchParams({ tab: 'users' })}
            >
              <FaUsers className="me-1" /> Quản lý User
            </button>
            <button
              type="button"
              className={`btn btn-sm ${currentTab === 'reports' ? 'btn-danger text-white' : 'btn-light text-danger'}`}
              onClick={() => setSearchParams({ tab: 'reports' })}
            >
              <FaShieldAlt className="me-1" /> Báo cáo vi phạm ({reports.length})
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
                  <small className="text-success mt-1 d-block">+12% so với tháng trước</small>
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
                  <small className="text-muted mt-1 d-block">{stats.pendingCompanies} công ty chờ duyệt</small>
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
                  <small className="text-warning mt-1 d-block">{pendingJobs.length} tin cần duyệt</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-semibold">Báo cáo vi phạm / CV</span>
                    <span className="p-2 rounded-circle bg-danger-subtle text-danger">
                      <FaShieldAlt size={16} />
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0 text-danger">{stats.reportedContent}</h3>
                  <small className="text-danger mt-1 d-block">Cần xử lý kịp thời</small>
                </div>
              </div>
            </div>

            {/* Bảng việc cần duyệt nhanh */}
            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
              <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
                <FaBriefcase className="text-primary" /> Tin tuyển dụng chờ duyệt gần đây
              </h2>
              {pendingJobs.length === 0 ? (
                <div className="p-4 text-center text-muted">Không còn tin tuyển dụng nào chờ duyệt.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Vị trí tuyển dụng</th>
                        <th>Công ty</th>
                        <th>Mức lương</th>
                        <th>Ngày gửi</th>
                        <th className="text-end">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingJobs.map((job) => (
                        <tr key={job.id}>
                          <td className="fw-bold">{job.title}</td>
                          <td>{job.company}</td>
                          <td><span className="badge bg-warning-subtle text-dark">{job.salary}</span></td>
                          <td className="small text-muted">{job.date}</td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleApproveJob(job.id, true)}
                            >
                              <FaCheckCircle className="me-1" /> Duyệt
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleApproveJob(job.id, false)}
                            >
                              <FaTimesCircle className="me-1" /> Từ chối
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

        {/* 2. KHỐI DUYỆT TIN TUYỂN DỤNG */}
        {currentTab === 'jobs' && (
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h2 className="h5 fw-bold mb-3">Danh sách tin tuyển dụng chờ phê duyệt</h2>
            {pendingJobs.length === 0 ? (
              <div className="p-5 text-center text-muted">Hiện tại không có tin nào chờ duyệt.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Tiêu đề tuyển dụng</th>
                      <th>Công ty</th>
                      <th>Mức lương</th>
                      <th>Ngày nộp</th>
                      <th className="text-end">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="fw-bold">{job.title}</td>
                        <td>{job.company}</td>
                        <td><span className="badge bg-warning-subtle text-dark">{job.salary}</span></td>
                        <td>{job.date}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleApproveJob(job.id, true)}
                          >
                            <FaCheckCircle className="me-1" /> Duyệt tin
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleApproveJob(job.id, false)}
                          >
                            <FaTimesCircle className="me-1" /> Từ chối
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

        {/* 3. KHỐI DUYỆT DOANH NGHIỆP / EMPLOYER */}
        {currentTab === 'companies' && (
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h2 className="h5 fw-bold mb-3">Hồ sơ doanh nghiệp / Nhà tuyển dụng chờ phê duyệt</h2>
            {pendingEmployers.length === 0 ? (
              <div className="p-5 text-center text-muted">Không có hồ sơ doanh nghiệp nào đang chờ duyệt.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Tên công ty / Doanh nghiệp</th>
                      <th>Email liên hệ</th>
                      <th>Mã số thuế</th>
                      <th>Ngày gửi</th>
                      <th className="text-end">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingEmployers.map((emp) => (
                      <tr key={emp.id}>
                        <td className="fw-bold">{emp.name}</td>
                        <td>{emp.email}</td>
                        <td><code>{emp.taxCode}</code></td>
                        <td>{emp.date}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleApproveCompany(emp.id, true)}
                          >
                            <FaCheckCircle className="me-1" /> Xác thực
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleApproveCompany(emp.id, false)}
                          >
                            <FaTimesCircle className="me-1" /> Từ chối
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

        {/* 4. KHỐI QUẢN LÝ TÀI KHOẢN (USER & EMPLOYER) */}
        {currentTab === 'users' && (
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h2 className="h5 fw-bold mb-0">Quản lý Tài khoản (User & Nhà tuyển dụng)</h2>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Tìm kiếm tài khoản..."
                  style={{ width: '220px' }}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Họ và tên</th>
                    <th>Tài khoản</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Ngày tham gia</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-bold">{u.fullName}</td>
                      <td><code>{u.username}</code></td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'EMPLOYER' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                          {u.role === 'EMPLOYER' ? 'Nhà tuyển dụng' : 'Người tìm việc'}
                        </span>
                      </td>
                      <td className="small text-muted">{u.joined}</td>
                      <td>
                        <span className="badge bg-success-subtle text-success">Hoạt động</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. KHỐI GIÁM SÁT VI PHẠM & XỬ LÝ (9 TIÊU CHÍ AN TOÀN HỆ THỐNG) */}
        {currentTab === 'reports' && (
          <div>
            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h2 className="h5 fw-bold mb-1 text-danger d-flex align-items-center gap-2">
                    <FaShieldAlt /> Danh sách nội dung bị báo cáo vi phạm
                  </h2>
                  <p className="small text-muted mb-0">
                    Hệ thống kiểm duyệt theo 9 tiêu chuẩn cộng đồng và quy định pháp luật lao động.
                  </p>
                </div>
                <span className="badge bg-danger-subtle text-danger fs-6 px-3 py-2">
                  {reports.length} vụ việc chờ xử lý
                </span>
              </div>

              {reports.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <FaCheckCircle size={36} className="text-success mb-2 d-block mx-auto" />
                  Hệ thống an toàn! Không có nội dung vi phạm nào chưa được xử lý.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Đối tượng bị báo cáo</th>
                        <th>Bên vi phạm</th>
                        <th>Hành vi vi phạm</th>
                        <th>Bằng chứng / Chi tiết</th>
                        <th>Người tố cáo</th>
                        <th className="text-end">Xử lý</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((r) => (
                        <tr key={r.id}>
                          <td>
                            <span className={`badge me-2 ${r.targetType === 'JOB' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                              {r.targetType === 'JOB' ? 'Tin tuyển dụng' : 'Tài khoản User'}
                            </span>
                            <div className="fw-bold mt-1">{r.targetTitle}</div>
                          </td>
                          <td>
                            <code>{r.violator}</code>
                          </td>
                          <td>
                            <span className="badge bg-danger-subtle text-danger text-wrap text-start" style={{ maxWidth: '200px' }}>
                              🚫 {r.reason}
                            </span>
                          </td>
                          <td className="small text-muted" style={{ maxWidth: '240px' }}>
                            {r.details}
                          </td>
                          <td className="small">
                            <div><code>{r.reportedBy}</code></div>
                            <span className="text-muted">{r.date}</span>
                          </td>
                          <td className="text-end text-nowrap">
                            <button
                              type="button"
                              className="btn btn-sm btn-danger me-2"
                              onClick={() => handleResolveReport(r.id, true)}
                            >
                              Khóa vi phạm
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleResolveReport(r.id, false)}
                            >
                              Bỏ qua
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Khung quy chuẩn 9 hành vi vi phạm chuẩn TopCV */}
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
