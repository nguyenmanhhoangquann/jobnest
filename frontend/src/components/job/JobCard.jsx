import React from 'react';
import { Link } from 'react-router-dom';
import { FaGem, FaFire } from 'react-icons/fa';
import SaveButton from './SaveButton.jsx';

export default function JobCard({ job, variant = 'card', extra }) {
  if (!job) return null;

  const {
    id,
    title,
    company = {},
    salaryText,
    location,
    isHot,
    isUrgent,
    isTop,
    saved = false,
  } = job;

  const companyName = company.name || 'Công ty ẩn danh';
  const companyLogo = company.logoUrl;
  const initialChar = companyName.trim().charAt(0).toUpperCase();

  // TopCV Horizontal Format (dành cho trang Tìm việc làm /jobs)
  if (variant === 'search-item') {
    return (
      <article className={`job-search-item ${isTop ? 'job-search-item--top' : ''}`}>
        <div className="job-search-item__logo-wrap">
          <Link to={`/jobs/${id}`} className="job-search-item__logo" aria-label={companyName}>
            {companyLogo ? (
              <img src={companyLogo} alt="" loading="lazy" />
            ) : (
              <span className="job-search-item__logo-fallback">{initialChar}</span>
            )}
          </Link>
        </div>

        <div className="job-search-item__content">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            {isTop && (
              <span className="badge-inline badge-top">
                <FaGem size={8} className="me-1" /> TOP
              </span>
            )}
            {isHot && (
              <span className="badge-inline badge-hot">
                <FaFire size={8} className="me-1" /> HOT
              </span>
            )}
            {isUrgent && <span className="badge-inline badge-urgent">GẤP</span>}
            <h3 className="job-search-item__title mb-0">
              <Link to={`/jobs/${id}`} title={title}>
                {title}
              </Link>
            </h3>
          </div>

          <p className="job-search-item__company" title={companyName}>
            {companyName}
          </p>

          <div className="job-search-item__tags">
            {salaryText && <span className="job-tag job-tag--salary">{salaryText}</span>}
            {location && <span className="job-tag job-tag--location">{location}</span>}
            {job.experience && (
              <span className="job-tag job-tag--location">
                {job.experience === 'lt1' ? '< 1 năm kinh nghiệm' : job.experience === '1-2' ? '1 - 2 năm kinh nghiệm' : '2 - 5 năm kinh nghiệm'}
              </span>
            )}
            {job.jobType && (
              <span className="job-tag job-tag--location">
                {job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType === 'PART_TIME' ? 'Bán thời gian' : 'Thực tập'}
              </span>
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

  // Mặc định: Dạng Card ô vuông nhỏ gọn (dành cho Trang chủ)
  return (
    <article className={`job-card ${isTop ? 'job-card--top' : ''}`}>
      <div className="job-card__main">
        <Link to={`/jobs/${id}`} className="job-card__logo" aria-label={companyName}>
          {companyLogo ? (
            <img src={companyLogo} alt="" loading="lazy" />
          ) : (
            <span className="job-card__logo-fallback">{initialChar}</span>
          )}
        </Link>

        <div className="job-card__content">
          <h3 className="job-card__title">
            {isTop && (
              <span className="badge-inline badge-top me-1">
                <FaGem size={8} className="me-1" />
                TOP
              </span>
            )}
            {isHot && (
              <span className="badge-inline badge-hot me-1">
                <FaFire size={8} className="me-1" />
                HOT
              </span>
            )}
            {isUrgent && <span className="badge-inline badge-urgent me-1">GẤP</span>}
            <Link to={`/jobs/${id}`} title={title}>
              {title}
            </Link>
          </h3>

          <p className="job-card__company" title={companyName}>
            {companyName}
          </p>
        </div>
      </div>

      <div className="job-card__footer">
        <div className="job-card__tags">
          {salaryText && <span className="job-tag job-tag--salary">{salaryText}</span>}
          {location && <span className="job-tag job-tag--location">{location}</span>}
        </div>
        <div className="job-card__save">
          <SaveButton jobId={id} initialSaved={saved} />
        </div>
      </div>

      {extra && <div className="job-card__extra">{extra}</div>}
    </article>
  );
}
