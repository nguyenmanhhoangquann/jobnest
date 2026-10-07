import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaFire, FaCheckCircle } from 'react-icons/fa';

export default function CategoryBannerPreview({ category }) {
  if (!category) return null;

  return (
    <div className="category-preview-card">
      {/* Ảnh nền trực quan ngành nghề */}
      <img
        src={category.image}
        alt={category.name}
        className="category-preview-card__image"
        loading="lazy"
      />

      {/* Lớp phủ chuyển sắc tối nhẹ để đọc rõ chữ */}
      <div className="category-preview-card__overlay" />

      {/* Nội dung tương ứng ngành nghề */}
      <div className="category-preview-card__content">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="badge bg-warning text-dark fw-bold px-2 py-1">
            <FaFire className="me-1" size={11} /> Xu hướng tuyển dụng
          </span>
          <span className="badge bg-dark text-white opacity-75 small">
            {category.jobCount?.toLocaleString('vi-VN')}+ việc làm
          </span>
        </div>

        <h3 className="category-preview-card__title">
          Việc làm {category.name}
        </h3>

        <p className="category-preview-card__desc">
          Kết nối trực tiếp với hơn 500+ doanh nghiệp hàng đầu đang tìm kiếm nhân sự tài năng.
        </p>

        {/* Vị trí / Kỹ năng tiêu biểu */}
        {category.popularRoles && (
          <div className="category-preview-card__tags mb-3">
            <span className="small text-white-50 me-2 d-none d-sm-inline">Vị trí hot:</span>
            {category.popularRoles.slice(0, 4).map((role, idx) => (
              <span key={idx} className="badge bg-white text-dark me-1 mb-1 fw-normal">
                <FaCheckCircle className="text-warning me-1" size={10} />
                {role}
              </span>
            ))}
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between pt-2">
          {/* Slogan viết tay font Caveat (Mục 7.3 PDF) */}
          <div className="preview-slogan font-hand text-warning fs-5">
            Your Career. Your Future.
          </div>

          <Link
            to={`/jobs?category=${category.slug}`}
            className="btn btn-brand fw-bold px-3 py-2 d-inline-flex align-items-center gap-2"
          >
            <span>Khám phá ngay</span>
            <FaArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
