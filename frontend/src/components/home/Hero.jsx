import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import HeroSearchBar from './HeroSearchBar.jsx';
import CategorySidebar from './CategorySidebar.jsx';
import { POPULAR_KEYWORDS } from '../../constants.js';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="container-app">
        <div className="hero-layout">
          {/* Cột trái & giữa: Nội dung Banner chính */}
          <div className="hero-content">
            {/* Badge nhỏ */}
            <div className="hero-badge">
              <FaStar className="me-2" color="#FBC725" size={13} />
              Cơ hội nghề nghiệp đang chờ bạn
            </div>

            {/* Tiêu đề H1 2 dòng */}
            <h1 className="hero-title">
              Tìm công việc mơ ước <br />
              <span className="hero-title--highlight">phù hợp với bạn</span>
            </h1>

            {/* Mô tả ngắn */}
            <p className="hero-desc">
              Hàng nghìn cơ hội việc làm từ các công ty uy tín đang chờ bạn. Bắt đầu hành trình sự nghiệp ngay hôm nay!
            </p>

            {/* Thanh tìm kiếm */}
            <HeroSearchBar />

            {/* Từ khóa phổ biến */}
            <div className="hero-keywords">
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

            {/* Khối minh họa và chữ viết tay slogan */}
            <div className="hero-illustration-box d-none d-md-flex">
              {/* Vệt tròn trang trí nền */}
              <div className="hero-blob" />

              {/* Khẩu hiệu viết tay font Caveat (Mục 7.3) */}
              <div className="hero__slogan">
                <span>Your Career.</span>
                <span>Your Future.</span>
                <span>Your Way.</span>
              </div>

              {/* Minh họa người làm việc */}
              <div className="hero-illustration-placeholder">
                <div className="desk-scene">
                  <div className="laptop-graphic">
                    <div className="laptop-screen" />
                    <div className="laptop-base" />
                  </div>
                  <div className="coffee-cup" />
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Danh mục việc làm nhanh (Mục 7.6) */}
          <div className="hero-sidebar-wrap d-none d-lg-block">
            <CategorySidebar />
          </div>
        </div>
      </div>
    </section>
  );
}
