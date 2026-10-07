import React from 'react';

export function Spinner({ size = 'sm', className = '' }) {
  return (
    <div
      className={`spinner-border spinner-border-${size} ${className}`}
      role="status"
      style={{ color: 'var(--color-primary)' }}
    >
      <span className="visually-hidden">Đang tải...</span>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="job-card job-card-skeleton">
      <div className="job-card__logo skeleton-box" style={{ width: '72px', height: '72px' }} />
      <div className="job-card__body w-100">
        <div className="skeleton-box mb-2" style={{ width: '40%', height: '14px' }} />
        <div className="skeleton-box mb-2" style={{ width: '85%', height: '18px' }} />
        <div className="skeleton-box mb-3" style={{ width: '60%', height: '14px' }} />
        <div className="d-flex gap-2">
          <div className="skeleton-box" style={{ width: '80px', height: '24px', borderRadius: 'var(--radius-pill)' }} />
          <div className="skeleton-box" style={{ width: '70px', height: '24px', borderRadius: 'var(--radius-pill)' }} />
        </div>
      </div>
    </div>
  );
}

export default function LoadingGrid({ count = 6 }) {
  return (
    <div className="job-grid">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
