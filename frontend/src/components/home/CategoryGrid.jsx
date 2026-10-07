import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaLaptopCode,
  FaBullhorn,
  FaTags,
  FaPaintBrush,
  FaCalculator,
  FaUserTie,
  FaLandmark,
  FaServer,
  FaHeadset,
  FaBuilding,
  FaBriefcase,
} from 'react-icons/fa';
import categoryApi from '../../api/categoryApi.js';

const iconMap = {
  FaLaptopCode,
  FaBullhorn,
  FaTags,
  FaPaintBrush,
  FaCalculator,
  FaUserTie,
  FaLandmark,
  FaServer,
  FaHeadset,
  FaBuilding,
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    categoryApi.getCategories().then((data) => setCategories(data));
  }, []);

  const pageSize = 8;
  const totalPages = Math.ceil(categories.length / pageSize) || 1;
  const currentCategories = categories.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <section className="category-grid-section py-5">
      <div className="container-app">
        {/* Tiêu đề & Nút chuyển trang */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">Top ngành nghề nổi bật</h2>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="circle-nav-btn"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Trang ngành nghề trước"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              type="button"
              className={`circle-nav-btn ${page < totalPages - 1 ? 'circle-nav-btn--active' : ''}`}
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Trang ngành nghề sau"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Lưới 4x2 các thẻ ngành nghề */}
        <div className="category-grid">
          {currentCategories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || FaBriefcase;
            return (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => navigate(`/jobs?category=${cat.slug}`)}
              >
                <div className="category-card__icon-box">
                  <IconComponent size={28} />
                </div>
                <h3 className="category-card__title">{cat.name}</h3>
                <span className="category-card__count">
                  {cat.jobCount.toLocaleString('vi-VN')} việc làm
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
