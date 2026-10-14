import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  FaTimes,
  FaCheck,
  FaCheckDouble,
  FaTrashAlt,
  FaFileAlt,
  FaBell,
  FaRobot,
  FaBriefcase,
  FaInbox,
} from 'react-icons/fa';
import notificationApi from '../../api/notificationApi.js';
import { showToast } from '../common/ToastHost.jsx';
import '../../styles/notification-drawer.css';

export default function NotificationDrawer({ isOpen, onClose, notifications = [], onUpdateList }) {
  const [filter, setFilter] = useState('ALL'); // ALL | UNREAD | APPLICATION

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const filteredList = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'UNREAD') return !n.isRead;
      if (filter === 'APPLICATION') {
        const c = (n.content || '').toLowerCase();
        return c.includes('ứng tuyển') || c.includes('hồ sơ');
      }
      return true;
    });
  }, [notifications, filter]);

  if (!isOpen) return null;

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      if (onUpdateList) {
        onUpdateList(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      }
    } catch {
      showToast('error', 'Không thể cập nhật trạng thái.');
    }
  };

  const handleMarkAll = async () => {
    if (unreadCount === 0) return;
    try {
      await notificationApi.markAllAsRead();
      if (onUpdateList) {
        onUpdateList(notifications.map((n) => ({ ...n, isRead: true })));
      }
      showToast('success', 'Đã đánh dấu đã đọc tất cả thông báo.', 'HOÀN TẤT');
    } catch {
      showToast('error', 'Có lỗi khi cập nhật.');
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.deleteNotification(id);
      if (onUpdateList) {
        onUpdateList(notifications.filter((n) => n.id !== id));
      }
      showToast('info', 'Đã xóa thông báo.', 'XÓA BỎ');
    } catch {
      showToast('error', 'Không thể xóa thông báo.');
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Gần đây';
    try {
      const d = new Date(timeStr);
      if (isNaN(d.getTime())) return timeStr;
      const now = new Date();
      const diffMins = Math.floor((now - d) / (1000 * 60));
      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins}m trước`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h trước`;
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    } catch {
      return timeStr;
    }
  };

  const getIconInfo = (content = '') => {
    const c = content.toLowerCase();
    if (c.includes('ứng tuyển') || c.includes('hồ sơ')) {
      return {
        icon: <FaFileAlt size={13} />,
        sqClass: 'notif-drawer-icon-sq--app',
        tagClass: 'notif-drawer-tag-inline--app',
        tag: 'ỨNG TUYỂN',
      };
    }
    if (c.includes('ai') || c.includes('chấm điểm')) {
      return {
        icon: <FaRobot size={13} />,
        sqClass: 'notif-drawer-icon-sq--ai',
        tagClass: 'notif-drawer-tag-inline--app',
        tag: 'TRỢ LÝ AI',
      };
    }
    return {
      icon: <FaBell size={13} />,
      sqClass: 'notif-drawer-icon-sq--sys',
      tagClass: 'notif-drawer-tag-inline--sys',
      tag: 'HỆ THỐNG',
    };
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="notif-drawer-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Slide-over Right Panel */}
      <aside className="notif-drawer-panel" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="notif-drawer-header">
          <div className="notif-drawer-eyebrow">
            <span className="notif-drawer-tag">
              <span className="notif-drawer-tag-dot" />
              <span>[ TRUNG TÂM THÔNG BÁO ]</span>
            </span>

            <button
              type="button"
              className="notif-drawer-close"
              onClick={onClose}
              aria-label="Đóng"
            >
              <FaTimes size={12} />
            </button>
          </div>

          <div className="notif-drawer-title-row">
            <h2 className="notif-drawer-title">Thông báo của bạn</h2>
            {unreadCount > 0 && (
              <span className="badge rounded-0 bg-warning text-dark font-monospace fw-bold" style={{ fontSize: '11px', padding: '4px 8px' }}>
                {unreadCount} MỚI
              </span>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="notif-drawer-filter-bar">
          <div className="notif-drawer-tabs">
            <button
              type="button"
              className={`notif-drawer-tab-btn ${filter === 'ALL' ? 'notif-drawer-tab-btn--active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              type="button"
              className={`notif-drawer-tab-btn ${filter === 'UNREAD' ? 'notif-drawer-tab-btn--active' : ''}`}
              onClick={() => setFilter('UNREAD')}
            >
              Chưa đọc ({unreadCount})
            </button>
            <button
              type="button"
              className={`notif-drawer-tab-btn ${filter === 'APPLICATION' ? 'notif-drawer-tab-btn--active' : ''}`}
              onClick={() => setFilter('APPLICATION')}
            >
              Ứng tuyển
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="notif-drawer-read-all"
              onClick={handleMarkAll}
              title="Đọc tất cả"
            >
              <FaCheckDouble size={11} />
              <span>Đọc hết</span>
            </button>
          )}
        </div>

        {/* Body Items List */}
        <div className="notif-drawer-body">
          {filteredList.length === 0 ? (
            <div className="notif-drawer-empty">
              <div className="notif-drawer-empty-sq">
                <FaInbox size={22} />
              </div>
              <p className="fw-bold mb-1 text-dark" style={{ fontSize: '15px' }}>
                Không có thông báo nào
              </p>
              <p className="small text-muted mb-0">
                Các cập nhật ứng tuyển và hệ thống sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : (
            filteredList.map((item) => {
              const meta = getIconInfo(item.content);

              return (
                <div
                  key={item.id}
                  className={`notif-drawer-item ${!item.isRead ? 'notif-drawer-item--unread' : ''}`}
                  onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                >
                  <div className={`notif-drawer-icon-sq ${meta.sqClass}`}>
                    {meta.icon}
                  </div>

                  <div className="notif-drawer-content">
                    <span className={`notif-drawer-tag-inline ${meta.tagClass}`}>
                      {meta.tag}
                    </span>
                    <div className="notif-drawer-text">
                      {item.content}
                    </div>
                    <div className="notif-drawer-time">
                      {formatTime(item.createdAt)}
                    </div>
                  </div>

                  <div className="notif-drawer-actions">
                    {!item.isRead && (
                      <button
                        type="button"
                        className="notif-drawer-action-sq"
                        onClick={(e) => handleMarkAsRead(item.id, e)}
                        title="Đã đọc"
                      >
                        <FaCheck size={10} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="notif-drawer-action-sq notif-drawer-action-sq--del"
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Xóa"
                    >
                      <FaTrashAlt size={10} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>,
    document.body
  );
}
