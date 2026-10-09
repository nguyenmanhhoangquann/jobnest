import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FaSearch,
  FaBuilding,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCheckCircle,
  FaUsers,
  FaGlobe,
  FaArrowLeft,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowRight,
} from 'react-icons/fa';
import mockCompanies from '../mock/companies.js';

const CATEGORY_TABS = [
  { id: 'ALL', label: 'Tất cả lĩnh vực' },
  { id: 'IT - Phần mềm', label: 'IT - Phần mềm' },
  { id: 'Ngân hàng', label: 'Ngân hàng' },
  { id: 'IT - Viễn thông', label: 'IT - Viễn thông' },
  { id: 'Sản xuất', label: 'Sản xuất' },
  { id: 'Dịch vụ Khách hàng', label: 'Dịch vụ Khách hàng' },
  { id: 'Kinh doanh - Bán hàng', label: 'Kinh doanh - Bán hàng' },
];

const SEARCH_HINTS = ['FPT', 'Ngân hàng', 'IT', 'Marketing', 'Hà Nội', 'TP.HCM'];

export default function Companies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCompanyId = searchParams.get('id');

  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeIndustry, setActiveIndustry] = useState('ALL');

  const filteredCompanies = useMemo(() => {
    return mockCompanies.filter((c) => {
      if (activeIndustry !== 'ALL' && !c.industry.includes(activeIndustry)) {
        return false;
      }
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        return (
          c.name.toLowerCase().includes(kw) ||
          c.shortName.toLowerCase().includes(kw) ||
          c.industry.toLowerCase().includes(kw) ||
          c.location.toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [searchKeyword, activeIndustry]);

  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) return null;
    return mockCompanies.find((c) => String(c.id) === String(selectedCompanyId));
  }, [selectedCompanyId]);

  // NẾU ĐANG CHỌN 1 CÔNG TY -> XEM CHI TIẾT CÔNG TY & VIỆC LÀM ĐANG MỞ
  if (selectedCompany) {
    return (
      <div className="companies-page-root py-4">
        <div className="container" style={{ maxWidth: '1200px' }}>
          {/* Nút quay lại */}
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0 text-muted small d-inline-flex align-items-center gap-1.5 fw-medium"
              onClick={() => setSearchParams({})}
            >
              <FaArrowLeft size={12} />
              <span>Quay lại danh sách công ty</span>
            </button>
          </div>

          {/* Banner & Header Thông tin công ty (Độ tương phản cao, chữ không bị đè ảnh) */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-5">
            <div
              className="company-cover"
              style={{
                height: '220px',
                backgroundImage: `url(${selectedCompany.cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)' }}
              />
            </div>

            {/* Khối thông tin nằm 100% trên nền trắng sắc nét */}
            <div className="p-4 p-md-5 pt-0 position-relative">
              {/* Logo bo góc nổi 50% đè mép ảnh */}
              <div
                className="rounded-4 bg-white p-2 shadow border"
                style={{
                  width: '96px',
                  height: '96px',
                  marginTop: '-48px',
                  marginBottom: '18px',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <img
                  src={selectedCompany.logo}
                  alt={selectedCompany.name}
                  className="w-100 h-100 rounded-3 object-fit-cover"
                />
              </div>

              {/* Tên công ty & Huy hiệu */}
              <div className="d-flex align-items-center gap-2.5 flex-wrap mb-1.5">
                <h1 className="h3 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.02em', color: '#111827' }}>
                  {selectedCompany.name}
                </h1>
                {selectedCompany.verified && (
                  <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 py-1 px-2.5 fw-semibold">
                    <FaCheckCircle size={11} /> Doanh nghiệp xác thực
                  </span>
                )}
              </div>

              <p className="text-secondary mb-3" style={{ fontSize: '15px' }}>
                {selectedCompany.shortName} • <span className="fw-medium text-dark">{selectedCompany.industry}</span>
              </p>

              {/* Thông tin nhanh: Địa điểm, Quy mô, Website */}
              <div className="d-flex flex-wrap gap-2.5 mb-4">
                <span className="badge bg-light text-secondary border px-3 py-2 fw-medium d-inline-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                  <FaMapMarkerAlt className="text-secondary" size={12} />
                  {selectedCompany.location}
                </span>
                <span className="badge bg-light text-secondary border px-3 py-2 fw-medium d-inline-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                  <FaUsers className="text-secondary" size={12} />
                  Quy mô: {selectedCompany.size}
                </span>
                {selectedCompany.website && (
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noreferrer"
                    className="badge bg-light text-primary border px-3 py-2 fw-medium d-inline-flex align-items-center gap-1.5 text-decoration-none"
                    style={{ fontSize: '13px' }}
                  >
                    <FaGlobe size={12} />
                    {selectedCompany.website.replace('https://', '')}
                  </a>
                )}
              </div>

              {/* Giới thiệu doanh nghiệp */}
              <div className="pt-3.5 border-top">
                <h2 className="h6 fw-bold text-dark mb-2">Về chúng tôi</h2>
                <p className="text-secondary mb-0" style={{ lineHeight: '1.7', fontSize: '14.5px', color: '#374151' }}>
                  {selectedCompany.description}
                </p>
              </div>
            </div>
          </div>

          {/* DANH SÁCH CÁC ĐƠN TUYỂN DỤNG CỦA CÔNG TY (THEO PHONG CÁCH AWWWARDS) */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-end mb-3.5">
              <div>
                <span className="small fw-bold text-uppercase text-muted" style={{ letterSpacing: '1.5px', fontSize: '11.5px' }}>
                  CAREER OPPORTUNITIES // LIVE POSITIONS
                </span>
                <h2 className="h4 fw-bold text-dark mb-1 mt-1">
                  Vị trí tuyển dụng đang mở ({selectedCompany.jobs?.length || 0})
                </h2>
                <p className="text-muted small mb-0">Các cơ hội việc làm tuyển dụng trực tiếp từ {selectedCompany.shortName}</p>
              </div>
            </div>

            {selectedCompany.jobs?.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                <FaBriefcase size={36} className="text-muted mb-2 mx-auto" />
                <h3 className="h6 fw-bold text-dark mb-1">Chưa có bài đăng tuyển dụng</h3>
                <p className="text-muted small mb-0">Hiện tại doanh nghiệp chưa mở đơn tuyển dụng mới nào.</p>
              </div>
            ) : (
              <div className="row g-3 g-md-4">
                {selectedCompany.jobs.map((job) => (
                  <div key={job.id} className="col-12 col-md-6">
                    <div
                      className="awwwards-card p-4 d-flex flex-column justify-content-between h-100"
                      style={{ cursor: 'pointer' }}
                    >
                      <div>
                        {/* Top Meta: Loại công việc & Mức lương */}
                        <div className="d-flex justify-content-between align-items-center mb-2.5">
                          <span
                            className="badge bg-dark text-white rounded-pill px-2.5 py-1"
                            style={{ fontSize: '11px', letterSpacing: '0.5px' }}
                          >
                            {job.jobType === 'FULL_TIME' ? 'TOÀN THỜI GIAN' : 'THỰC TẬP'}
                          </span>

                          <span className="fw-bold text-success d-inline-flex align-items-center gap-1.5" style={{ fontSize: '14.5px' }}>
                            <FaMoneyBillWave size={13} />
                            {job.salaryText}
                          </span>
                        </div>

                        {/* Tiêu đề công việc */}
                        <h3 className="h5 fw-bold text-dark mb-2" style={{ lineHeight: '1.4', fontSize: '17.5px' }}>
                          <Link to={`/jobs/${job.id}`} className="text-dark text-decoration-none">
                            {job.title}
                          </Link>
                        </h3>

                        {/* Địa điểm làm việc */}
                        <div className="text-muted small d-flex align-items-center gap-1.5 mb-3">
                          <FaMapMarkerAlt size={12} className="text-secondary" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      {/* Footer: Hạn nộp & Nút mũi tên tương tác */}
                      <div className="pt-3 border-top d-flex justify-content-between align-items-center mt-auto">
                        <span className="text-muted small" style={{ fontSize: '12.5px' }}>
                          <FaCalendarAlt className="me-1 text-muted" size={11} />
                          Hạn nộp: <strong className="text-dark">{job.deadline}</strong>
                        </span>

                        <Link
                          to={`/jobs/${job.id}`}
                          className="btn btn-sm btn-dark fw-semibold py-1.5 px-3 rounded-pill d-inline-flex align-items-center gap-2"
                          style={{ fontSize: '13px' }}
                        >
                          <span>Ứng tuyển ngay</span>
                          <FaArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // GIAO DIỆN CHÍNH: DANH SÁCH DOANH NGHIỆP HÀNG ĐẦU
  return (
    <div className="companies-page-root">
      {/* 1. HERO SECTION */}
      <section className="companies-hero-box">
        <div className="companies-hero-decor-1" />
        <div className="companies-hero-decor-2" />

        <div className="container position-relative" style={{ maxWidth: '960px', zIndex: 2 }}>
          {/* Large headline */}
          <h1 className="companies-hero-title">
            Khám phá văn hóa & <span className="highlight-yellow">Cơ hội việc làm</span>
          </h1>

          {/* Subtitle */}
          <p className="companies-hero-subtitle">
            Tìm hiểu môi trường làm việc, chế độ đãi ngộ và các vị trí đang tuyển dụng từ những doanh nghiệp uy tín.
          </p>

          {/* Large Modern Search Bar */}
          <div className="companies-search-bar">
            <FaSearch className="text-muted flex-shrink-0" size={16} />
            <input
              type="text"
              className="companies-search-input"
              placeholder="Tìm tên công ty, ngành nghề hoặc địa điểm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              type="button"
              className="companies-search-btn"
              onClick={() => {}}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTER & 3. COMPANY SECTION */}
      <div className="container py-4" style={{ maxWidth: '1280px' }}>
        {/* Category Filter Buttons (Pill shaped) */}
        <div className="companies-filter-nav mb-4">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeIndustry === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`companies-pill-btn ${isActive ? 'companies-pill-btn--active' : ''}`}
                onClick={() => setActiveIndustry(tab.id)}
              >
                {isActive && <span className="companies-pill-accent" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="companies-section-header">
          <div>
            <h2 className="companies-section-title">Doanh nghiệp nổi bật</h2>
            <p className="companies-section-subtitle">
              Khám phá môi trường làm việc và cơ hội nghề nghiệp từ các doanh nghiệp hàng đầu.
            </p>
          </div>

          <div>
            {activeIndustry !== 'ALL' || searchKeyword ? (
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 text-secondary small fw-semibold"
                onClick={() => {
                  setActiveIndustry('ALL');
                  setSearchKeyword('');
                }}
              >
                Xem tất cả →
              </button>
            ) : (
              <span className="small text-muted fw-semibold">
                Hiển thị {filteredCompanies.length} doanh nghiệp
              </span>
            )}
          </div>
        </div>

        {/* 4. COMPANY CARDS (3-COLUMN RESPONSIVE GRID) */}
        {filteredCompanies.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
            <FaBuilding size={42} className="text-muted mb-2 mx-auto" />
            <h3 className="h6 fw-bold text-dark mb-1">Không tìm thấy công ty phù hợp</h3>
            <p className="text-muted small mb-3">Vui lòng thử lại với từ khóa tìm kiếm hoặc danh mục khác.</p>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mx-auto"
              onClick={() => {
                setSearchKeyword('');
                setActiveIndustry('ALL');
              }}
            >
              Xem tất cả doanh nghiệp
            </button>
          </div>
        ) : (
          <div className="row g-3 g-lg-3.5">
            {filteredCompanies.map((comp) => (
              <div key={comp.id} className="col-12 col-sm-6 col-lg-3">
                <div
                  className="company-card-premium"
                  onClick={() => setSearchParams({ id: comp.id })}
                >
                  {/* 16:9 Cover Image with Rounded Top */}
                  <div className="company-card-cover-wrap">
                    <img
                      src={comp.cover}
                      alt={comp.name}
                      className="company-card-cover-img"
                    />
                  </div>

                  {/* Body with overlapping logo */}
                  <div className="company-card-body">
                    {/* Company Logo Overlap */}
                    <div className="company-card-logo-overlap">
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="company-card-logo-img"
                      />
                    </div>

                    {/* Company Name & Verified Badge */}
                    <div className="company-name-row">
                      <h3 className="company-card-name text-truncate" title={comp.name}>
                        {comp.shortName || comp.name}
                      </h3>
                      {comp.verified && (
                        <FaCheckCircle
                          className="text-success flex-shrink-0"
                          size={14}
                          title="Doanh nghiệp đã xác thực"
                        />
                      )}
                    </div>

                    {/* Industry */}
                    <div className="company-card-industry text-truncate">
                      {comp.industry}
                    </div>

                    {/* Location */}
                    <div className="company-card-location">
                      <FaMapMarkerAlt size={13} className="text-secondary flex-shrink-0" />
                      <span className="text-truncate">{comp.location}</span>
                    </div>

                    {/* Footer: Yellow Job Count Badge + CTA */}
                    <div className="company-card-footer">
                      <span className="company-jobs-badge">
                        {comp.jobs?.length || 0} việc làm đang tuyển
                      </span>

                      <div className="company-card-cta">
                        <span>Khám phá công ty</span>
                        <FaArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
