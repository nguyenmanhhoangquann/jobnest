import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaChevronRight,
  FaLaptopCode,
  FaBullhorn,
  FaTags,
  FaPaintBrush,
  FaCalculator,
  FaUserTie,
  FaLandmark,
  FaServer,
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
};

export default function CategorySidebar({ activeCategory, onHoverCategory }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    categoryApi.getCategories({ top: 8 }).then((data) => {
      setCategories(data);
      if (data.length > 0 && !activeCategory && onHoverCategory) {
        onHoverCategory(data[0]);
      }
    });
  }, []);

  return (
    <aside className="category-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="category-sidebar__title">Danh mục việc làm</h3>
        <Link to="/jobs" className="category-sidebar__link">
          Tất cả →
        </Link>
      </div>

      <div className="category-sidebar__list">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || FaBriefcase;
          const isActive = activeCategory?.id === cat.id;

          return (
            <div
              key={cat.id}
              className={`category-row ${isActive ? 'category-row--active' : ''}`}
              onMouseEnter={() => onHoverCategory && onHoverCategory(cat)}
              onClick={() => navigate(`/jobs?category=${cat.slug}`)}
            >
              <div className="category-row__icon">
                <IconComponent size={15} />
              </div>
              <span className="category-row__name">{cat.name}</span>
              <span className="category-row__count">
                {cat.jobCount.toLocaleString('vi-VN')}+
              </span>
              <FaChevronRight size={10} className="category-row__arrow" />
            </div>
          );
        })}
      </div>
    </aside>
  );
}
