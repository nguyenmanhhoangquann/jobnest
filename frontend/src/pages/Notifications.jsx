import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaTrashAlt,
  FaFileAlt,
  FaRobot,
  FaBriefcase,
  FaCalendarAlt,
  FaArrowRight,
  FaSlidersH,
} from 'react-icons/fa';
import notificationApi from '../api/notificationApi.js';
import { showToast } from '../components/common/ToastHost.jsx';
import { Spinner } from '../components/common/Loading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/notifications.css';

export default function Notifications() {
  const navigate = useNavigate();
  const { user, isAuth } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | UNREAD | APPLICATION | SYSTEM

  useEffect(() => {
    setLoading(true);
    notificationApi
      .getNotifications()
      .then((data) => {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const appCount = useMemo(() => {
    return notifications.filter((n) => {
      const c = (n.content || '').toLowerCase();
      return c.includes('ứng tuyển') || c.includes('hồ sơ');
    }).length;
  }, [notifications]);

  const filteredList = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === 'UNREAD') return !n.isRead;
      if (activeTab === 'APPLICATION') {
        const c = (n.content || '').toLowerCase();
        return c.includes('ứng tuyển') || c.includes('hồ sơ');
      }
      if (activeTab === 'SYSTEM') {
        const c = (n.content || '').toLowerCase();
        return !c.includes('ứng tuyển') && !c.includes('hồ sơ');
      }
      return true;
    });
  }, [notifications, activeTab]);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      showToast('success', 'Đã đánh dấu đã đọc thông báo.');
    } catch {
      showToast('error', 'Không thể cập nhật trạng thái.');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast('success', 'Đã đánh dấu đã đọc tất cả thông báo!');
    } catch {
      showToast('error', 'Có lỗi xảy ra khi cập nhật.');
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      showToast('success', 'Đã xóa thông báo.');
    } catch {
      showToast('error', 'Không thể xóa thông báo này.');
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Gần đây';
    try {
      const d = new Date(timeStr);
      if (isNaN(d.getTime())) return timeStr;
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    } catch {
      return timeStr;
    }
  };

  const getItemTypeConfig = (content = '') => {
    const c = content.toLowerCase();
    if (c.includes('ai') || c.includes('chấm điểm') || c.includes('tương thích')) {
      return {
        type: 'AI_REVIEW',
        badgeClass: 'notification-badge-type--ai',
        badgeText: 'Trợ lý AI',
        iconBoxClass: 'notification-icon-box--ai',
        icon: <FaRobot size={18} />,
      };
    }
    if (c.includes('ứng tuyển') || c.includes('hồ sơ')) {
      return {
        type: 'APPLICATION',
        badgeClass: 'notification-badge-type--app',
        badgeText: 'Hồ sơ ứng tuyển',
        iconBoxClass: 'notification-icon-box--application',
        icon: <FaFileAlt size={17} />,
      };
    }
    if (c.includes('việc làm') || c.includes('tuyển dụng') || c.includes('jd')) {
      return {
        type: 'JOB_ALERT',
        badgeClass: 'notification-badge-type--job',
        badgeText: 'Cơ hội việc làm',
        iconBoxClass: 'notification-icon-box--job',
        icon: <FaBriefcase size={17} />,
      };
    }
    return {
      type: 'SYSTEM',
      badgeClass: 'notification-badge-type--sys',
      badgeText: 'Hệ thống',
      iconBoxClass: 'notification-icon-box--system',
      icon: <FaBell size={17} />,
    };
  };

  return (
    <div className="notifications-page-root">
      <div className="container" style={{ maxWidth: '940px' }}>
        {/* 1. Header Section */}
        <div className="text-start">
          <div className="notifications-eyebrow">
            <span className="notifications-eyebrow-dot" />
            <span>Trung tâm thông báo • Cập nhật thời gian thực</span>
          </div>

          <h1 className="notifications-header-title">Thông báo của bạn</h1>
          <p className="notifications-header-desc">
            Theo dõi tiến độ xét duyệt hồ sơ ứng tuyển, các cơ hội việc làm mới phù hợp và thông tin từ hệ thống JobNest.
          </p>
        </div>

        {/* 2. Double-Bezel Architecture Container */}
        <div className="notifications-outer-shell">
          <div className="notifications-inner-core">
            {/* Controls Bar: Segmented Pills + Clear All CTA */}
            <div className="notifications-controls-bar">
              <div className="notifications-filter-pills">
                <button
                  type="button"
                  className={`notifications-pill-btn ${activeTab === 'ALL' ? 'notifications-pill-btn--active' : ''}`}
                  onClick={() => setActiveTab('ALL')}
                >
                  <span>Tất cả</span>
                  <span className="notifications-pill-badge">{notifications.length}</span>
                </button>

                <button
                  type="button"
                  className={`notifications-pill-btn ${activeTab === 'UNREAD' ? 'notifications-pill-btn--active' : ''}`}
                  onClick={() => setActiveTab('UNREAD')}
                >
                  <span>Chưa đọc</span>
                  {unreadCount > 0 && (
                    <span className="notifications-pill-badge">{unreadCount}</span>
                  )}
                </button>

                <button
                  type="button"
                  className={`notifications-pill-btn ${activeTab === 'APPLICATION' ? 'notifications-pill-btn--active' : ''}`}
                  onClick={() => setActiveTab('APPLICATION')}
                >
                  <span>Ứng tuyển</span>
                  <span className="notifications-pill-badge">{appCount}</span>
                </button>

                <button
                  type="button"
                  className={`notifications-pill-btn ${activeTab === 'SYSTEM' ? 'notifications-pill-btn--active' : ''}`}
                  onClick={() => setActiveTab('SYSTEM')}
                >
                  <span>Hệ thống</span>
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  className="notifications-action-btn"
                  onClick={handleMarkAllAsRead}
                  title="Đánh dấu tất cả thông báo là đã đọc"
                >
                  <FaCheckDouble size={13} className="text-warning" />
                  <span>Đọc tất cả ({unreadCount})</span>
                </button>
              )}
            </div>

            {/* List / Empty State */}
            {loading ? (
              <div className="p-5 text-center">
                <Spinner text="Đang tải danh sách thông báo..." />
              </div>
            ) : filteredList.length === 0 ? (
              <div className="notifications-empty-state">
                <div className="notifications-empty-icon">
                  <FaBell size={30} />
                </div>
                <h3 className="notifications-empty-title">
                  {activeTab === 'UNREAD'
                    ? 'Bạn đã đọc hết mọi thông báo'
                    : 'Không có thông báo nào trong mục này'}
                </h3>
                <p className="notifications-empty-desc">
                  Mọi cập nhật về trạng thái CV, lời mời phỏng vấn hoặc gợi ý việc làm tương thích sẽ được hiển thị ngay tại đây.
                </p>
                <Link to="/jobs" className="notifications-empty-btn">
                  <span>Khám phá việc làm nổi bật</span>
                  <FaArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column">
                {filteredList.map((item) => {
                  const cfg = getItemTypeConfig(item.content);

                  return (
                    <article
                      key={item.id}
                      className={`notification-item ${!item.isRead ? 'notification-item--unread' : ''}`}
                      onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                    >
                      {/* Icon Badge */}
                      <div className={`notification-icon-box ${cfg.iconBoxClass}`}>
                        {cfg.icon}
                      </div>

                      {/* Content Column */}
                      <div className="notification-content-area">
                        <div className="d-flex align-items-center gap-2">
                          <span className={`notification-badge-type ${cfg.badgeClass}`}>
                            {cfg.badgeText}
                          </span>
                          {!item.isRead && (
                            <span
                              className="badge rounded-pill bg-warning text-dark fw-bold"
                              style={{ fontSize: '10px' }}
                            >
                              Mới
                            </span>
                          )}
                        </div>

                        <div className="notification-text fw-medium">
                          {item.content}
                        </div>

                        <div className="notification-time-line">
                          <FaCalendarAlt size={11} className="text-muted" />
                          <span>{formatTime(item.createdAt)}</span>
                        </div>
                      </div>

                      {/* Quick Actions (Mark as read & Delete) */}
                      <div className="notification-actions">
                        {!item.isRead && (
                          <button
                            type="button"
                            className="notification-action-circle"
                            onClick={(e) => handleMarkAsRead(item.id, e)}
                            title="Đánh dấu đã đọc"
                          >
                            <FaCheck size={12} />
                          </button>
                        )}

                        <button
                          type="button"
                          className="notification-action-circle notification-action-circle--delete"
                          onClick={(e) => handleDelete(item.id, e)}
                          title="Xóa thông báo"
                        >
                          <FaTrashAlt size={12} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
