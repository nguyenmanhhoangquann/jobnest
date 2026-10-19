import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import SaveButton from './SaveButton.jsx';

const getCompanySize = (comp) => {
  if (comp?.size) return comp.size;
  const name = (comp?.name || '').toLowerCase();
  if (name.includes('viettel') || name.includes('fpt') || name.includes('hòa phát') || name.includes('vinhomes')) return '10.000+ nhân sự';
  if (name.includes('mb') || name.includes('quân đội') || name.includes('vinamilk') || name.includes('vib')) return '5.000 - 10.000';
  if (name.includes('misa') || name.includes('concentrix') || name.includes('novaland') || name.includes('sunhouse')) return '1.000 - 5.000';
  if (name.includes('toshiba') || name.includes('ssi') || name.includes('k&m')) return '501 - 1.000';
  return '51 - 200 nhân sự';
};

const resolveCompanyLogo = (company) => {
  const name = (company?.name || '').toLowerCase();
  const url = company?.logoUrl || company?.logo || '';
  if (name.includes('fpt')) return '/images/companies/fpt.png';
  if (name.includes('mb') || name.includes('quân đội')) return '/images/companies/mb-bank.png';
  if (name.includes('vinamilk')) return '/images/companies/vinamilk.png';
  if (name.includes('toshiba')) return '/images/companies/toshiba.png';
  if (name.includes('viettel')) return '/images/companies/viettel.svg';
  return url || '/images/companies/fpt.png';
};

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
  const companyLogo = resolveCompanyLogo(company);
  const initialChar = companyName.trim().charAt(0).toUpperCase();

  // Layout danh sách dạng hàng ngang chuẩn phong cách Himalayas (dành cho trang Tìm việc làm /jobs)
  if (variant === 'search-item') {
    const companySize = getCompanySize(company);
    const timeAgo = job.timeAgo || '2 ngày trước';
    const jobTypeLabel =
      job.jobType === 'FULL_TIME'
        ? 'Toàn thời gian'
        : job.jobType === 'PART_TIME'
        ? 'Bán thời gian'
        : 'Thực tập / Hợp đồng';

    const expLabel =
      job.experience === 'none'
        ? 'Không yêu cầu kn'
        : job.experience === 'lt1' || job.experience === '1-year'
        ? '< 1 năm kn'
        : job.experience === '1-2' || job.experience === '2-years'
        ? '1 - 2 năm kn'
        : job.experience === 'gt5'
        ? 'Trên 5 năm kn'
        : '2 - 5 năm kn';

    return (
      <article className={`himalayas-job-card ${isTop ? 'himalayas-job-card--top' : ''}`}>
        {/* Left: Circular Company Logo (Himalayas Style) */}
        <div className="himalayas-card__logo-wrap">
          <Link to={`/jobs/${id}`} className="himalayas-card__logo" aria-label={companyName}>
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
              className="himalayas-card__logo-fallback"
              style={{ display: companyLogo ? 'none' : 'flex' }}
            >
              {initialChar}
            </span>
          </Link>
        </div>

        {/* Center / Main Content */}
        <div className="himalayas-card__main">
          {/* Row 1: Title (left) & Time Posted (right) */}
          <div className="himalayas-card__header">
            <h3 className="himalayas-card__title">
              <Link to={`/jobs/${id}`} title={title}>
                {title}
              </Link>
            </h3>
            <span className="himalayas-card__time">{timeAgo}</span>
          </div>

          {/* Row 2: Company details, Verified Badge, Size, Benefits, Tech stack, Salaries */}
          <div className="himalayas-card__meta">
            <span className="himalayas-card__company">{companyName}</span>

            {/* Blue scalloped verified badge */}
            <span className="himalayas-verified-badge" title="Doanh nghiệp đã xác thực">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.4 4.8L18.1 4.5L19.2 8L22.6 9.6L21.7 13.3L23.4 16.7L20 18.4L19.4 22.1L15.7 22.3L13.7 25.4L12 23L10.3 25.4L8.3 22.3L4.6 22.1L4 18.4L0.6 16.7L2.3 13.3L1.4 9.6L4.8 8L5.9 4.5L9.6 4.8L12 2Z"
                  fill="#2563EB"
                />
                <path
                  d="M9 12L11 14L15 9"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            {/* Company Size */}
            <span className="himalayas-meta-pill" title="Quy mô công ty">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>{companySize}</span>
            </span>

            {/* Benefits link */}
            <Link to={`/jobs/${id}`} className="himalayas-meta-link" title="Xem chế độ đãi ngộ & phúc lợi">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
              </svg>
              <span className="himalayas-underlined-text">Phúc lợi</span>
            </Link>

            {/* Tech stack link */}
            <Link to={`/jobs/${id}`} className="himalayas-meta-link" title="Xem ngăn xếp công nghệ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 2 10 5-10 5-10-5Z" />
                <path d="m2 12 10 5 10-5" />
                <path d="m2 17 10 5 10-5" />
              </svg>
              <span className="himalayas-underlined-text">Công nghệ</span>
            </Link>

            {/* Salaries Indicator */}
            <span className="himalayas-meta-pill himalayas-meta-pill--salary" title="Mức thu nhập">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12M15 9.5a2.5 2.5 0 0 0-5 0c0 4 6 2 6 6a2.5 2.5 0 0 1-5 0" />
              </svg>
              <Link to={`/jobs/${id}`} className="himalayas-meta-link">
                <span className="himalayas-underlined-text">Mức lương</span>
              </Link>
              {salaryText && <span className="fw-semibold text-dark ms-1.5">{salaryText}</span>}
            </span>
          </div>

          {/* Row 3: Tags on left, Star Bookmark on right (NO apply button) */}
          <div className="himalayas-card__footer">
            <div className="himalayas-card__tags">
              {/* Location Tag */}
              {location && (
                <span className="himalayas-tag-pill himalayas-tag-pill--loc">
                  <span>{location}</span>
                </span>
              )}

              {/* Employment Type Tag */}
              <span className="himalayas-tag-pill">{jobTypeLabel}</span>

              {/* Role / Category Tag with Purple Dot */}
              {job.category?.name && (
                <span className="himalayas-tag-pill himalayas-tag-pill--role">
                  <span className="himalayas-purple-dot" />
                  <span>{job.category.name}</span>
                </span>
              )}

              {/* Tech Skill Tags */}
              {job.skills &&
                job.skills.slice(0, 3).map((skill, sIdx) => (
                  <span key={sIdx} className="himalayas-tag-pill himalayas-tag-pill--skill">
                    {skill}
                  </span>
                ))}
            </div>

            <div className="himalayas-card__actions">
              <SaveButton jobId={id} initialSaved={saved} variant="star" />
            </div>
          </div>
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
                ? 'Toàn thời gian'
                : job.jobType === 'PART_TIME'
                ? 'Bán thời gian'
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
