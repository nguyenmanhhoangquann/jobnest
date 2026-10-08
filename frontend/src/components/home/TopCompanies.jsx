import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaBriefcase,
  FaCheckCircle,
} from 'react-icons/fa';
import posterFeaturedImg from '../../assets/poster-featured.jpg';
import proCompanyBannerImg from '../../assets/pro-company-banner.jpg';

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
  {
    id: 7,
    name: 'TẬP ĐOÀN VINGROUP - VINHOMES',
    industry: 'Bất động sản',
    logo: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=120&q=80',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    openJobs: 36,
    verified: true,
  },
  {
    id: 8,
    name: 'TẬP ĐOÀN HÒA PHÁT',
    industry: 'Xây dựng, Sản xuất',
    logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=120&q=80',
    cover: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80',
    openJobs: 28,
    verified: true,
  },
  {
    id: 9,
    name: 'CÔNG TY CHỨNG KHOÁN SSI',
    industry: 'Tài chính',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80',
    cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    openJobs: 17,
    verified: true,
  },
];

export default function TopCompanies() {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const scrollRef = useRef(null);

  const filtered = MOCK_PRO_COMPANIES.filter((c) => {
    if (activeTab === 'Tất cả') return true;
    return c.industry.includes(activeTab) || activeTab.includes(c.industry);
  }).slice(0, 6);

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
          {/* 1. Banner có ảnh JobNest làm nền nhìn rõ, không có chữ Pro Company, bỏ Pro ở sau JobNest */}
          <div className="brand-header-banner p-4 rounded-4 mb-3 position-relative overflow-hidden">
            {/* Ảnh banner nền JobNest nhìn rõ ràng */}
            <img
              src={proCompanyBannerImg}
              alt="Thương hiệu lớn tiêu biểu"
              className="brand-header-banner__bg"
              loading="lazy"
            />
            <div className="brand-header-banner__overlay" />

            <div className="position-relative z-2">
              <h2 className="brand-header-title mb-2">Thương hiệu lớn tiêu biểu</h2>
              <p className="brand-header-desc mb-0">
                Hàng trăm thương hiệu lớn tiêu biểu đang tuyển dụng trên JobNest
              </p>
            </div>
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

          {/* 3. Phần thân: Cột trái (Tấm poster nguyên bản không nằm trong ô nào, click sang /jobs) + Cột phải (2 công ty / hàng ngang) */}
          <div className="row g-4 align-items-start">
            {/* Cột trái: Poster độc lập, không bị co giật/lệch khi đổi tab */}
            <div className="col-12 col-lg-4">
              <Link
                to="/jobs"
                className="featured-poster-link d-block"
                title="Khám phá ngay 2000+ việc làm hấp dẫn"
              >
                <img
                  src={posterFeaturedImg}
                  alt="2000+ Việc làm phổ thông thu nhập hấp dẫn - Khám phá ngay"
                  className="featured-poster-img shadow-sm"
                  loading="lazy"
                />
              </Link>
            </div>

            {/* Cột phải: Đúng 6 công ty (3 hàng x 2 cột), độ rộng căn vừa vặn với poster */}
            <div className="col-12 col-lg-8">
              <div className="row g-3 row-cols-1 row-cols-md-2">
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
