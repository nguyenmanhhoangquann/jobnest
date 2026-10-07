import React from 'react';
import { FaInbox } from 'react-icons/fa';

export default function EmptyState({
  icon: Icon = FaInbox,
  title = 'Không có dữ liệu',
  description = 'Hiện tại chưa có dữ liệu nào phù hợp với yêu cầu.',
  action,
}) {
  return (
    <div className="empty-state text-center py-5 px-3">
      <div className="empty-state__icon mb-3 text-muted opacity-50">
        <Icon size={64} color="#D1D5DB" />
      </div>
      <h4 className="empty-state__title fw-bold mb-2" style={{ fontSize: '18px', color: 'var(--color-text)' }}>
        {title}
      </h4>
      <p className="empty-state__desc text-muted mb-4 mx-auto" style={{ maxWidth: '400px', fontSize: '14px' }}>
        {description}
      </p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
