import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import HeroSearchBar from './HeroSearchBar.jsx';
import CategorySidebar from './CategorySidebar.jsx';
import CategoryBannerPreview from './CategoryBannerPreview.jsx';
import { POPULAR_KEYWORDS } from '../../constants.js';

export default function Hero() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <section className="hero-section">
      <div className="container-app">
        {/* Phần trên: Tiêu đề + Thanh tìm kiếm trung tâm */}
        <div className="hero-header-center mb-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="hero-badge">
              <FaStar className="me-2" color="#FBC725" size={13} />
              Cơ hội nghề nghiệp hàng đầu
            </span>
          </div>

          <h1 className="hero-title mb-2">
            Tìm công việc mơ ước <span className="hero-title--highlight">phù hợp với bạn</span>
          </h1>

          <p className="hero-desc mb-3">
            Hàng nghìn việc làm chất lượng cao từ các công ty công nghệ và tập đoàn uy tín.
          </p>

          <HeroSearchBar />

          {/* Dải từ khóa phổ biến */}
          <div className="hero-keywords mt-3 mb-0">
            <span className="hero-keywords__label">Từ khóa phổ biến:</span>
            <div className="hero-keywords__list">
              {POPULAR_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  className="chip hero-keyword-chip"
                  onClick={() => navigate(`/jobs/search?keyword=${encodeURIComponent(kw)}`)}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phần dưới: Khối tương tác kiểu TopCV (Cột trái: Danh mục - Cột phải: Ảnh xem trước tương ứng) */}
        <div className="hero-showcase-grid mt-4">
          {/* Cột trái: Danh mục nghề nghiệp */}
          <div className="hero-showcase-sidebar">
            <CategorySidebar
              activeCategory={activeCategory}
              onHoverCategory={(cat) => setActiveCategory(cat)}
            />
          </div>

          {/* Cột phải: Banner ảnh tương ứng với ngành đang hover */}
          <div className="hero-showcase-preview">
            <CategoryBannerPreview category={activeCategory} />
          </div>
        </div>
      </div>
    </section>
  );
}
