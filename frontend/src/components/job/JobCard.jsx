import React from 'react';
import { Link } from 'react-router-dom';
import { FaGem, FaFire } from 'react-icons/fa';
import SaveButton from './SaveButton.jsx';

export default function JobCard({ job, extra }) {
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

  return (
    <article className={`job-card ${isTop ? 'job-card--top' : ''}`}>
      {/* Thân trên: Logo + Tiêu đề & Công ty */}
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

      {/* Thân dưới: Chip thông tin & Nút lưu */}
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
