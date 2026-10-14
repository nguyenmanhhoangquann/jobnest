import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import SaveButton from './SaveButton.jsx';

export default function JobCard({ job, variant = 'card', extra }) {
  if (!job) return null;

  const {
    id,
    title,
    company = {},
    salaryText,
    location,
    isTop,
    saved = false,
  } = job;

  const companyName = company.name || 'Công ty ẩn danh';
  const companyLogo = company.logoUrl;
  const initialChar = companyName.trim().charAt(0).toUpperCase();

  // Layout danh sách dạng hàng ngang kiểu Wellfound (dành cho trang Tìm việc làm /jobs)
  if (variant === 'search-item') {
    return (
      <article className={`job-search-item ${isTop ? 'job-search-item--top' : ''}`}>
        <div className="job-search-item__logo-wrap">
          <Link to={`/jobs/${id}`} className="job-search-item__logo" aria-label={companyName}>
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <span
              className="job-search-item__logo-fallback"
              style={{ display: companyLogo ? 'none' : 'flex' }}
            >
              {initialChar}
            </span>
          </Link>
        </div>

        <div className="job-search-item__content">
          <h3 className="job-search-item__title mb-1">
            <Link to={`/jobs/${id}`} title={title}>
              {title}
            </Link>
          </h3>

          <div className="job-meta-line text-muted small mb-2 d-flex flex-wrap align-items-center gap-2">
            <span className="d-inline-flex align-items-center gap-1">
              <span className="fw-semibold text-dark">{companyName}</span>
              <FaCheckCircle className="text-success flex-shrink-0" size={12} title="Doanh nghiệp xác thực" />
            </span>
            {location && (
              <>
                <span>•</span>
                <span>{location}</span>
              </>
            )}
            {salaryText && (
              <>
                <span>•</span>
                <span className="text-success fw-semibold">{salaryText}</span>
              </>
            )}
            {job.experience && (
              <>
                <span>•</span>
                <span>
                  {job.experience === 'none'
                    ? 'Không yêu cầu kn'
                    : job.experience === 'lt1'
                    ? '< 1 năm kn'
                    : job.experience === '1-2'
                    ? '1 - 2 năm kn'
                    : job.experience === 'gt5'
                    ? 'Trên 5 năm kn'
                    : '2 - 5 năm kn'}
                </span>
              </>
            )}
          </div>

          <div className="job-search-item__tags">
            {job.jobType && (
              <span className="job-tag job-tag--location">
                {job.jobType === 'FULL_TIME'
                  ? 'Toàn thời gian'
                  : job.jobType === 'PART_TIME'
                  ? 'Bán thời gian'
                  : 'Thực tập'}
              </span>
            )}
            {job.category?.name && (
              <span className="job-tag job-tag--location">{job.category.name}</span>
            )}
          </div>
        </div>

        <div className="job-search-item__actions">
          <SaveButton jobId={id} initialSaved={saved} />
          <Link to={`/jobs/${id}`} className="btn-apply-fast">
            Ứng tuyển
          </Link>
        </div>

        {extra && <div className="job-card__extra">{extra}</div>}
      </article>
    );
  }

  // Mặc định: Dạng Card ô vuông nhỏ gọn phong cách Wellfound (dành cho Trang chủ)
  return (
    <article className={`job-card ${isTop ? 'job-card--top' : ''}`}>
      <div className="job-card__main">
        <Link to={`/jobs/${id}`} className="job-card__logo" aria-label={companyName}>
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <span
            className="job-card__logo-fallback"
            style={{ display: companyLogo ? 'none' : 'flex' }}
          >
            {initialChar}
          </span>
        </Link>

        <div className="job-card__content">
          <h3 className="job-card__title">
            <Link to={`/jobs/${id}`} title={title}>
              {title}
            </Link>
          </h3>

          <p className="job-card__company d-flex align-items-center gap-1 mb-0" title={companyName}>
            <span className="text-truncate">{companyName}</span>
            <FaCheckCircle className="text-success flex-shrink-0" size={12} title="Doanh nghiệp xác thực" />
          </p>
        </div>
      </div>

      <div className="job-card__meta-line small text-muted my-2 d-flex align-items-center gap-1">
        {location && <span>{location}</span>}
        {location && salaryText && <span className="mx-1">•</span>}
        {salaryText && <span className="text-success fw-semibold">{salaryText}</span>}
      </div>

      <div className="job-card__footer">
        <div className="job-card__tags">
          {job.jobType && (
            <span className="job-tag job-tag--location">
              {job.jobType === 'FULL_TIME'
                ? 'Full time'
                : job.jobType === 'PART_TIME'
                ? 'Part time'
                : 'Thực tập'}
            </span>
          )}
        </div>
        <div className="d-flex align-items-center gap-2 ms-auto">
          <SaveButton jobId={id} initialSaved={saved} />
          <Link to={`/jobs/${id}`} className="btn-apply-fast-sm">
            Ứng tuyển
          </Link>
        </div>
      </div>

      {extra && <div className="job-card__extra">{extra}</div>}
    </article>
  );
}
