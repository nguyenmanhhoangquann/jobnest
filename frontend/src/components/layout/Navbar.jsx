import React, { useState, useEffect, useCallback } from 'react';
import { Navbar as BsNavbar, Nav, Dropdown } from 'react-bootstrap';
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
  FaRobot,
  FaPlusCircle,
  FaShieldAlt,
  FaChartBar,
  FaBuilding,
  FaCheckDouble,
} from 'react-icons/fa';
import { NAV_ITEMS } from '../../constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { showToast } from '../common/ToastHost.jsx';
import notificationApi from '../../api/notificationApi.js';
import jobApi from '../../api/jobApi.js';
import NotificationDrawer from './NotificationDrawer.jsx';
import SavedJobsDrawer from './SavedJobsDrawer.jsx';

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

          // Tự động hiển thị thông báo mới nhất trượt từ phải sang trái
          const sessionKey = 'jn_notif_alert_shown';
          if (unread.length > 0 && !sessionStorage.getItem(sessionKey)) {
            sessionStorage.setItem(sessionKey, 'true');
            const latest = unread[0];
            const tag = latest.content.toLowerCase().includes('ứng tuyển')
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
        className="nav-icon-action-btn"
        aria-label="Thông báo"
        title="Thông báo tuyển dụng"
        onClick={() => navigate('/login')}
      >
        <FaBell size={15} />
        <span className="notif-badge-modern" aria-label="Có thông báo mới" />
      </button>
    );
  }

  return (
    <>
      <Dropdown align="end">
        <Dropdown.Toggle as="button" className="nav-icon-action-btn" aria-label="Thông báo" title="Thông báo tuyển dụng">
          <FaBell size={15} />
          {unreadCount > 0 && <span className="notif-badge-modern" aria-label={`${unreadCount} thông báo chưa đọc`} />}
        </Dropdown.Toggle>

        <Dropdown.Menu className="notif-menu shadow-lg border-0 py-2">
          <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
            <span className="fw-bold" style={{ fontSize: '15px' }}>
              Thông báo
            </span>
            {unreadCount > 0 && (
              <span className="badge rounded-pill bg-warning text-dark font-monospace" style={{ fontSize: '11px' }}>
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
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : (item.time || 'Gần đây')}
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

      {/* Right-Side Slide-Over Notification Drawer */}
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
      <Dropdown.Toggle as="button" className="avatar-btn d-flex align-items-center gap-2 border-0 bg-transparent p-0">
        <div className="avatar-circle">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="rounded-circle w-100 h-100 object-fit-cover" />
          ) : (
            <FaUserCircle size={36} color="var(--color-text)" />
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-dropdown-menu shadow-lg border-0 py-2" style={{ minWidth: '220px' }}>
        <div className="px-3 py-2 border-bottom mb-1">
          <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>
            {user?.displayName || user?.username || 'Tài khoản'}
          </div>
          <small className={`badge ${isAdmin ? 'bg-danger' : isEmployer ? 'bg-warning text-dark' : 'bg-primary text-white'}`} style={{ fontSize: '11px' }}>
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
  const [savedDrawerTab, setSavedDrawerTab] = useState('jobs');
  const [savedCount, setSavedCount] = useState(() => {
    try {
      return jobApi.getSavedJobsList().length;
    } catch {
      return 0;
    }
  });

  const updateCounts = useCallback(() => {
    try {
      setSavedCount(jobApi.getSavedJobsList().length);
    } catch {
      setSavedCount(0);
    }
  }, []);

  const handleOpenSavedJobs = (tab = 'jobs') => {
    const targetTab = typeof tab === 'string' ? tab : 'jobs';
    setSavedDrawerTab(targetTab);
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

  useEffect(() => {
    updateCounts();
    const handleOpenEvent = (e) => {
      const tab = e?.detail?.tab || 'jobs';
      setSavedDrawerTab(tab);
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
    window.addEventListener('open-saved-jobs', handleOpenEvent);
    window.addEventListener('saved-jobs-updated', updateCounts);
    window.addEventListener('followed-companies-updated', updateCounts);
    return () => {
      window.removeEventListener('open-saved-jobs', handleOpenEvent);
      window.removeEventListener('saved-jobs-updated', updateCounts);
      window.removeEventListener('followed-companies-updated', updateCounts);
    };
  }, [updateCounts]);

  return (
    <BsNavbar expand="lg" sticky="top" className="app-navbar bg-white py-2">
      {/* Container chuẩn sát 2 biên */}
      <div className="container-fluid px-3 px-xl-5 d-flex align-items-center w-100 justify-content-between">
        {/* Left: Logo sát mép bên trái */}
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center p-0 m-0 me-3 text-decoration-none">
          <img
            src="/images/jobnest-logo.png"
            alt="JOB NEST - Kết nối tài năng, nâng tầm sự nghiệp"
            className="navbar-brand-logo"
          />
        </BsNavbar.Brand>

        {/* Mobile controls */}
        <div className="d-flex d-lg-none align-items-center gap-2">
          <button
            type="button"
            className="icon-btn position-relative"
            aria-label="Mục quan tâm"
            onClick={() => handleOpenSavedJobs('jobs')}
          >
            <FaBookmark size={15} />
            {savedCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: '#EA580C',
                  color: '#fff',
                  borderRadius: '999px',
                  fontSize: '9px',
                  fontWeight: '700',
                  padding: '1px 4px',
                  lineHeight: '1.2',
                }}
              >
                {savedCount > 99 ? '99+' : savedCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Tìm việc làm"
            onClick={() => navigate('/jobs')}
          >
            <FaSearch size={16} />
          </button>
          <NotificationBell isAuth={isAuth} />
          <BsNavbar.Toggle aria-controls="main-nav" className="border-0 p-1 shadow-none" />
        </div>

        {/* Desktop Layout: Menu nằm cạnh logo bên trái, Actions nằm bên phải */}
        <BsNavbar.Collapse id="main-nav" className="mt-3 mt-lg-0">
          <Nav className="me-auto app-menu align-items-center mb-3 mb-lg-0 ms-lg-2">
            {NAV_ITEMS.map((item) => (
              <Nav.Link
                key={item.to}
                as={NavLink}
                to={item.to}
                end={item.to === '/'}
                className={`app-nav-link ${item.to === '/jobs' ? 'app-nav-link--hot' : ''}`}
              >
                {item.label}
                {item.to === '/jobs' && (
                  <span className="nav-hot-badge" title="Đang tuyển nhiều">
                    HOT
                  </span>
                )}
              </Nav.Link>
            ))}
          </Nav>

          {/* Right: Dành cho NTD, Cụm Icons Tinh Tế, Đăng nhập/Đăng ký */}
          <div className="d-none d-lg-flex align-items-center gap-2 ms-auto">
            {!isAuth ? (
              <Link to="/register?role=employer" className="btn-nav-employer me-1">
                Dành cho nhà tuyển dụng
              </Link>
            ) : user?.role === 'EMPLOYER' ? (
              <Link to="/employer/dashboard" className="btn-nav-employer me-1">
                <FaBuilding className="me-1.5" size={12} /> Kênh Nhà Tuyển Dụng
              </Link>
            ) : user?.role === 'ADMIN' ? (
              <Link to="/admin/dashboard" className="btn-nav-employer me-1 border-danger text-danger">
                <FaShieldAlt className="me-1.5" size={12} /> Quản trị Admin
              </Link>
            ) : null}

            {/* Cụm nút icon tiện ích */}
            <div className="d-flex align-items-center gap-2">
              {/* Nút Việc làm đã lưu */}
              <button
                type="button"
                className="nav-icon-action-btn position-relative"
                aria-label="Mục quan tâm"
                title="Mục quan tâm"
                onClick={handleOpenSavedJobs}
              >
                <FaBookmark size={13} />
                {savedCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#EA580C',
                      color: '#fff',
                      borderRadius: '999px',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '1px 5px',
                      lineHeight: '1.2',
                    }}
                  >
                    {savedCount > 99 ? '99+' : savedCount}
                  </span>
                )}
              </button>

              {/* Chuông Thông báo */}
              <NotificationBell isAuth={isAuth} />
            </div>

            {!isAuth ? (
              <div className="d-flex align-items-center gap-2 ms-2">
                <Link to="/login" className="btn-nav-login">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-nav-register">
                  Đăng ký
                </Link>
              </div>
            ) : (
              <UserMenu user={user} onLogout={logout} />
            )}
          </div>

          {/* Mobile Collapse Drawer */}
          <div className="d-lg-none pt-3 border-top mt-2">
            {!isAuth ? (
              <div className="d-flex flex-column gap-2">
                <Link
                  to="/candidate/saved-jobs"
                  className="btn btn-outline-warning text-dark w-100 text-center py-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <FaBookmark size={13} />
                  <span>Mục yêu thích & Đã lưu {savedCount > 0 ? `(${savedCount})` : ''}</span>
                </Link>
                <Link to="/register?role=employer" className="btn btn-outline-secondary w-100 text-center py-2">
                  Dành cho nhà tuyển dụng
                </Link>
                <Link to="/login" className="btn btn-ghost w-100 text-center">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-brand w-100 text-center">
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2 px-2 py-1 mb-2">
                  <FaUserCircle size={28} color="var(--color-text)" />
                  <div>
                    <div className="fw-bold">{user?.displayName || user?.username}</div>
                    <small className="text-muted">{user?.role === 'EMPLOYER' ? 'Nhà tuyển dụng' : 'Người tìm việc'}</small>
                  </div>
                </div>
                {user?.role === 'ADMIN' ? (
                  <>
                    <Link to="/admin/dashboard" className="btn btn-light text-start py-2">
                      <FaChartBar className="me-2" /> Bảng điều khiển Quản trị
                    </Link>
                    <Link to="/employer/dashboard" className="btn btn-light text-start py-2">
                      <FaBuilding className="me-2" /> Kênh Nhà Tuyển Dụng
                    </Link>
                  </>
                ) : user?.role === 'EMPLOYER' ? (
                  <>
                    <Link to="/employer/dashboard" className="btn btn-light text-start py-2">
                      <FaChartBar className="me-2" /> Bảng điều khiển NTD
                    </Link>
                    <Link to="/employer/applications" className="btn btn-light text-start py-2">
                      <FaUsers className="me-2" /> Hồ sơ ứng tuyển (CV)
                    </Link>
                    <Link to="/employer/post-job" className="btn btn-light text-start py-2">
                      <FaPlusCircle className="me-2" /> Đăng bài tuyển dụng
                    </Link>
                    <Link to="/employer/jobs" className="btn btn-light text-start py-2">
                      <FaBriefcase className="me-2" /> Tin đã đăng
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/candidate/applied-jobs" className="btn btn-light text-start py-2">
                      <FaFileAlt className="me-2" /> Việc đã ứng tuyển
                    </Link>
                    <Link to="/candidate/saved-jobs" className="btn btn-light text-start py-2">
                      <FaBookmark className="me-2" /> Công việc đã lưu
                    </Link>
                  </>
                )}
                <button type="button" onClick={logout} className="btn btn-outline-danger w-100 mt-2 text-start">
                  <FaSignOutAlt className="me-2" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </BsNavbar.Collapse>
      </div>

      {/* Right-Side Slide-Over Saved Jobs Drawer */}
      <SavedJobsDrawer
        isOpen={savedJobsOpen}
        onClose={() => setSavedJobsOpen(false)}
        savedJobs={savedJobs}
        onUpdateJobs={setSavedJobs}
        initialTab={savedDrawerTab}
      />
    </BsNavbar>
  );
}
