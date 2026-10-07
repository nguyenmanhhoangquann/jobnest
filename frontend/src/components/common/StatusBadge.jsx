import React from 'react';
import { APP_STATUS } from '../../constants';

export default function StatusBadge({ status = 'PENDING' }) {
  const configs = {
    PENDING: {
      label: APP_STATUS.PENDING || 'Chờ xử lý',
      bg: '#FEF3C7',
      color: '#92400E',
    },
    VIEWED: {
      label: APP_STATUS.VIEWED || 'Đã xem',
      bg: '#DBEAFE',
      color: '#1E40AF',
    },
    ACCEPTED: {
      label: APP_STATUS.ACCEPTED || 'Phù hợp',
      bg: '#DCFCE7',
      color: '#166534',
    },
    REJECTED: {
      label: APP_STATUS.REJECTED || 'Không phù hợp',
      bg: '#FEE2E2',
      color: '#991B1B',
    },
  };

  const current = configs[status] || configs.PENDING;

  return (
    <span
      className="badge status-badge rounded-pill fw-semibold"
      style={{
        backgroundColor: current.bg,
        color: current.color,
        fontSize: '12px',
        padding: '4px 10px',
      }}
    >
      {current.label}
    </span>
  );
}
