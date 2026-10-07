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

// Pastel colors for category icon badges
const iconColors = {
  cntt: { bg: '#EFF6FF', color: '#2563EB' },
  marketing: { bg: '#FDF2F8', color: '#DB2777' },
  'kinh-doanh': { bg: '#FEF3C7', color: '#D97706' },
  'thiet-ke': { bg: '#F5F3FF', color: '#7C3AED' },
  'ke-toan': { bg: '#ECFDF5', color: '#059669' },
  'nhan-su': { bg: '#FFF7ED', color: '#EA580C' },
  'tai-chinh': { bg: '#F0FDF4', color: '#16A34A' },
  devops: { bg: '#F1F5F9', color: '#475569' },
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
    <aside className="category-directory-card">
      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
        <h3 className="category-directory-title mb-0">Danh mục việc làm</h3>
        <Link to="/jobs" className="category-directory-link">
          Tất cả →
        </Link>
      </div>

      <div className="category-directory-list d-flex flex-column gap-1">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || FaBriefcase;
          const isActive = activeCategory?.id === cat.id;
          const colors = iconColors[cat.slug] || { bg: '#F3F4F6', color: '#374151' };

          return (
            <div
              key={cat.id}
              className={`category-item-row ${isActive ? 'category-item-row--active' : ''}`}
              onMouseEnter={() => onHoverCategory && onHoverCategory(cat)}
              onClick={() => navigate(`/jobs?category=${cat.slug}`)}
            >
              <div
                className="category-icon-box"
                style={{ backgroundColor: colors.bg, color: colors.color }}
              >
                <IconComponent size={14} />
              </div>
              <span className="category-item-name">{cat.name}</span>
              <FaChevronRight size={10} className="category-item-arrow ms-auto" />
            </div>
          );
        })}
      </div>
    </aside>
  );
}
