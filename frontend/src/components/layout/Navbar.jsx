import React, { useState } from 'react';
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
  FaPlusCircle
} from 'react-icons/fa';
import { APP_NAME, NAV_ITEMS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

function NotificationBell({ isAuth }) {
  const navigate = useNavigate();
  // Mock notifications
  const [notifications] = useState([
    { id: 1, content: 'Hồ sơ ứng tuyển của bạn đã được Nhà tuyển dụng xem.', time: '10 phút trước', isRead: false },
    { id: 2, content: 'Việc làm "Frontend Developer" mới phù hợp với bạn.', time: '1 giờ trước', isRead: false },
    { id: 3, content: 'Chào mừng bạn đến với nền tảng việc làm JobNest!', time: '1 ngày trước', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isAuth) {
    return (
      <button
        type="button"
        className="icon-btn notif-btn"
        aria-label="Thông báo"
        onClick={() => navigate('/login')}
      >
        <FaBell size={18} />
      </button>
    );
  }

  return (
    <Dropdown align="end">
      <Dropdown.Toggle as="button" className="icon-btn notif-btn" aria-label="Thông báo">
        <FaBell size={18} />
        {unreadCount > 0 && <span className="notif-badge" aria-label={`${unreadCount} thông báo chưa đọc`} />}
      </Dropdown.Toggle>

      <Dropdown.Menu className="notif-menu shadow-lg border-0 py-2">
        <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
          <span className="fw-bold" style={{ fontSize: '15px' }}>Thông báo</span>
          {unreadCount > 0 && (
            <span className="badge rounded-pill bg-warning text-dark font-monospace" style={{ fontSize: '11px' }}>
              {unreadCount} mới
            </span>
          )}
        </div>
        <div className="notif-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {notifications.map((item) => (
            <Dropdown.Item
              key={item.id}
              className={`px-3 py-2 text-wrap ${!item.isRead ? 'notif-unread' : ''}`}
              style={{ fontSize: '13.5px', borderBottom: '1px solid #f3f4f6' }}
            >
              <div className="text-dark mb-1">{item.content}</div>
              <small className="text-muted" style={{ fontSize: '11px' }}>{item.time}</small>
            </Dropdown.Item>
          ))}
        </div>
        <div className="px-3 pt-2 text-center">
          <Link to="/notifications" className="text-decoration-none fw-semibold" style={{ fontSize: '13px', color: 'var(--color-primary-dark)' }}>
            Xem tất cả
          </Link>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

function UserMenu({ user, onLogout }) {
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
          <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{user?.displayName || user?.username || 'Tài khoản'}</div>
          <small className="text-muted" style={{ fontSize: '12px' }}>
            {isEmployer ? 'Nhà tuyển dụng' : 'Người tìm việc'}
          </small>
        </div>

        {isEmployer ? (
          <>
            <Dropdown.Item as={Link} to="/employer/cvs" className="d-flex align-items-center gap-2 py-2">
              <FaUsers size={14} className="text-muted" /> CV đã nhận
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/employer/ai-review" className="d-flex align-items-center gap-2 py-2">
              <FaRobot size={14} className="text-muted" /> AI đánh giá CV
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/employer/post-job" className="d-flex align-items-center gap-2 py-2">
              <FaPlusCircle size={14} className="text-muted" /> Đăng bài tuyển dụng
            </Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item as={Link} to="/candidate/applied" className="d-flex align-items-center gap-2 py-2">
              <FaFileAlt size={14} className="text-muted" /> Việc đã ứng tuyển
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/candidate/saved" className="d-flex align-items-center gap-2 py-2">
              <FaBookmark size={14} className="text-muted" /> JD đã lưu
            </Dropdown.Item>
          </>
        )}

        <Dropdown.Divider />
        <Dropdown.Item
          as="button"
          onClick={onLogout}
          className="d-flex align-items-center gap-2 py-2 text-danger"
        >
          <FaSignOutAlt size={14} /> Đăng xuất
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default function Navbar() {
  const { user, isAuth, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <BsNavbar expand="lg" sticky="top" className="app-navbar bg-white">
      <div className="container-app d-flex align-items-center w-100 justify-content-between">
        {/* Left: Logo */}
        <BsNavbar.Brand as={Link} to="/" className="brand d-flex align-items-center gap-2 m-0 text-decoration-none">
          <span className="brand__icon">
            <FaBriefcase size={20} />
          </span>
          <span className="d-flex flex-column">
            <b className="brand__title">{APP_NAME}</b>
            <small className="brand__tagline d-none d-xl-block">Kết nối tài năng - Kiến tạo tương lai</small>
          </span>
        </BsNavbar.Brand>

        {/* Mobile quick actions + Hamburger */}
        <div className="d-flex d-lg-none align-items-center gap-2">
          <button
            type="button"
            className="icon-btn"
            aria-label="Tìm việc làm"
            onClick={() => navigate('/jobs/search')}
          >
            <FaSearch size={18} />
          </button>
          <NotificationBell isAuth={isAuth} />
          <BsNavbar.Toggle aria-controls="main-nav" className="border-0 p-1 shadow-none" />
        </div>

        {/* Center: Nav links & Desktop Right */}
        <BsNavbar.Collapse id="main-nav" className="mt-3 mt-lg-0">
          <Nav className="mx-auto app-menu mb-3 mb-lg-0">
            {NAV_ITEMS.map((item) => (
              <Nav.Link
                key={item.to}
                as={NavLink}
                to={item.to}
                end={item.to === '/'}
                className="app-nav-link"
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* Desktop Right: Actions */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            <button
              type="button"
              className="icon-btn"
              aria-label="Tìm việc làm"
              onClick={() => navigate('/jobs/search')}
            >
              <FaSearch size={18} />
            </button>
            <NotificationBell isAuth={isAuth} />
            {!isAuth ? (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-brand">
                  Đăng ký
                </Link>
              </>
            ) : (
              <UserMenu user={user} onLogout={logout} />
            )}
          </div>

          {/* Mobile Collapse Menu Bottom (When on mobile) */}
          <div className="d-lg-none pt-3 border-top mt-2">
            {!isAuth ? (
              <div className="d-flex flex-column gap-2">
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
                {user?.role === 'EMPLOYER' ? (
                  <>
                    <Link to="/employer/cvs" className="btn btn-light text-start py-2">
                      <FaUsers className="me-2" /> CV đã nhận
                    </Link>
                    <Link to="/employer/ai-review" className="btn btn-light text-start py-2">
                      <FaRobot className="me-2" /> AI đánh giá CV
                    </Link>
                    <Link to="/employer/post-job" className="btn btn-light text-start py-2">
                      <FaPlusCircle className="me-2" /> Đăng bài tuyển dụng
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/candidate/applied" className="btn btn-light text-start py-2">
                      <FaFileAlt className="me-2" /> Việc đã ứng tuyển
                    </Link>
                    <Link to="/candidate/saved" className="btn btn-light text-start py-2">
                      <FaBookmark className="me-2" /> JD đã lưu
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
    </BsNavbar>
  );
}
