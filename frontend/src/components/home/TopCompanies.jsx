import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCrown,
  FaChevronLeft,
  FaChevronRight,
  FaBriefcase,
  FaCheckCircle,
} from 'react-icons/fa';
import posterFeaturedImg from '../../assets/poster-featured.jpg';

const COMPANY_TABS = [
  'Tất cả',
  'Ngân hàng',
  'Bất động sản',
  'Xây dựng',
  'IT - Phần mềm',
  'Tài chính',
  'Bán lẻ - Hàng tiêu dùng - FMCG',
  'Sản xuất',
];

const BANNER_BRAND_LOGOS = [
  { name: 'FPT', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80' },
  { name: 'Viettel', logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=120&q=80' },
  { name: 'MB Bank', logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=120&q=80' },
  { name: 'Techcombank', logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80' },
  { name: 'Vinamilk', logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&q=80' },
  { name: 'MISA', logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80' },
];

const MOCK_PRO_COMPANIES = [
  {
    id: 1,
    name: 'TẬP ĐOÀN CÔNG NGHỆ FPT',
    industry: 'IT - Phần mềm',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    openJobs: 48,
    verified: true,
  },
  {
    id: 2,
    name: 'NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN QUÂN ĐỘI (MB)',
    industry: 'Ngân hàng',
    logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=120&q=80',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    openJobs: 32,
    verified: true,
  },
  {
    id: 3,
    name: 'CÔNG TY CỔ PHẦN MISA',
    industry: 'IT - Phần mềm',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80',
    cover: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
    openJobs: 25,
    verified: true,
  },
  {
    id: 4,
    name: 'TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI (VIETTEL)',
    industry: 'IT - Phần mềm',
    logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=120&q=80',
    cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    openJobs: 64,
    verified: true,
  },
  {
    id: 5,
    name: 'NGÂN HÀNG QUỐC TẾ VIB',
    industry: 'Ngân hàng',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80',
    cover: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    openJobs: 19,
    verified: true,
  },
  {
    id: 6,
    name: 'CÔNG TY CỔ PHẦN VINAMILK',
    industry: 'Bán lẻ - Hàng tiêu dùng - FMCG',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&q=80',
    cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    openJobs: 21,
    verified: true,
  },
];

export default function TopCompanies() {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const scrollRef = useRef(null);

  const filtered = MOCK_PRO_COMPANIES.filter((c) => {
    if (activeTab === 'Tất cả') return true;
    return c.industry.includes(activeTab) || activeTab.includes(c.industry);
  });

  const scrollTabs = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="top-companies-section py-4">
      <div className="container-app">
        {/* Khung duy nhất bao bọc toàn bộ Thương hiệu lớn tiêu biểu và các công ty */}
        <div className="top-companies-box p-3 p-md-4">
          {/* 1. Banner phong cách chuẩn TopCV Pro Company */}
          <div className="topcv-pro-banner p-4 p-lg-4 rounded-4 mb-3 position-relative overflow-hidden">
            <div className="row align-items-center position-relative z-2">
              {/* Bên trái: Tiêu đề + Phụ đề + Badge Pro Company */}
              <div className="col-12 col-md-7 col-lg-7">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <h2 className="topcv-pro-title mb-0">Thương hiệu lớn tiêu biểu</h2>
                  <span className="badge badge-topcv-pro">
                    <FaCrown className="me-1" size={10} /> Pro Company
                  </span>
                </div>
                <p className="topcv-pro-desc mb-0">
                  Hàng trăm thương hiệu lớn tiêu biểu đang tuyển dụng trên JobNest Pro
                </p>
              </div>

              {/* Bên phải: Lưới logo các thương hiệu hàng đầu dạng ô vuông trắng bo góc */}
              <div className="col-12 col-md-5 col-lg-5 d-none d-md-block">
                <div className="topcv-brand-tiles d-flex flex-wrap justify-content-end align-items-center gap-2">
                  {BANNER_BRAND_LOGOS.map((brand, idx) => (
                    <div key={idx} className="topcv-brand-tile" title={brand.name}>
                      <img src={brand.logo} alt={brand.name} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Background kim loại vàng đồng và vệt sáng */}
            <div className="topcv-pro-banner__bg" />
            <div className="topcv-pro-banner__glow" />
          </div>

          {/* 2. Dải button tab lọc ngành nghề nằm bên dưới banner trên nền trắng chuẩn TopCV */}
          <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
            <div className="company-tabs-track flex-grow-1" ref={scrollRef}>
              {COMPANY_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`company-tab-pill ${activeTab === tab ? 'company-tab-pill--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Nút mũi tên điều hướng tròn nhỏ bên phải */}
            <div className="d-flex gap-1 flex-shrink-0">
              <button
                type="button"
                className="circle-nav-btn circle-nav-btn--sm"
                onClick={() => scrollTabs('left')}
                aria-label="Cuộn tab sang trái"
              >
                <FaChevronLeft size={11} />
              </button>
              <button
                type="button"
                className="circle-nav-btn circle-nav-btn--sm"
                onClick={() => scrollTabs('right')}
                aria-label="Cuộn tab sang phải"
              >
                <FaChevronRight size={11} />
              </button>
            </div>
          </div>

          {/* 3. Phần thân: Cột trái (Poster hiển thị 100% trọn vẹn) + Cột phải (2 công ty / hàng ngang) */}
          <div className="row g-3 align-items-stretch">
            {/* Cột trái: Tấm poster hiển thị toàn bộ ảnh và text, click toàn tấm link sang /jobs */}
            <div className="col-12 col-lg-4 col-xl-35">
              <Link
                to="/jobs"
                className="pro-company-poster-link d-flex align-items-center justify-content-center h-100 rounded-4 overflow-hidden position-relative shadow-sm"
                title="2000+ Việc làm phổ thông thu nhập hấp dẫn - Khám phá ngay"
              >
                <img
                  src={posterFeaturedImg}
                  alt="2000+ Việc làm phổ thông thu nhập hấp dẫn - Khám phá ngay"
                  className="pro-company-poster-img"
                  loading="lazy"
                />
              </Link>
            </div>

            {/* Cột phải: Danh sách các công ty sắp xếp 2 công ty hàng ngang */}
            <div className="col-12 col-lg-8 col-xl-85">
              <div className="row g-3 row-cols-1 row-cols-md-2 h-100">
                {filtered.map((company) => (
                  <div key={company.id} className="col">
                    <div className="company-card h-100 d-flex flex-column">
                      {/* Ảnh bìa */}
                      <div className="company-card__cover">
                        <img src={company.cover} alt="" loading="lazy" />
                        <div className="company-card__cover-overlay" />
                      </div>

                      {/* Logo & Thông tin */}
                      <div className="company-card__body p-3 pt-0 flex-grow-1 d-flex flex-column">
                        <div className="company-card__logo-wrap">
                          <img src={company.logo} alt={company.name} className="company-card__logo" />
                        </div>

                        <h3 className="company-card__name mt-2 mb-1" title={company.name}>
                          {company.name}
                        </h3>

                        <div className="small text-muted mb-3 d-flex align-items-center gap-1">
                          <FaCheckCircle className="text-primary" size={12} />
                          <span>{company.industry}</span>
                        </div>

                        <div className="mt-auto pt-2 border-top d-flex align-items-center justify-content-between">
                          <span className="badge bg-warning-subtle text-warning-emphasis font-monospace fw-semibold">
                            <FaBriefcase className="me-1" size={10} />
                            {company.openJobs} việc làm đang tuyển
                          </span>

                          <Link to="/jobs" className="btn btn-sm btn-outline-secondary">
                            Xem ngay →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
