import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import categoryApi from '../../api/categoryApi.js';

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
              <span className="category-item-name">{cat.name}</span>
              <FaChevronRight size={10} className="category-item-arrow ms-auto" />
            </div>
          );
        })}
      </div>
    </aside>
  );
}
