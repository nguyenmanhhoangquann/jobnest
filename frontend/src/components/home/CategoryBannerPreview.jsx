import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaFire,
  FaCheckCircle,
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaArrowUp,
  FaBuilding,
} from 'react-icons/fa';

export default function CategoryBannerPreview({ category }) {
  if (!category) return null;

  return (
    <div className="category-showcase-card">
      {/* Background glow effects */}
      <div className="showcase-glow-radial" />
      <div className="showcase-grid-pattern" />

      <div className="row g-4 align-items-center h-100 position-relative z-2">
        {/* Left Column: Info & Actions */}
        <div className="col-12 col-xl-7 d-flex flex-column justify-content-between h-100 showcase-info-col">
          <div>
            {/* Top Badges */}
            <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
              <span className="badge badge-trend">
                <FaFire className="me-1 text-danger" size={12} /> Xu hướng tuyển dụng
              </span>
              <span className="badge badge-count">
                {category.jobCount?.toLocaleString('vi-VN')}+ việc làm
              </span>
            </div>

            {/* Title */}
            <h2 className="showcase-title mb-2">
              Việc làm <span className="text-highlight">{category.name}</span>
            </h2>

            {/* Description */}
            <p className="showcase-desc mb-3">
              Kết nối trực tiếp với hơn 500+ doanh nghiệp uy tín đang tuyển dụng nhân tài chuyên môn cao.
            </p>

            {/* Hot Roles */}
            {category.popularRoles && (
              <div className="showcase-roles mb-4">
                <span className="showcase-roles-label">Vị trí hot:</span>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {category.popularRoles.slice(0, 4).map((role, idx) => (
                    <span key={idx} className="badge badge-role">
                      <FaCheckCircle className="text-warning me-1" size={10} />
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action bar */}
          <div className="showcase-bottom-bar d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25 mt-auto">
            <Link
              to={`/jobs?category=${category.slug}`}
              className="btn btn-showcase-cta d-inline-flex align-items-center gap-2"
            >
              <span>Khám phá ngay</span>
              <FaArrowRight size={13} />
            </Link>

            <div className="showcase-slogan text-white-50 font-hand fs-5 d-none d-sm-block">
              Your Career. Your Future.
            </div>
          </div>
        </div>

        {/* Right Column: 3D Tech & Chart Mockup Graphic */}
        <div className="col-12 col-xl-5 d-none d-md-flex align-items-center justify-content-center showcase-visual-col">
          <div className="mockup-scene">
            {/* 3D Phone Mockup */}
            <div className="mockup-phone">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-header d-flex justify-content-between align-items-center">
                  <div className="small fw-bold text-warning d-flex align-items-center gap-1">
                    <FaBuilding size={11} /> {category.slug.toUpperCase()}
                  </div>
                  <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 font-monospace" style={{ fontSize: '10px' }}>
                    <FaArrowUp size={8} className="me-1" /> +38%
                  </span>
                </div>

                {/* Internal Mini Chart Bars */}
                <div className="phone-bars-container mt-3">
                  <div className="phone-bar" style={{ height: '40%' }} />
                  <div className="phone-bar" style={{ height: '65%' }} />
                  <div className="phone-bar" style={{ height: '50%' }} />
                  <div className="phone-bar phone-bar--active" style={{ height: '90%' }} />
                  <div className="phone-bar" style={{ height: '70%' }} />
                  <div className="phone-bar" style={{ height: '85%' }} />
                </div>

                <div className="phone-stat-box mt-3 p-2 rounded">
                  <div className="small text-white-50" style={{ fontSize: '10px' }}>Cơ hội mở mới</div>
                  <div className="fw-bold text-white fs-6">+{category.jobCount || 432} tin tuyển dụng</div>
                </div>
              </div>
            </div>

            {/* Floating Glassmorphism Widget 1: Growth line */}
            <div className="floating-card floating-card--top-right">
              <div className="d-flex align-items-center gap-2">
                <div className="floating-icon-box bg-warning bg-opacity-25 text-warning">
                  <FaChartLine size={13} />
                </div>
                <div>
                  <div className="floating-label">Tăng trưởng</div>
                  <div className="floating-val text-success fw-bold">+28.5%</div>
                </div>
              </div>
            </div>

            {/* Floating Glassmorphism Widget 2: Donut share */}
            <div className="floating-card floating-card--bottom-left">
              <div className="d-flex align-items-center gap-2">
                <div className="floating-icon-box bg-primary bg-opacity-25 text-info">
                  <FaChartPie size={13} />
                </div>
                <div>
                  <div className="floating-label">Độ tương thích</div>
                  <div className="floating-val text-warning fw-bold">96% AI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
