import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaBriefcase,
  FaSignOutAlt,
  FaFileAlt,
  FaBookmark,
  FaUsers,
  FaPlusCircle,
  FaShieldAlt,
  FaChartBar,
  FaBuilding,
  FaCheckDouble,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { showToast } from '../common/ToastHost.jsx';
import notificationApi from '../../api/notificationApi.js';
import jobApi from '../../api/jobApi.js';
import NotificationDrawer from './NotificationDrawer.jsx';
import SavedJobsDrawer from './SavedJobsDrawer.jsx';

const NAV_ITEMS = [
  { label: 'Companies', to: '/companies' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Articles', to: '/blog' },
  { label: 'Salaries', to: '/salary-report' },
];

function NotificationBell({ isAuth }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isAuth) return;
    notificationApi
      .getNotifications()
      .then((data) => {
        if (Array.isArray(data)) {
          setNotifications(data);
          const unread = data.filter((n) => !n.isRead);
          setUnreadCount(unread.length);

          const sessionKey = 'jn_notif_alert_shown';
          if (unread.length > 0 && !sessionStorage.getItem(sessionKey)) {
            sessionStorage.setItem(sessionKey, 'true');
            const latest = unread[0];
            const tag = latest.content?.toLowerCase().includes('ứng tuyển')
              ? 'HỒ SƠ ỨNG TUYỂN'
              : 'THÔNG BÁO MỚI';
            showToast('info', latest.content, tag, 5000);
          }
        }
      })
      .catch(() => {});
  }, [isAuth]);

  if (!isAuth) {
    return (
      <button
        type="button"
        className="builtin-icon-btn"
        aria-label="Thông báo"
        title="Thông báo tuyển dụng"
        onClick={() => navigate('/login')}
      >
        <FaBell size={15} />
      </button>
    );
  }

  return (
    <>
      <Dropdown align="end">
        <Dropdown.Toggle
          as="button"
          className="builtin-icon-btn"
          aria-label="Thông báo"
          title="Thông báo tuyển dụng"
        >
          <FaBell size={15} />
          {unreadCount > 0 && (
            <span
              className="notif-badge-builtin"
              aria-label={`${unreadCount} thông báo chưa đọc`}
            />
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu className="notif-menu shadow-lg border-0 py-2">
          <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
            <span className="fw-bold" style={{ fontSize: '15px' }}>
              Thông báo
            </span>
            {unreadCount > 0 && (
              <span
                className="badge rounded-pill bg-warning text-dark font-monospace"
                style={{ fontSize: '11px' }}
              >
                {unreadCount} mới
              </span>
            )}
          </div>
          <div className="notif-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.slice(0, 5).map((item) => (
              <Dropdown.Item
                key={item.id}
                onClick={() => setIsDrawerOpen(true)}
                className={`px-3 py-2 text-wrap ${!item.isRead ? 'notif-unread' : ''}`}
                style={{ fontSize: '13.5px', borderBottom: '1px solid #f3f4f6' }}
              >
                <div className="text-dark mb-1">{item.content}</div>
                <small className="text-muted" style={{ fontSize: '11px' }}>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('vi-VN')
                    : item.time || 'Gần đây'}
                </small>
              </Dropdown.Item>
            ))}
          </div>
          <div className="px-3 pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="btn btn-link p-0 text-decoration-none fw-semibold"
              style={{ fontSize: '13px', color: 'var(--color-primary-dark)' }}
            >
              Xem tất cả ({notifications.length}) →
            </button>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        notifications={notifications}
        onUpdateList={(updated) => {
          setNotifications(updated);
          setUnreadCount(updated.filter((n) => !n.isRead).length);
        }}
      />
    </>
  );
}

function UserMenu({ user, onLogout }) {
  const isAdmin = user?.role === 'ADMIN';
  const isEmployer = user?.role === 'EMPLOYER';

  return (
    <Dropdown align="end">
      <Dropdown.Toggle as="button" className="builtin-avatar-btn">
        <div className="builtin-avatar-circle">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="rounded-circle w-100 h-100 object-fit-cover"
            />
          ) : (
            <FaUserCircle size={22} color="#FFFFFF" />
          )}
        </div>
        <span className="text-white small fw-bold d-none d-xl-inline">
          {user?.displayName || user?.username || 'Tài khoản'}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-dropdown-menu shadow-lg border-0 py-2" style={{ minWidth: '220px' }}>
        <div className="px-3 py-2 border-bottom mb-1">
          <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>
            {user?.displayName || user?.username || 'Tài khoản'}
          </div>
          <small
            className={`badge ${
              isAdmin ? 'bg-danger' : isEmployer ? 'bg-warning text-dark' : 'bg-primary text-white'
            }`}
            style={{ fontSize: '11px' }}
          >
            {isAdmin ? 'Quản trị viên (Admin)' : isEmployer ? 'Nhà tuyển dụng' : 'Người tìm việc'}
          </small>
        </div>

        {isAdmin ? (
          <>
            <Dropdown.Item as={Link} to="/admin/dashboard" className="d-flex align-items-center gap-2 py-2">
              <FaChartBar size={14} className="text-muted" /> Tổng quan Admin
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/admin/dashboard?tab=users" className="d-flex align-items-center gap-2 py-2">
              <FaUsers size={14} className="text-muted" /> Quản lý User & NTD
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/admin/dashboard?tab=jobs" className="d-flex align-items-center gap-2 py-2">
              <FaCheckDouble size={14} className="text-muted" /> Duyệt tin & Doanh nghiệp
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/admin/dashboard?tab=reports" className="d-flex align-items-center gap-2 py-2">
              <FaShieldAlt size={14} className="text-muted" /> Giám sát vi phạm / CV
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to="/employer/dashboard" className="d-flex align-items-center gap-2 py-2 small text-secondary">
              <FaBuilding size={13} className="text-muted" /> Xem Kênh Nhà Tuyển Dụng
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/jobs" className="d-flex align-items-center gap-2 py-2 small text-secondary">
              <FaBriefcase size={13} className="text-muted" /> Xem Giao diện Tìm việc
            </Dropdown.Item>
          </>
        ) : isEmployer ? (
          <>
            <Dropdown.Item as={Link} to="/employer/dashboard" className="d-flex align-items-center gap-2 py-2">
              <FaChartBar size={14} className="text-muted" /> Bảng điều khiển NTD
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/employer/applications" className="d-flex align-items-center gap-2 py-2">
              <FaUsers size={14} className="text-muted" /> Hồ sơ ứng tuyển (CV)
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/employer/post-job" className="d-flex align-items-center gap-2 py-2">
              <FaPlusCircle size={14} className="text-muted" /> Đăng bài tuyển dụng
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/employer/jobs" className="d-flex align-items-center gap-2 py-2">
              <FaBriefcase size={14} className="text-muted" /> Tin đã đăng
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to="/jobs" className="d-flex align-items-center gap-2 py-2 small text-secondary">
              <FaSearch size={13} className="text-muted" /> Xem việc làm phía Ứng viên
            </Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item as={Link} to="/candidate/applied-jobs" className="d-flex align-items-center gap-2 py-2">
              <FaFileAlt size={14} className="text-muted" /> Việc đã ứng tuyển
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/candidate/saved-jobs" className="d-flex align-items-center gap-2 py-2">
              <FaBookmark size={14} className="text-muted" /> Công việc đã lưu
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/jobs" className="d-flex align-items-center gap-2 py-2">
              <FaBriefcase size={14} className="text-muted" /> Khám phá việc làm mới
            </Dropdown.Item>
          </>
        )}

        <Dropdown.Divider />
        <Dropdown.Item as="button" onClick={onLogout} className="d-flex align-items-center gap-2 py-2 text-danger">
          <FaSignOutAlt size={14} /> Đăng xuất
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default function Navbar() {
  const { user, isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const [savedJobsOpen, setSavedJobsOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleOpenSavedJobs = () => {
    if (!isAuth) {
      showToast('info', 'Đăng nhập để xem danh sách việc làm đã lưu', 'YÊU CẦU ĐĂNG NHẬP');
      navigate('/login');
      return;
    }
    jobApi
      .getSavedJobs()
      .then((data) => {
        const list = data?.content || (Array.isArray(data) ? data : []);
        setSavedJobs(list);
        setSavedJobsOpen(true);
      })
      .catch(() => {
        setSavedJobsOpen(true);
      });
  };

  return (
    <header className="app-navbar">
      <div className="container-fluid px-3 px-xl-5 d-flex align-items-center justify-content-between builtin-navbar-inner">
        {/* Left: Built In Wordmark Logo + Primary Navigation */}
        <div className="d-flex align-items-center">
          <Link to="/" className="builtin-brand" aria-label="JobNest">
            <span className="builtin-brand-word">job</span>
            <span className="builtin-brand-box">nest</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="d-none d-lg-flex align-items-center builtin-nav-menu">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `builtin-nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Desktop: Search, Bookmark, Notifications, Join | Log In, FOR EMPLOYERS */}
        <div className="d-none d-lg-flex align-items-center gap-3">
          {/* 1. Search Icon */}
          <button
            type="button"
            className="builtin-icon-btn"
            aria-label="Search"
            title="Tìm kiếm việc làm"
            onClick={() => navigate('/jobs')}
          >
            <FaSearch size={15} />
          </button>

          {/* 2. Saved Jobs Bookmark */}
          <button
            type="button"
            className="builtin-icon-btn"
            aria-label="Việc làm đã lưu"
            title="Việc làm đã lưu"
            onClick={handleOpenSavedJobs}
          >
            <FaBookmark size={14} />
          </button>

          {/* 3. Notifications */}
          <NotificationBell isAuth={isAuth} />

          {/* 4. Join | Log In (or UserMenu when authenticated) */}
          {!isAuth ? (
            <div className="builtin-auth-wrap">
              <Link to="/register" className="builtin-auth-link">
                Join
              </Link>
              <span className="builtin-auth-sep">|</span>
              <Link to="/login" className="builtin-auth-link">
                Log In
              </Link>
            </div>
          ) : (
            <UserMenu user={user} onLogout={logout} />
          )}

          {/* 5. FOR EMPLOYERS Outlined CTA */}
          {!isAuth ? (
            <Link to="/register?role=employer" className="builtin-cta-employer">
              FOR EMPLOYERS
            </Link>
          ) : user?.role === 'EMPLOYER' ? (
            <Link to="/employer/dashboard" className="builtin-cta-employer">
              KÊNH TUYỂN DỤNG
            </Link>
          ) : user?.role === 'ADMIN' ? (
            <Link to="/admin/dashboard" className="builtin-cta-employer">
              QUẢN TRỊ ADMIN
            </Link>
          ) : (
            <Link to="/register?role=employer" className="builtin-cta-employer">
              FOR EMPLOYERS
            </Link>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="d-flex d-lg-none align-items-center gap-2">
          <button
            type="button"
            className="builtin-icon-btn"
            aria-label="Search"
            onClick={() => navigate('/jobs')}
          >
            <FaSearch size={15} />
          </button>
          <NotificationBell isAuth={isAuth} />
          <button
            type="button"
            className="builtin-navbar-toggler"
            aria-label="Menu"
            onClick={() => setMobileExpanded(!mobileExpanded)}
          >
            {mobileExpanded ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileExpanded && (
        <div className="d-lg-none builtin-mobile-drawer px-3 py-3 border-top border-white-10">
          <nav className="d-flex flex-column gap-2 mb-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `builtin-nav-link py-2 ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileExpanded(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="d-flex flex-column gap-2 pt-2 border-top border-white-10">
            <button
              type="button"
              className="btn btn-outline-light text-start py-2 d-flex align-items-center gap-2"
              onClick={() => {
                setMobileExpanded(false);
                handleOpenSavedJobs();
              }}
            >
              <FaBookmark size={14} /> Việc làm đã lưu
            </button>

            {!isAuth ? (
              <>
                <div className="d-flex gap-2 mt-2">
                  <Link
                    to="/login"
                    className="btn btn-outline-light flex-fill text-center py-2"
                    onClick={() => setMobileExpanded(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-light flex-fill text-center py-2 fw-bold text-dark"
                    onClick={() => setMobileExpanded(false)}
                  >
                    Join
                  </Link>
                </div>
                <Link
                  to="/register?role=employer"
                  className="builtin-cta-employer text-center mt-2 py-2"
                  onClick={() => setMobileExpanded(false)}
                >
                  FOR EMPLOYERS
                </Link>
              </>
            ) : (
              <div className="pt-2">
                <div className="text-white small fw-bold mb-2">
                  {user?.displayName || user?.username} ({user?.role})
                </div>
                {user?.role === 'ADMIN' ? (
                  <Link
                    to="/admin/dashboard"
                    className="btn btn-light w-100 mb-2"
                    onClick={() => setMobileExpanded(false)}
                  >
                    Bảng điều khiển Admin
                  </Link>
                ) : user?.role === 'EMPLOYER' ? (
                  <Link
                    to="/employer/dashboard"
                    className="btn btn-light w-100 mb-2"
                    onClick={() => setMobileExpanded(false)}
                  >
                    Kênh tuyển dụng
                  </Link>
                ) : (
                  <Link
                    to="/candidate/applied-jobs"
                    className="btn btn-light w-100 mb-2"
                    onClick={() => setMobileExpanded(false)}
                  >
                    Việc đã ứng tuyển
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileExpanded(false);
                    logout();
                  }}
                  className="btn btn-outline-danger w-100 text-start"
                >
                  <FaSignOutAlt className="me-2" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right-Side Slide-Over Saved Jobs Drawer */}
      <SavedJobsDrawer
        isOpen={savedJobsOpen}
        onClose={() => setSavedJobsOpen(false)}
        savedJobs={savedJobs}
        onUpdateJobs={setSavedJobs}
      />
    </header>
  );
}
