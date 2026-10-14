import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  FaPlusCircle,
  FaFileAlt,
  FaBriefcase,
  FaSignOutAlt,
  FaHome,
  FaBuilding,
  FaChartPie,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import ZaloContactButton from '../common/ZaloContactButton.jsx';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar trái cố định theo viewport khi cuộn trang */}
      <aside
        className="dashboard-sidebar d-flex flex-column justify-content-between p-3 border-end bg-white"
        style={{
          width: '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
          overflowY: 'auto',
          zIndex: 1020,
        }}
      >
        <div>
          {/* Logo & Role Badge */}
          <div className="mb-4 pb-3 border-bottom">
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 mb-2">
              <img
                src="/images/jobnest-logo.png"
                alt="JobNest"
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <span className="badge bg-warning text-dark py-1 px-2 fw-semibold">
              Nhà tuyển dụng
            </span>
          </div>

          {/* Menu Điều hướng */}
          <nav className="dashboard-nav d-flex flex-column gap-1">
            <NavLink
              to="/employer/dashboard"
              className={({ isActive }) =>
                `dashboard-nav__link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${
                  isActive ? 'dashboard-nav__link--active' : 'text-secondary'
                }`
              }
            >
              <FaChartPie size={16} />
              <span>Tổng quan</span>
            </NavLink>

            <NavLink
              to="/employer/post-job"
              className={({ isActive }) =>
                `dashboard-nav__link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${
                  isActive ? 'dashboard-nav__link--active' : 'text-secondary'
                }`
              }
            >
              <FaPlusCircle size={16} />
              <span>Đăng tin tuyển dụng</span>
            </NavLink>

            <NavLink
              to="/employer/applications"
              className={({ isActive }) =>
                `dashboard-nav__link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${
                  isActive ? 'dashboard-nav__link--active' : 'text-secondary'
                }`
              }
            >
              <FaFileAlt size={16} />
              <span>Hồ sơ ứng tuyển</span>
            </NavLink>

            <NavLink
              to="/employer/jobs"
              className={({ isActive }) =>
                `dashboard-nav__link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${
                  isActive ? 'dashboard-nav__link--active' : 'text-secondary'
                }`
              }
            >
              <FaBriefcase size={16} />
              <span>Tin tuyển dụng đã đăng</span>
            </NavLink>
          </nav>
        </div>

        {/* Chân sidebar */}
        <div className="pt-3 border-top">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="dashboard-avatar bg-light border rounded-circle d-flex align-items-center justify-content-center text-dark fw-bold">
              <FaBuilding size={14} />
            </div>
            <div className="text-truncate">
              <div className="fw-semibold small text-truncate">
                {user?.companyName || user?.fullName || 'Công ty TNHH Ánh Dương'}
              </div>
              <div className="text-muted" style={{ fontSize: '11px' }}>
                {user?.username}
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-sm btn-outline-secondary flex-fill text-nowrap">
              <FaHome className="me-1" /> Trang chủ
            </Link>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={handleLogout}
              title="Đăng xuất"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>

      {/* Vùng nội dung chính */}
      <main className="dashboard-main flex-grow-1 bg-light p-4" style={{ minWidth: 0, minHeight: '100vh' }}>
        <Outlet />
      </main>
      <ZaloContactButton />
    </div>
  );
}
