import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaFire,
  FaCheckCircle,
  FaBuilding,
} from 'react-icons/fa';

export default function CategoryBannerPreview({ category }) {
  if (!category) return null;

  return (
    <div className="category-showcase-card">
      {/* Background layer */}
      <div className="showcase-glow-radial" />
      <div className="showcase-grid-pattern" />

      <div className="row g-4 align-items-center h-100 position-relative z-2">
        {/* Cột trái: Thông tin ngành & Nút khám phá */}
        <div className="col-12 col-md-7 d-flex flex-column justify-content-between h-100 showcase-info-col">
          <div>
            <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
              <span className="badge badge-trend">
                <FaFire className="me-1 text-danger" size={12} /> Xu hướng tuyển dụng
              </span>
              <span className="badge badge-count">
                {category.jobCount?.toLocaleString('vi-VN')}+ việc làm
              </span>
            </div>

            <h2 className="showcase-title mb-2">
              Việc làm <span className="text-highlight">{category.name}</span>
            </h2>

            <p className="showcase-desc mb-3">
              Kết nối trực tiếp với hơn 500+ doanh nghiệp uy tín đang tuyển dụng nhân tài chuyên môn cao.
            </p>

            {category.popularRoles && (
              <div className="showcase-roles mb-4">
                <span className="showcase-roles-label">Vị trí tuyển dụng nổi bật:</span>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {category.popularRoles.slice(0, 5).map((role, idx) => (
                    <span key={idx} className="badge badge-role">
                      <FaCheckCircle className="text-warning me-1" size={10} />
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

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

        {/* Cột phải: Khung ảnh thực tế sắc nét theo từng ngành */}
        <div className="col-12 col-md-5 d-none d-md-flex align-items-center justify-content-center showcase-visual-col">
          <div className="showcase-real-photo-card">
            <img
              key={category.slug}
              src={category.image}
              alt={category.name}
              className="showcase-real-photo-img"
              loading="lazy"
            />
            <div className="showcase-real-photo-badge">
              <FaBuilding className="text-warning me-1" size={12} />
              <span>500+ Doanh nghiệp hàng đầu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
