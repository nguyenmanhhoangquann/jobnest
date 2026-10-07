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
      {/* Cột trái: Logo */}
      <Link to={`/jobs/${id}`} className="job-card__logo" aria-label={companyName}>
        {companyLogo ? (
          <img src={companyLogo} alt="" loading="lazy" />
        ) : (
          <span className="job-card__logo-fallback">{initialChar}</span>
        )}
      </Link>

      {/* Cột phải: Nội dung thẻ */}
      <div className="job-card__body">
        {/* Hàng badge TOP / NỔI BẬT / GẤP chuẩn TopCV */}
        {(isTop || isHot || isUrgent) && (
          <div className="job-card__badges">
            {isTop && (
              <span className="badge-top">
                <FaGem className="me-1" size={9} /> TOP
              </span>
            )}
            {isHot && (
              <span className="badge-hot">
                <FaStar className="me-1" size={9} /> NỔI BẬT
              </span>
            )}
            {isUrgent && <span className="badge-urgent">GẤP</span>}
          </div>
        )}

        {/* Tiêu đề việc làm (tối đa 2 dòng, có tooltip title) */}
        <h3 className="job-card__title">
          <Link to={`/jobs/${id}`} title={title}>
            {title}
          </Link>
        </h3>

        {/* Tên công ty (1 dòng, cắt ...) */}
        <p className="job-card__company" title={companyName}>
          {companyName}
        </p>

        {/* Hàng chip: Lương, Địa điểm + Nút Lưu */}
        <div className="job-card__meta">
          <div className="job-card__meta-tags">
            {salaryText && <span className="chip chip-salary">{salaryText}</span>}
            {location && <span className="chip chip-location">{location}</span>}
          </div>
          <div className="save-btn-wrapper">
            <SaveButton jobId={id} initialSaved={saved} />
          </div>
        </div>

        {/* Phần mở rộng nếu có (ví dụ trạng thái ở trang AppliedJobs) */}
        {extra && <div className="job-card__extra mt-2 pt-2 border-top">{extra}</div>}
      </div>
    </article>
  );
}
