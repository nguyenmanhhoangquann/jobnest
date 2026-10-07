import React from 'react';
import { Link } from 'react-router-dom';
import { FaGem, FaStar } from 'react-icons/fa';
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
      {/* Phía trên: Logo + Tiêu đề + Tên công ty */}
      <div className="job-card__main">
        <Link to={`/jobs/${id}`} className="job-card__logo" aria-label={companyName}>
          {companyLogo ? (
            <img src={companyLogo} alt="" loading="lazy" />
          ) : (
            <span className="job-card__logo-fallback">{initialChar}</span>
          )}
        </Link>

        <div className="job-card__content">
          {(isTop || isHot || isUrgent) && (
            <div className="job-card__badges">
              {isTop && (
                <span className="badge-top">
                  <FaGem className="me-1" size={8} /> TOP
                </span>
              )}
              {isHot && (
                <span className="badge-hot">
                  <FaStar className="me-1" size={8} /> NỔI BẬT
                </span>
              )}
              {isUrgent && <span className="badge-urgent">GẤP</span>}
            </div>
          )}

          <h3 className="job-card__title">
            <Link to={`/jobs/${id}`} title={title}>
              {title}
            </Link>
          </h3>

          <p className="job-card__company" title={companyName}>
            {companyName}
          </p>
        </div>
      </div>

      {/* Phía dưới: Chip lương, Địa điểm & Nút Lưu việc */}
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
