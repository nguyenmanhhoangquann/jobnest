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
    <section className="top-companies-section py-4">
      <div className="container-app">
        {/* Khung duy nhất bao bọc toàn bộ Thương hiệu lớn tiêu biểu và các công ty */}
        <div className="top-companies-box p-3 p-md-4 p-xl-4">
          {/* Header trong khung: Tiêu đề & Dải tab lọc ngành */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 pb-3 border-bottom">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <span className="badge badge-pro-company">
                  <FaCrown className="me-1" size={11} /> Pro Company
                </span>
                <span className="small text-muted fw-semibold">Đối tác chiến lược hàng đầu</span>
              </div>
              <h2 className="section-title-jobnest mb-1">Thương hiệu lớn tiêu biểu</h2>
              <p className="small text-muted mb-0">
                Hàng trăm tập đoàn và doanh nghiệp hàng đầu đang mở rộng cơ hội tuyển dụng trên JobNest
              </p>
            </div>

            {/* Dải tab lọc ngành nghề kèm nút cuộn */}
            <div className="d-flex align-items-center gap-2">
              <div className="company-tabs-track" ref={scrollRef}>
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
          </div>

          {/* Phần thân: Cột trái (Poster có nút Khám phá ngay trên ảnh) + Cột phải (2 công ty / hàng ngang) */}
          <div className="row g-3 align-items-stretch">
            {/* Cột trái: Tấm poster có sẵn nút Khám phá ngay, click toàn tấm link sang /jobs */}
            <div className="col-12 col-lg-4 col-xl-35">
              <Link
                to="/jobs"
                className="pro-company-poster-link d-block h-100 rounded-4 overflow-hidden position-relative shadow-sm"
                title="2000+ Việc làm phổ thông thu nhập hấp dẫn - Khám phá ngay"
              >
                <img
                  src={posterFeaturedImg}
                  alt="2000+ Việc làm phổ thông thu nhập hấp dẫn - Khám phá ngay"
                  className="pro-company-poster-img w-100 h-100"
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
