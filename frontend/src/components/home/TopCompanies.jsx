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
    size: '10,000+ nhân sự',
    tagline: 'Tiên phong chuyển đổi số và phát triển giải pháp trí tuệ nhân tạo (AI)',
    statusTag: 'Tăng trưởng nhanh',
    logo: '/images/companies/fpt.svg',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    openJobs: 48,
    verified: true,
  },
  {
    id: 2,
    name: 'NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN QUÂN ĐỘI (MB)',
    industry: 'Ngân hàng',
    size: '5,000+ nhân sự',
    tagline: 'Ngân hàng số thông minh với hệ sinh thái tài chính toàn diện',
    statusTag: 'Top tuyển dụng',
    logo: '/images/companies/mb-bank.png',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    openJobs: 32,
    verified: true,
  },
  {
    id: 3,
    name: 'CÔNG TY CỔ PHẦN MISA',
    industry: 'IT - Phần mềm',
    size: '3,000+ nhân sự',
    tagline: 'Giải pháp phần mềm kế toán và nền tảng quản trị SaaS cho doanh nghiệp',
    statusTag: 'Tăng trưởng nhanh',
    logo: '/images/companies/misa.svg',
    cover: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
    openJobs: 25,
    verified: true,
  },
  {
    id: 4,
    name: 'TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI (VIETTEL)',
    industry: 'IT - Phần mềm',
    size: '20,000+ nhân sự',
    tagline: 'Hạ tầng viễn thông số 5G và hệ sinh thái giải pháp số quốc tế',
    statusTag: 'Tập đoàn hàng đầu',
    logo: '/images/companies/viettel.svg',
    cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    openJobs: 64,
    verified: true,
  },
  {
    id: 5,
    name: 'NGÂN HÀNG QUỐC TẾ VIB',
    industry: 'Ngân hàng',
    size: '5,000+ nhân sự',
    tagline: 'Dẫn đầu xu hướng công nghệ số hóa và thẻ tín dụng phong cách sống',
    statusTag: 'Tuyển dụng sôi nổi',
    logo: '/images/companies/vib.png',
    cover: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    openJobs: 19,
    verified: true,
  },
  {
    id: 6,
    name: 'CÔNG TY CỔ PHẦN VINAMILK',
    industry: 'Bán lẻ - Hàng tiêu dùng - FMCG',
    size: '10,000+ nhân sự',
    tagline: 'Thương hiệu sữa quốc gia với chuỗi cung ứng bền vững chuẩn Net Zero',
    statusTag: 'Thương hiệu quốc gia',
    logo: '/images/companies/vinamilk.svg',
    cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    openJobs: 21,
    verified: true,
  },
  {
    id: 7,
    name: 'TẬP ĐOÀN VINGROUP - VINHOMES',
    industry: 'Bất động sản',
    size: '15,000+ nhân sự',
    tagline: 'Nhà phát triển đại đô thị thông minh và hạ tầng dịch vụ tiêu chuẩn quốc tế',
    statusTag: 'Quy mô hàng đầu',
    logo: '/images/companies/vinhomes.svg',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    openJobs: 36,
    verified: true,
  },
  {
    id: 8,
    name: 'TẬP ĐOÀN HÒA PHÁT',
    industry: 'Xây dựng, Sản xuất',
    size: '25,000+ nhân sự',
    tagline: 'Tập đoàn sản xuất công nghiệp và chế tạo thép hàng đầu khu vực',
    statusTag: 'Top ngành sản xuất',
    logo: '/images/companies/hoa-phat.svg',
    cover: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    openJobs: 28,
    verified: true,
  },
  {
    id: 9,
    name: 'CÔNG TY CHỨNG KHOÁN SSI',
    industry: 'Tài chính',
    size: '1,500+ nhân sự',
    tagline: 'Định chế tài chính và dịch vụ đầu tư chứng khoán uy tín hàng đầu',
    statusTag: 'Uy tín hàng đầu',
    logo: '/images/companies/ssi.svg',
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

          {/* 2. Dải button tab lọc ngành nghề nằm bên dưới banner trên nền trắng */}
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
                          <Link to={`/companies?id=${company.id}`} className="text-dark text-decoration-none">
                            {company.name}
                          </Link>
                        </h3>

                        {/* Wellfound style tags: size & status */}
                        <div className="d-flex flex-wrap align-items-center gap-1 mb-2">
                          {company.size && (
                            <span className="badge-company-tag badge-company-tag--size">
                              {company.size}
                            </span>
                          )}
                          {company.statusTag && (
                            <span className="badge-company-tag badge-company-tag--status">
                              {company.statusTag}
                            </span>
                          )}
                        </div>

                        {/* 1-line mission / tagline */}
                        {company.tagline && (
                          <p className="company-card__tagline text-muted small mb-3">
                            {company.tagline}
                          </p>
                        )}

                        <div className="mt-auto pt-2 border-top d-flex align-items-center justify-content-between">
                          <span
                            className="badge font-monospace fw-semibold"
                            style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                          >
                            <FaBriefcase className="me-1" size={10} />
                            {company.openJobs} việc làm đang tuyển
                          </span>

                          <Link
                            to={`/companies?id=${company.id}`}
                            className="btn btn-sm btn-outline-dark fw-semibold"
                          >
                            Xem việc làm →
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
