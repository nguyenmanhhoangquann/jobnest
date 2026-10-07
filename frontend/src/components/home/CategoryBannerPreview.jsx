import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaFire, FaCheckCircle, FaBuilding } from 'react-icons/fa';

export default function CategoryBannerPreview({ category }) {
  if (!category) return null;

  return (
    <div className="category-showcase-card">
      {/* Ảnh thực tế làm Full Background toàn khung */}
      {category.image && (
        <img
          key={category.slug}
          src={category.image}
          alt={category.name}
          className="showcase-bg-image"
          loading="lazy"
        />
      )}

      {/* Lớp phủ gradient giữ chữ sắc nét tương phản cao */}
      <div className="showcase-bg-overlay" />
      <div className="showcase-glow-radial" />

      {/* Nội dung nổi trên nền ảnh */}
      <div className="position-relative z-2 d-flex flex-column justify-content-between h-100 showcase-inner-content">
        <div>
          {/* Huy hiệu trên cùng */}
          <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
            <span className="badge badge-trend">
              <FaFire className="me-1 text-danger" size={12} /> Xu hướng tuyển dụng
            </span>
            <span className="badge badge-count">
              {category.jobCount?.toLocaleString('vi-VN')}+ việc làm
            </span>
          </div>

          {/* Tiêu đề việc làm ngành */}
          <h2 className="showcase-title mb-2">
            Việc làm <span className="text-highlight">{category.name}</span>
          </h2>

          <p className="showcase-desc mb-3">
            Kết nối trực tiếp với hơn 500+ doanh nghiệp uy tín hàng đầu đang tuyển dụng nhân tài.
          </p>

          {/* Vị trí hot */}
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

        {/* Thanh hành động dưới cùng */}
        <div className="showcase-bottom-bar d-flex align-items-center justify-content-between pt-3 border-top border-light border-opacity-25 mt-auto">
          <Link
            to={`/jobs?category=${category.slug}`}
            className="btn btn-showcase-cta d-inline-flex align-items-center gap-2"
          >
            <span>Khám phá ngay</span>
            <FaArrowRight size={13} />
          </Link>

          <div className="d-flex align-items-center gap-2 text-white-50 small">
            <FaBuilding className="text-warning" size={13} />
            <span>500+ Doanh nghiệp liên kết</span>
          </div>
        </div>
      </div>
    </div>
  );
}
