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
  FaFileAlt,
  FaBuilding,
  FaExternalLinkAlt,
} from 'react-icons/fa';

export default function About() {
  const numbers = [
    { label: 'Việc làm mở tuyển', value: '90.000+', desc: 'Cập nhật trực tiếp từ các doanh nghiệp đối tác' },
    { label: 'Doanh nghiệp kết nối', value: '150.000+', desc: 'Từ startup công nghệ tới tập đoàn đa quốc gia' },
    { label: 'Ứng viên đăng ký', value: '2.5M+', desc: 'Lao động tri thức trẻ trên toàn quốc' },
    { label: 'Tỷ lệ phản hồi hồ sơ', value: '98.5%', desc: 'Rút ngắn quy trình tuyển dụng xuống 48h' },
  ];

  const creditValues = [
    {
      code: 'C',
      name: 'Collaboration',
      vn: 'Hợp tác cùng thắng',
      desc: 'Chúng tôi xây dựng cầu nối công bằng, nơi ứng viên tìm thấy bệ phóng và doanh nghiệp tìm thấy người đồng hành cùng phát triển.',
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
      desc: 'Học hỏi từ phản hồi của cộng đồng để liên tục nâng cấp hệ thống mỗi ngày theo tinh thần agile hiện đại.',
    },
    {
      code: 'T',
      name: 'Transparency',
      vn: 'Minh bạch tối đa',
      desc: 'Công khai dải lương thị trường, bảo mật tuyệt đối dữ liệu người dùng và kiên quyết bài trừ tin lừa đảo nộp cọc.',
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
      icon: <FaBookOpen className="text-primary" size={20} />,
    },
    {
      title: 'Báo cáo lương thị trường 2026',
      desc: 'Khảo sát số liệu mức thu nhập Gross/Net thực tế theo vị trí, kinh nghiệm và vùng địa lý để bạn tự tin thương lượng.',
      link: '/salary-report',
      actionText: 'Xem báo cáo lương',
      icon: <FaChartLine className="text-warning" size={20} />,
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
    <div className="about-gitlab-style" style={{ backgroundColor: '#FFFFFF', color: '#111827' }}>
      {/* 1. HERO SECTION (GITLAB STYLE: BOLD, MINIMALIST, HIGH-CONTRAST) */}
      <section className="border-bottom" style={{ paddingTop: '72px', paddingBottom: '72px', backgroundColor: '#FAFAFB' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-8">
              <div
                className="d-inline-flex align-items-center gap-2 px-2.5 py-1 rounded-pill small fw-bold text-uppercase mb-3"
                style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '12px', letterSpacing: '0.05em' }}
              >
                <FaBolt size={12} /> About JobNest
              </div>
              <h1 className="fw-bold tracking-tight mb-3" style={{ fontSize: '42px', lineHeight: '1.2' }}>
                Hậu trường nền tảng điều phối nhân tài & việc làm thông minh
              </h1>
              <p className="lead text-secondary mb-4" style={{ fontSize: '18px', lineHeight: '1.6', maxWidth: '680px' }}>
                Chúng tôi là đội ngũ đứng sau <strong>JobNest</strong> — nền tảng nơi ứng viên và nhà tuyển dụng kết nối, phát triển và thúc đẩy sự nghiệp mơ ước nhanh hơn với sự trợ lực của trí tuệ nhân tạo.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/jobs"
                  className="btn btn-dark px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2"
                  style={{ borderRadius: '6px' }}
                >
                  <span>Khám phá việc làm</span>
                  <FaArrowRight size={13} />
                </Link>
                <Link
                  to="/support"
                  className="btn btn-outline-secondary px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2"
                  style={{ borderRadius: '6px' }}
                >
                  <FaRobot size={14} className="text-warning" />
                  <span>Trò chuyện cùng AI</span>
                </Link>
              </div>
            </div>

            <div className="col-lg-4 text-center">
              <div className="p-4 rounded-4 bg-white border shadow-sm">
                <img
                  src="/images/jobnest-logo.png"
                  alt="JobNest"
                  style={{ maxHeight: '52px', objectFit: 'contain' }}
                  className="mb-3"
                />
                <div className="badge bg-warning text-dark px-2.5 py-1 fw-bold mb-3">All-in-One Career Hub</div>
                <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                  "Your Career. Your Future. Your Way."<br />
                  Trao quyền làm chủ sự nghiệp cho thế hệ nhân lực số Việt Nam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO (ĐỊNH VỊ GIÁ TRỊ CỐT LÕI) */}
      <section className="py-5 border-bottom">
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: '0.08em' }}>
                Chúng tôi làm gì
              </span>
              <h2 className="fw-bold mt-2 mb-3" style={{ fontSize: '32px', lineHeight: '1.25' }}>
                Kiến tạo chuẩn mực mới cho kết nối tuyển dụng
              </h2>
            </div>
            <div className="col-lg-7">
              <p className="text-secondary" style={{ fontSize: '16px', lineHeight: '1.75' }}>
                Khởi đầu từ năm 2024 như một dự án công nghệ nhằm giải quyết sự bất đối xứng thông tin và nạn tin tuyển dụng ảo trên thị trường, <strong>JobNest</strong> ngày nay đã phát triển thành nền tảng điều phối tuyển dụng thông minh được hàng triệu ứng viên và hàng trăm nghìn doanh nghiệp lựa chọn.
              </p>
              <p className="text-secondary mb-0" style={{ fontSize: '16px', lineHeight: '1.75' }}>
                Từ việc tối ưu CV chuẩn ATS, phân tích độ phù hợp bằng AI cho đến hỗ trợ doanh nghiệp đăng bài và quản lý hồ sơ chỉ trong tích tắc — chúng tôi tin tưởng sâu sắc vào tính minh bạch, tốc độ cải tiến liên tục và việc đặt con người làm trung tâm của mọi đổi mới.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. JOBNEST BY THE NUMBERS (GITLAB STYLE STATS GRID) */}
      <section className="py-5 border-bottom" style={{ backgroundColor: '#FAFAFB' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: '0.08em' }}>
                JobNest theo những con số
              </span>
              <h2 className="fw-bold mt-1 mb-0" style={{ fontSize: '28px' }}>Chỉ số đo lường hiệu quả</h2>
            </div>
            <span className="small text-muted">Dữ liệu cập nhật thời gian thực</span>
          </div>

          <div className="row g-3">
            {numbers.map((item, idx) => (
              <div key={idx} className="col-6 col-lg-3">
                <div className="p-4 bg-white border rounded-3 h-100 shadow-sm">
                  <div className="fw-bold text-muted small mb-1">{item.label}</div>
                  <div className="display-6 fw-bold text-dark mb-1" style={{ letterSpacing: '-0.02em' }}>
                    {item.value}
                  </div>
                  <div className="text-secondary small" style={{ fontSize: '12.5px', lineHeight: '1.5' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MISSION & VISION STATEMENT BLOCK */}
      <section className="py-5 border-bottom bg-dark text-white">
        <div className="container text-center" style={{ maxWidth: '860px' }}>
          <span className="badge bg-warning text-dark px-3 py-1.5 fw-bold text-uppercase mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
            Sứ mệnh của chúng tôi
          </span>
          <h2 className="display-6 fw-bold mb-4" style={{ lineHeight: '1.35' }}>
            "Giải phóng tiềm năng của mỗi cá nhân và trao quyền để mọi người chạm tới công việc mơ ước với tốc độ của khát vọng."
          </h2>
          <p className="text-white-50 lead mb-0" style={{ fontSize: '16px', maxWidth: '640px', margin: '0 auto' }}>
            Bằng việc kết hợp dữ liệu tuyển dụng chuẩn xác cùng trí tuệ nhân tạo, JobNest kiến tạo một thị trường lao động minh bạch, công bằng và hiệu quả vượt bậc cho cộng đồng.
          </p>
        </div>
      </section>

      {/* 5. CREDIT VALUES (GITLAB'S CORE VALUES ARCHITECTURE) */}
      <section className="py-5 border-bottom">
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div className="text-center mb-5">
            <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: '0.08em' }}>
              Hệ giá trị cốt lõi
            </span>
            <h2 className="fw-bold mt-1 mb-2" style={{ fontSize: '32px' }}>Bộ giá trị C-R-E-D-I-T</h2>
            <p className="text-muted small">Những nguyên tắc dẫn lối mọi quyết định thiết kế sản phẩm và phục vụ người dùng của JobNest</p>
          </div>

          <div className="row g-4">
            {creditValues.map((v, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                <div className="p-4 border rounded-3 h-100 bg-white shadow-sm hover-shadow transition">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded fw-bold"
                      style={{ width: '32px', height: '32px', backgroundColor: '#F3F4F6', color: '#1F2937', fontSize: '15px' }}
                    >
                      {v.code}
                    </span>
                    <div>
                      <h5 className="fw-bold text-dark mb-0" style={{ fontSize: '16px' }}>{v.name}</h5>
                      <small className="text-warning-emphasis fw-semibold">{v.vn}</small>
                    </div>
                  </div>
                  <p className="text-muted small mb-0 mt-2" style={{ lineHeight: '1.6' }}>
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MILESTONES / OVER THE YEARS */}
      <section className="py-5 border-bottom" style={{ backgroundColor: '#FAFAFB' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="text-center mb-5">
            <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: '0.08em' }}>
              Hành trình phát triển
            </span>
            <h2 className="fw-bold mt-1" style={{ fontSize: '30px' }}>JobNest qua các năm</h2>
          </div>

          <div className="position-relative ps-4 border-start border-2 border-warning" style={{ marginLeft: '12px' }}>
            {timeline.map((item, idx) => (
              <div key={idx} className="mb-4 position-relative">
                <div
                  className="position-absolute rounded-circle bg-warning border border-white"
                  style={{ width: '14px', height: '14px', left: '-23px', top: '4px' }}
                />
                <span className="badge bg-dark text-white fw-bold mb-1" style={{ fontSize: '12px' }}>
                  {item.year}
                </span>
                <h4 className="fw-bold text-dark mb-1" style={{ fontSize: '18px' }}>{item.title}</h4>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DOANH NGHIỆP CHIẾN LƯỢC */}
      <section className="py-5 border-bottom">
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div className="text-center mb-4">
            <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: '0.08em' }}>
              Đối tác tuyển dụng tiêu biểu
            </span>
            <h3 className="fw-bold mt-1" style={{ fontSize: '24px' }}>Đồng hành cùng các thương hiệu hàng đầu</h3>
          </div>

          <div className="row g-3 justify-content-center">
            {partners.map((p, idx) => (
              <div key={idx} className="col-6 col-sm-4 col-md-2 text-center">
                <div className="p-3 border rounded-3 bg-white h-100 d-flex flex-column align-items-center justify-content-center shadow-sm">
                  <img
                    src={p.logo}
                    alt={p.name}
                    style={{ maxHeight: '32px', maxWidth: '100%', objectFit: 'contain' }}
                    className="mb-2"
                  />
                  <div className="fw-semibold text-dark text-truncate w-100" style={{ fontSize: '11px' }}>
                    {p.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. RESOURCES & WORKING AT JOBNEST (GITLAB 3-COLUMN CARDS) */}
      <section className="py-5 border-bottom" style={{ backgroundColor: '#FAFAFB' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div className="text-center mb-4">
            <span className="text-uppercase small fw-bold text-muted" style={{ letterSpacing: '0.08em' }}>
              Tài nguyên & Kết nối
            </span>
            <h3 className="fw-bold mt-1" style={{ fontSize: '26px' }}>Khám phá thêm về hệ sinh thái JobNest</h3>
          </div>

          <div className="row g-4">
            {resourceCards.map((c, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="p-4 bg-white border rounded-3 h-100 d-flex flex-column justify-content-between shadow-sm">
                  <div>
                    <div className="mb-3">{c.icon}</div>
                    <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '17px' }}>{c.title}</h5>
                    <p className="text-muted small mb-3" style={{ lineHeight: '1.6' }}>{c.desc}</p>
                  </div>
                  <Link to={c.link} className="fw-bold text-dark text-decoration-none small d-inline-flex align-items-center gap-1.5">
                    <span>{c.actionText}</span>
                    <FaArrowRight size={11} className="text-warning" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. START TODAY CTA (GITLAB STYLE: CLEAN BOLD ACTION) */}
      <section className="py-5 text-center bg-white">
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '32px' }}>
            Bắt đầu bứt phá sự nghiệp ngay hôm nay
          </h2>
          <p className="text-secondary small mb-4" style={{ fontSize: '15px' }}>
            Trải nghiệm nền tảng tìm việc làm thông minh với công nghệ AI hỗ trợ chuẩn bị CV và kết nối với những nhà tuyển dụng hàng đầu.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/jobs"
              className="btn btn-dark px-4 py-2.5 fw-bold"
              style={{ borderRadius: '6px' }}
            >
              Tìm việc ngay
            </Link>
            <Link
              to="/register?role=EMPLOYER"
              className="btn btn-warning px-4 py-2.5 fw-bold text-dark"
              style={{ borderRadius: '6px' }}
            >
              Đăng tin tuyển dụng
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
