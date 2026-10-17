import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import HeroSearchBar from './HeroSearchBar.jsx';
import ReferoConstellation from './ReferoConstellation.jsx';
import CategorySidebar from './CategorySidebar.jsx';
import CategoryBannerPreview from './CategoryBannerPreview.jsx';
import { POPULAR_KEYWORDS } from '../../constants.js';
import { mockCategories } from '../../mock/categories.js';

export default function Hero() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(() => mockCategories[0]);
  const timerRef = useRef(null);

  const handleHoverCategory = useCallback((cat) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveCategory(cat);
    }, 50);
  }, []);

  return (
    <section className="hero-section hero-section--refero">
      <div className="container-app position-relative z-2">
        {/* Phần trên: Tiêu đề căn giữa kéo dài & Hero 3D ở góc trên bên phải */}
        <div className="hero-refero-top-area position-relative mb-4">
          {/* Cột phải: Hình minh họa Constellation 3D ở phía trên góc phải */}
          <div className="hero-refero-constellation-corner d-none d-lg-block">
            <ReferoConstellation />
          </div>

          {/* Khung chữ chính: Kéo dài ra & căn giữa */}
          <div className="hero-refero-content text-center mx-auto position-relative z-2">
            {/* Eyebrow tag phong cách Refero Dala */}
            <div className="hero-eyebrow hero-eyebrow--refero d-inline-flex mx-auto mb-3">
              <span className="hero-eyebrow-dot" />
              JOBNEST WORKPLACE INTELLIGENCE
            </div>

            {/* Tiêu đề display hoành tráng nhưng nét thanh nhẹ */}
            <h1 className="hero-title hero-title--refero text-center mb-3">
              Nơi sự nghiệp của bạn <br className="d-none d-md-block" />
              <span className="hero-title-accent">tìm thấy câu trả lời.</span>
            </h1>

            {/* Phụ đề kéo dài thoáng đạt */}
            <p className="hero-desc hero-desc--refero mx-auto mb-0">
              Khám phá hơn 10,000+ cơ hội công nghệ chất lượng cao. Định vị mức lương, đo độ khớp hồ sơ và kết nối trực tiếp với các startup hàng đầu.
            </p>
          </div>
        </div>

        {/* Phần giữa: Thanh tìm kiếm, thanh chạy chữ & từ khóa được kéo dài */}
        <div className="hero-search-extended-wrap mt-4 mx-auto">
          {/* Thanh tìm kiếm phong cách Refero Obsidian */}
          <div className="hero-search-wrap mb-3">
            <HeroSearchBar variant="refero" />
          </div>

          {/* Dải thông điệp chạy chữ ngọn lửa ITviec trên nền tối Refero */}
          <div className="hero-ticker-marquee hero-ticker-marquee--refero mx-auto mb-3">
            <div className="hero-ticker-fire" title="Nóng">
              <FaFire className="text-warning" size={15} />
            </div>
            <div className="hero-ticker-track-wrap">
              <div className="hero-ticker-track">
                <span className="hero-ticker-text hero-ticker-text--refero">
                  JobNest – Không chỉ tìm một công việc, mà tìm thấy nơi bạn thuộc về và phát triển sự nghiệp.
                </span>
                <span className="hero-ticker-text hero-ticker-text--refero" aria-hidden="true">
                  JobNest – Không chỉ tìm một công việc, mà tìm thấy nơi bạn thuộc về và phát triển sự nghiệp.
                </span>
              </div>
            </div>
          </div>

          {/* Dải từ khóa phổ biến */}
          <div className="hero-keywords hero-keywords--refero text-center">
            <span className="hero-keywords__label hero-keywords__label--refero">
              Từ khóa hàng đầu:
            </span>
            <div className="hero-keywords__list d-flex flex-wrap gap-1 justify-content-center">
              {POPULAR_KEYWORDS.slice(0, 8).map((kw) => (
                <button
                  key={kw}
                  type="button"
                  className="chip hero-keyword-chip hero-keyword-chip--refero"
                  onClick={() => navigate(`/jobs/search?keyword=${encodeURIComponent(kw)}`)}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phần dưới: Khối tương tác Danh mục nghề nghiệp */}
        <div className="hero-showcase-grid mt-5">
          {/* Cột trái: Danh mục nghề nghiệp */}
          <div className="hero-showcase-sidebar">
            <CategorySidebar
              activeCategory={activeCategory}
              onHoverCategory={handleHoverCategory}
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
