import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaRobot,
  FaCheckCircle,
  FaUsers,
  FaBriefcase,
  FaChartLine,
  FaShieldAlt,
  FaBolt,
  FaHeart,
  FaBookOpen,
  FaBuilding,
  FaExternalLinkAlt,
  FaSearch,
  FaNetworkWired,
  FaCheck,
  FaMagic,
} from 'react-icons/fa';
import '../styles/about.css';

export default function About() {
  const numbers = [
    { label: 'Việc làm mở tuyển', value: '90.000+', desc: 'Cập nhật trực tiếp từ doanh nghiệp đối tác hàng ngày' },
    { label: 'Doanh nghiệp kết nối', value: '150.000+', desc: 'Từ startup công nghệ tới các tập đoàn đa quốc gia' },
    { label: 'Ứng viên đăng ký', value: '2.5M+', desc: 'Lao động tri thức trẻ và chuyên gia trên toàn quốc' },
    { label: 'Tỷ lệ phản hồi hồ sơ', value: '98.5%', desc: 'Rút ngắn quy trình kết nối phỏng vấn xuống dưới 48 giờ' },
  ];

  const creditValues = [
    {
      code: 'C',
      name: 'Collaboration',
      vn: 'Hợp tác cùng thắng',
      desc: 'Chúng tôi xây dựng cầu nối công bằng, nơi ứng viên tìm thấy bệ phóng và doanh nghiệp tìm thấy người đồng hành cùng phát triển bền vững.',
    },
    {
      code: 'R',
      name: 'Results',
      vn: 'Định hướng kết quả',
      desc: 'Đo lường thành công bằng số lượng kết nối thực chất và sự thăng tiến nghề nghiệp bền vững của người lao động.',
    },
    {
      code: 'E',
      name: 'Efficiency',
      vn: 'Tối ưu hiệu suất',
      desc: 'Ứng dụng AI thông minh tự động hóa soạn thảo JD và chấm điểm CV, cắt giảm thời gian chờ đợi từ hàng tuần xuống hàng giây.',
    },
    {
      code: 'D',
      name: 'Diversity',
      vn: 'Đa dạng & Hòa nhập',
      desc: 'Cơ hội nghề nghiệp rộng mở cho tất cả mọi người. Loại bỏ hoàn toàn định kiến ngoại hình, giới tính hay tuổi tác.',
    },
    {
      code: 'I',
      name: 'Iteration',
      vn: 'Cải tiến liên tục',
      desc: 'Lắng nghe phản hồi từ cộng đồng người dùng để liên tục phát hành và hoàn thiện tính năng mới mỗi tuần.',
    },
    {
      code: 'T',
      name: 'Transparency',
      vn: 'Minh bạch tối đa',
      desc: 'Công khai dải lương thị trường, bảo mật tuyệt đối dữ liệu người dùng và kiên quyết bài trừ các tin tuyển dụng lừa đảo nộp cọc.',
    },
  ];

  const timeline = [
    {
      year: '2024',
      title: 'Khởi đầu với bản commit đầu tiên',
      desc: 'Dự án JobNest được khởi xướng với mục tiêu tạo nên một không gian tìm việc làm sạch, minh bạch và tôn trọng ứng viên.',
    },
    {
      year: '2025',
      title: 'Tích hợp Trí tuệ Nhân tạo thế hệ mới',
      desc: 'Tiên phong ứng dụng mô hình AI thông minh vào tuyển dụng: tự động gợi ý mô tả việc làm (JD) và phân tích tương thích CV theo thời gian thực.',
    },
    {
      year: '2026',
      title: 'Hệ sinh thái điều phối nghề nghiệp toàn quốc',
      desc: 'Đạt mốc 150.000 doanh nghiệp đối tác, phục vụ hàng triệu lượt tìm kiếm mỗi tháng và mở rộng phân hệ quản trị tuyển dụng toàn diện.',
    },
  ];

  const resourceCards = [
    {
      title: 'Cẩm nang nghề nghiệp & Blog',
      desc: 'Tổng hợp phân tích xu hướng thị trường, kỹ năng phỏng vấn và lộ trình phát triển ngành CNTT, Kinh doanh, Tài chính.',
      link: '/blog',
      actionText: 'Khám phá bài viết',
      icon: <FaBookOpen className="text-warning" size={20} />,
    },
    {
      title: 'Báo cáo lương thị trường 2026',
      desc: 'Khảo sát số liệu mức thu nhập Gross/Net thực tế theo vị trí, kinh nghiệm và vùng địa lý để bạn tự tin thương lượng.',
      link: '/salary-report',
      actionText: 'Xem báo cáo lương',
      icon: <FaChartLine className="text-primary" size={20} />,
    },
    {
      title: 'Dành cho Nhà tuyển dụng',
      desc: 'Đăng tin tuyển dụng nhanh, tiếp cận nguồn ứng viên chất lượng và ứng dụng AI lọc hồ sơ thông minh.',
      link: '/register?role=EMPLOYER',
      actionText: 'Tạo tài khoản NTD',
      icon: <FaBuilding className="text-success" size={20} />,
    },
  ];

  const partners = [
    { name: 'Tập đoàn FPT', logo: '/images/companies/fpt.svg' },
    { name: 'Viettel Telecom', logo: '/images/companies/viettel.svg' },
    { name: 'Ngân hàng MB', logo: '/images/companies/mb-bank.png' },
    { name: 'Vinamilk', logo: '/images/companies/vinamilk.svg' },
    { name: 'MISA SaaS', logo: '/images/companies/misa.svg' },
    { name: 'Ngân hàng VIB', logo: '/images/companies/vib.png' },
  ];

  return (
    <div className="about-page-container">
      {/* Background Ambient Glows */}
      <div className="about-ambient-glow" />
      <div className="about-ambient-glow-2" />

      {/* 1. HERO SECTION (GITLAB COMPANY ARCHITECTURE) */}
      <section className="position-relative border-bottom" style={{ paddingTop: '80px', paddingBottom: '88px', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="eyebrow-pill mb-3.5">
                <FaBolt size={11} className="text-warning" /> About JobNest • The Career Platform
              </div>
              <h1 className="fw-bold tracking-tight mb-3.5" style={{ fontSize: '44px', lineHeight: '1.18', letterSpacing: '-0.025em' }}>
                Hậu trường nền tảng điều phối nhân tài & việc làm thông minh
              </h1>
              <p className="lead text-secondary mb-4" style={{ fontSize: '18px', lineHeight: '1.65', maxWidth: '640px' }}>
                Chúng tôi là đội ngũ đứng sau <strong>JobNest</strong> — nền tảng nơi ứng viên và nhà tuyển dụng kết nối, kiến tạo giá trị và thúc đẩy sự nghiệp mơ ước với sự trợ lực của trí tuệ nhân tạo.
              </p>

              <div className="d-flex flex-wrap gap-3 align-items-center">
                <Link to="/jobs" className="btn-nested-pill btn-nested-pill--dark">
                  <span>Khám phá việc làm</span>
                  <span className="btn-nested-pill__icon">
                    <FaArrowRight size={12} />
                  </span>
                </Link>

                <Link to="/support" className="btn-nested-pill btn-nested-pill--warning">
                  <span>Trò chuyện cùng AI</span>
                  <span className="btn-nested-pill__icon">
                    <FaRobot size={13} />
                  </span>
                </Link>
              </div>

              {/* Live telemetry row */}
              <div className="d-flex align-items-center gap-3 mt-4 pt-3 border-top border-light-subtle">
                <span className="d-inline-flex align-items-center gap-2 small text-secondary fw-medium" style={{ fontSize: '13px' }}>
                  <span className="pulse-indicator" /> Hệ thống vận hành ổn định
                </span>
                <span className="text-muted small">•</span>
                <span className="small text-secondary" style={{ fontSize: '13px' }}>99.98% phản hồi chính xác</span>
              </div>
            </div>

            {/* Right: Architectural Visual Artifact (Double-Bezel Box) */}
            <div className="col-lg-5">
              <div className="double-bezel-shell">
                <div className="double-bezel-core p-4">
                  {/* Top bar with logo and status */}
                  <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                    <img
                      src="/images/jobnest-logo.png"
                      alt="JobNest"
                      style={{ height: '36px', objectFit: 'contain' }}
                    />
                    <span className="badge bg-warning text-dark px-2.5 py-1 fw-bold" style={{ fontSize: '11px' }}>
                      All-in-One Engine
                    </span>
                  </div>

                  {/* Flow Diagram / Architecture Mock */}
                  <div className="d-flex flex-column gap-2.5 mb-4">
                    <div className="hero-node-badge hero-node-badge--active d-flex justify-content-between align-items-center">
                      <span className="d-flex align-items-center gap-2">
                        <FaRobot size={14} className="text-warning-emphasis" /> AI CV Evaluation Engine
                      </span>
                      <span className="small fw-bold text-success">Active</span>
                    </div>

                    <div className="hero-node-badge d-flex justify-content-between align-items-center">
                      <span className="d-flex align-items-center gap-2">
                        <FaBriefcase size={13} className="text-secondary" /> Intelligent Job Matcher
                      </span>
                      <span className="small text-muted">90K+ Jobs</span>
                    </div>

                    <div className="hero-node-badge d-flex justify-content-between align-items-center">
                      <span className="d-flex align-items-center gap-2">
                        <FaShieldAlt size={13} className="text-secondary" /> Zero-Fee Scam Protection
                      </span>
                      <span className="small text-success">Verified</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-3 bg-light border">
                    <div className="d-flex align-items-center gap-2 text-dark small fw-bold mb-1">
                      <FaCheckCircle className="text-success" size={13} /> Khẩu hiệu hành động
                    </div>
                    <div className="small text-secondary" style={{ fontStyle: 'italic', fontSize: '13px' }}>
                      "Your Career. Your Future. Your Way." — Trao quyền tối đa cho người lao động làm chủ sự nghiệp của chính mình.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO (ĐỊNH VỊ) */}
      <section className="py-5 border-bottom bg-white position-relative" style={{ zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="eyebrow-pill mb-2">Sứ mệnh nền tảng</span>
              <h2 className="fw-bold mt-2 mb-3" style={{ fontSize: '34px', lineHeight: '1.25', letterSpacing: '-0.02em' }}>
                Kiến tạo chuẩn mực mới cho kết nối tuyển dụng
              </h2>
            </div>
            <div className="col-lg-7">
              <p className="text-secondary mb-3" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                Khởi đầu từ năm 2024 như một dự án công nghệ nhằm xóa bỏ sự bất đối xứng thông tin và nạn tin tuyển dụng ảo trên thị trường, <strong>JobNest</strong> ngày nay đã phát triển thành nền tảng điều phối tuyển dụng thông minh được hàng triệu ứng viên và hàng trăm nghìn doanh nghiệp lựa chọn.
              </p>
              <p className="text-secondary mb-0" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                Từ việc tối ưu CV chuẩn ATS, phân tích độ phù hợp bằng AI cho đến hỗ trợ doanh nghiệp đăng bài và quản lý hồ sơ chỉ trong tích tắc — chúng tôi tin tưởng sâu sắc vào tính minh bạch, tốc độ cải tiến liên tục và việc đặt con người làm trung tâm của mọi đổi mới.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BY THE NUMBERS (ASYMMETRIC BENTO GRID) */}
      <section className="py-5 border-bottom" style={{ backgroundColor: '#FAFAFB', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="eyebrow-pill mb-2">Thước đo tăng trưởng</span>
              <h2 className="fw-bold mt-1 mb-0" style={{ fontSize: '30px', letterSpacing: '-0.02em' }}>
                JobNest theo những con số
              </h2>
            </div>
            <span className="small text-muted fw-semibold">Dữ liệu thực tế thời gian thực</span>
          </div>

          <div className="row g-3">
            {numbers.map((item, idx) => (
              <div key={idx} className="col-6 col-lg-3">
                <div className="double-bezel-shell h-100">
                  <div className="double-bezel-core p-3.5">
                    <div className="small fw-bold text-muted mb-1 text-uppercase" style={{ fontSize: '11.5px', letterSpacing: '0.05em' }}>
                      {item.label}
                    </div>
                    <div className="display-6 fw-bold text-dark mb-1" style={{ letterSpacing: '-0.03em' }}>
                      {item.value}
                    </div>
                    <div className="text-secondary small mt-auto" style={{ fontSize: '12.5px', lineHeight: '1.5' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MISSION STATEMENT (DARK DOUBLE-BEZEL STATEMENT) */}
      <section className="py-5 border-bottom bg-dark">
        <div className="container" style={{ maxWidth: '980px' }}>
          <div className="double-bezel-shell-dark">
            <div className="double-bezel-core-dark text-center py-5 px-4">
              <span className="badge bg-warning text-dark px-3 py-1.5 fw-bold text-uppercase mb-3" style={{ fontSize: '11px', letterSpacing: '0.06em' }}>
                Tuyên ngôn sứ mệnh
              </span>
              <h2 className="display-6 fw-bold mb-3.5 text-white" style={{ lineHeight: '1.35', letterSpacing: '-0.02em' }}>
                "Giải phóng tiềm năng của mỗi cá nhân và trao quyền để mọi người chạm tới công việc mơ ước với tốc độ của khát vọng."
              </h2>
              <p className="text-white-50 lead mb-0" style={{ fontSize: '16px', maxWidth: '680px', margin: '0 auto', lineHeight: '1.7' }}>
                Bằng việc kết hợp dữ liệu tuyển dụng chuẩn xác cùng trí tuệ nhân tạo, JobNest kiến tạo một thị trường lao động minh bạch, công bằng và hiệu quả vượt bậc cho cộng đồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CREDIT VALUES (GITLAB ARCHITECTURE WITH MONOGRAMS) */}
      <section className="py-5 border-bottom bg-white position-relative" style={{ zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div className="text-center mb-5">
            <span className="eyebrow-pill mb-2">Hệ giá trị cốt lõi</span>
            <h2 className="fw-bold mt-1 mb-2" style={{ fontSize: '34px', letterSpacing: '-0.02em' }}>Bộ giá trị C-R-E-D-I-T</h2>
            <p className="text-muted small" style={{ maxWidth: '580px', margin: '0 auto' }}>
              Những nguyên tắc định hình cách chúng tôi kiến tạo sản phẩm và phục vụ cộng đồng lao động số Việt Nam
            </p>
          </div>

          <div className="row g-4">
            {creditValues.map((v, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                <div className="double-bezel-shell h-100">
                  <div className="double-bezel-core p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="credit-monogram flex-shrink-0">
                        {v.code}
                      </div>
                      <div>
                        <h5 className="fw-bold text-dark mb-0.5" style={{ fontSize: '17px' }}>{v.name}</h5>
                        <small className="text-warning-emphasis fw-bold">{v.vn}</small>
                      </div>
                    </div>
                    <p className="text-secondary small mb-0" style={{ lineHeight: '1.65', fontSize: '13.5px' }}>
                      {v.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TIMELINE / OVER THE YEARS */}
      <section className="py-5 border-bottom" style={{ backgroundColor: '#FAFAFB', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div className="text-center mb-5">
            <span className="eyebrow-pill mb-2">Dấu mốc phát triển</span>
            <h2 className="fw-bold mt-1" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>JobNest qua các năm</h2>
          </div>

          <div className="timeline-stem">
            {timeline.map((item, idx) => (
              <div key={idx} className="timeline-stem-item">
                <div className="timeline-stem-marker" />
                <span className="badge bg-dark text-white fw-bold mb-2 px-2.5 py-1" style={{ fontSize: '12px' }}>
                  {item.year}
                </span>
                <h4 className="fw-bold text-dark mb-1.5" style={{ fontSize: '19px' }}>{item.title}</h4>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.7', fontSize: '14px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. STRATEGIC PARTNERS (CLEAN MODERN TILES) */}
      <section className="py-5 border-bottom bg-white" style={{ zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div className="text-center mb-4">
            <span className="eyebrow-pill mb-2">Mạng lưới tin cậy</span>
            <h3 className="fw-bold mt-1 mb-1" style={{ fontSize: '26px' }}>Đồng hành cùng các thương hiệu hàng đầu</h3>
            <p className="text-muted small">Hơn 150.000 doanh nghiệp lựa chọn JobNest làm đối tác thu hút nhân tài</p>
          </div>

          <div className="row g-3 justify-content-center">
            {partners.map((p, idx) => (
              <div key={idx} className="col-6 col-sm-4 col-md-2">
                <div className="partner-tile" title={p.name}>
                  <img
                    src={p.logo}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. RESOURCES / WORKING AT JOBNEST */}
      <section className="py-5 border-bottom" style={{ backgroundColor: '#FAFAFB', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div className="text-center mb-4">
            <span className="eyebrow-pill mb-2">Hệ sinh thái mở</span>
            <h3 className="fw-bold mt-1" style={{ fontSize: '28px' }}>Khám phá thêm về JobNest</h3>
          </div>

          <div className="row g-4">
            {resourceCards.map((c, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="double-bezel-shell h-100">
                  <div className="double-bezel-core p-4 justify-content-between">
                    <div>
                      <div className="mb-3">{c.icon}</div>
                      <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>{c.title}</h5>
                      <p className="text-secondary small mb-4" style={{ lineHeight: '1.65', fontSize: '13.5px' }}>{c.desc}</p>
                    </div>
                    <Link to={c.link} className="fw-bold text-dark text-decoration-none small d-inline-flex align-items-center gap-1.5 mt-auto">
                      <span>{c.actionText}</span>
                      <FaArrowRight size={11} className="text-warning" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION (BUTTON-IN-BUTTON) */}
      <section className="py-5 text-center bg-white" style={{ zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '34px', letterSpacing: '-0.025em' }}>
            Bắt đầu bứt phá sự nghiệp ngay hôm nay
          </h2>
          <p className="text-secondary mb-4" style={{ fontSize: '16px', lineHeight: '1.6' }}>
            Trải nghiệm nền tảng tìm việc làm thông minh với công nghệ AI hỗ trợ chuẩn bị CV và kết nối với những nhà tuyển dụng hàng đầu.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/jobs" className="btn-nested-pill btn-nested-pill--dark">
              <span>Tìm việc ngay</span>
              <span className="btn-nested-pill__icon">
                <FaArrowRight size={12} />
              </span>
            </Link>

            <Link to="/register?role=EMPLOYER" className="btn-nested-pill btn-nested-pill--warning">
              <span>Đăng tin tuyển dụng</span>
              <span className="btn-nested-pill__icon">
                <FaBuilding size={13} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
