import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCrown,
  FaChevronLeft,
  FaChevronRight,
  FaBriefcase,
  FaCheckCircle,
} from 'react-icons/fa';

const COMPANY_TABS = [
  'Tất cả',
  'Ngân hàng',
  'IT - Phần mềm',
  'Tài chính',
  'Bất động sản',
  'Bán lẻ - Hàng tiêu dùng',
  'Sản xuất',
  'Marketing - Truyền thông',
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
    industry: 'Bán lẻ - Hàng tiêu dùng',
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
    <section className="top-companies-section py-5">
      <div className="container-app">
        {/* Banner tiêu đề kiểu TopCV Pro Company */}
        <div className="pro-company-banner p-4 p-md-5 rounded-4 mb-4 text-white position-relative overflow-hidden">
          <div className="position-relative z-2">
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span className="badge badge-pro-company">
                <FaCrown className="me-1" size={11} /> Pro Company
              </span>
              <span className="small text-white-50">Đối tác chiến lược hàng đầu</span>
            </div>
            <h2 className="pro-company-title mb-2">Thương hiệu lớn tiêu biểu</h2>
            <p className="pro-company-desc mb-0">
              Hàng trăm tập đoàn và thương hiệu lớn tiêu biểu đang tuyển dụng nhân tài trên JobNest Pro
            </p>
          </div>
          <div className="pro-banner-glow" />
        </div>

        {/* Dải tab lọc ngành nghề dạng viên thuốc */}
        <div className="d-flex align-items-center gap-2 mb-4">
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

        {/* Lưới các thẻ thương hiệu tiêu biểu */}
        <div className="row g-4">
          {filtered.map((company) => (
            <div key={company.id} className="col-12 col-md-6 col-lg-4">
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
    </section>
  );
}
