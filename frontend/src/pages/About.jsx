import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaShieldAlt,
  FaBolt,
  FaHeart,
  FaCodeBranch,
  FaCheckCircle,
  FaBuilding,
  FaBriefcase,
} from 'react-icons/fa';
import '../styles/about.css';

export default function About() {
  const stats = [
    { value: '90.000+', label: 'Việc làm mở tuyển', note: 'Thẩm định trực tiếp từ doanh nghiệp' },
    { value: '150.000+', label: 'Doanh nghiệp đối tác', note: 'Từ startup tới tập đoàn hàng đầu' },
    { value: '2.5M+', label: 'Lượt kết nối ứng viên', note: 'Lao động tri thức trẻ trên cả nước' },
    { value: '< 48 giờ', label: 'Thời gian phản hồi', note: 'Rút ngắn 70% quy trình chờ đợi' },
  ];

  const values = [
    {
      icon: <FaShieldAlt className="text-warning" size={20} />,
      title: 'Minh bạch là danh dự',
      desc: 'Công khai dải lương thị trường, phản hồi quy trình rõ ràng và kiên quyết bài trừ 100% tin tuyển dụng lừa đảo thu phí đặt cọc.',
    },
    {
      icon: <FaBolt className="text-warning" size={20} />,
      title: 'Tốc độ cùng Trí tuệ Nhân tạo',
      desc: 'Ứng dụng AI thông minh đo độ khớp CV và gợi ý vị trí chuẩn xác, giúp ứng viên và nhà tuyển dụng tìm thấy nhau trong tích tắc.',
    },
    {
      icon: <FaHeart className="text-warning" size={20} />,
      title: 'Đặt con người ở trung tâm',
      desc: 'Mỗi hồ sơ là một câu chuyện sự nghiệp độc bản. Chúng tôi tôn trọng khát vọng, thời gian và công sức của từng người tìm việc.',
    },
    {
      icon: <FaCodeBranch className="text-warning" size={20} />,
      title: 'Cải tiến không ngừng nghỉ',
      desc: 'Lắng nghe phản hồi từ cộng đồng để hoàn thiện từng dòng mã, nâng cấp trải nghiệm mượt mà và thực tế nhất mỗi tuần.',
    },
  ];

  const milestones = [
    {
      year: '2024',
      badge: 'Khởi sinh',
      title: 'Bản commit đầu tiên & Báo cáo lương IT',
      desc: 'JobNest khởi sự như một dự án công nghệ nhằm giải quyết bài toán thiếu minh bạch về đãi ngộ và tin ảo trong ngành phần mềm.',
    },
    {
      year: '2025',
      badge: 'Đột phá AI',
      title: 'Tích hợp AI MatchScore & Chuẩn hóa ATS',
      desc: 'Tiên phong đưa mô hình AI phân tích CV theo thời gian thực, hỗ trợ ứng viên biết chính xác điểm mạnh và cơ hội trúng tuyển trước khi nộp đơn.',
    },
    {
      year: '2026',
      badge: 'Hệ sinh thái',
      title: 'Hệ sinh thái nghề nghiệp toàn diện',
      desc: 'Cán mốc 150.000 doanh nghiệp tin cậy, mở rộng phân hệ tuyển dụng cho doanh nghiệp và quản trị cơ hội nghề nghiệp trên toàn quốc.',
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
    <div className="about-editorial-page">
      {/* 1. HERO: BỐ CỤC BÁO CHÍ HIỆN ĐẠI (KHÔNG DÙNG THẺ HỘP MOCKUP AI) */}
      <section className="about-hero-section">
        <div className="container" style={{ maxWidth: '1180px' }}>
          <div className="row align-items-center g-5">
            {/* Cột trái: Tuyên ngôn & Nội dung */}
            <div className="col-12 col-lg-7">
              <div className="about-tag mb-3">
                <span>VỀ JOBNEST</span>
                <span className="about-tag-sep">/</span>
                <span>NỀN TẢNG NGHỀ NGHIỆP THÔNG MINH</span>
              </div>

              <h1 className="about-hero-title mb-4">
                Xây dựng chuẩn mực mới cho kết nối nhân tài và việc làm tại Việt Nam.
              </h1>

              <p className="about-hero-lead mb-4">
                JobNest ra đời từ một trăn trở giản dị: Thị trường lao động công nghệ xứng đáng có một môi trường minh bạch dải lương, tôn trọng thời gian của ứng viên và kết nối thẳng tới các doanh nghiệp uy tín bằng sự trợ lực của trí tuệ nhân tạo.
              </p>

              <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                <Link to="/jobs" className="btn-about-primary">
                  <span>Khám phá 90,000+ việc làm</span>
                  <FaArrowRight size={13} />
                </Link>

                <a href="#our-story" className="btn-about-secondary">
                  Câu chuyện sáng lập
                </a>
              </div>

              <div className="about-hero-proof d-flex align-items-center gap-2">
                <FaCheckCircle className="text-warning flex-shrink-0" size={14} />
                <span>100% dữ liệu tin tuyển dụng được kiểm duyệt xác thực pháp nhân doanh nghiệp.</span>
              </div>
            </div>

            {/* Cột phải: Hình ảnh thực tế con người & không gian làm việc (Thay thế khối hộp AI cũ) */}
            <div className="col-12 col-lg-5">
              <div className="about-hero-visual">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
                  alt="Đội ngũ JobNest và môi trường làm việc"
                  className="about-hero-img"
                  loading="eager"
                />
                <div className="about-hero-float-chip">
                  <div className="about-chip-dot" />
                  <div>
                    <div className="about-chip-title">&lt; 48 giờ</div>
                    <div className="about-chip-sub">Thời gian phản hồi hồ sơ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS: DẢI CHỈ SỐ THANH LỊCH (DÙNG ĐƯỜNG KẺ THAY VÌ ĐÓNG HỘP) */}
      <section className="about-stats-section">
        <div className="container" style={{ maxWidth: '1180px' }}>
          <div className="row g-4">
            {stats.map((s, idx) => (
              <div key={idx} className="col-6 col-lg-3">
                <div className="about-stat-item">
                  <div className="about-stat-value">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                  <div className="about-stat-note">{s.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STORY: CÂU CHUYỆN KHỞI NGUYÊN (PHONG CÁCH TỰ SỰ BÁO CHÍ) */}
      <section id="our-story" className="about-story-section">
        <div className="container" style={{ maxWidth: '1180px' }}>
          <div className="row g-5">
            <div className="col-12 col-lg-5">
              <div className="about-story-sticky">
                <span className="about-section-kicker">CÂU CHUYỆN KHỞI NGUYÊN</span>
                <h2 className="about-story-quote mt-2">
                  "Một tin tuyển dụng tử tế không chỉ nêu yêu cầu, mà phải cho ứng viên thấy rõ sự tôn trọng và lộ trình phát triển."
                </h2>
                <div className="about-story-author mt-3">
                  <strong>Ban sáng lập JobNest</strong>
                  <span>Hà Nội, 2024</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-7">
              <div className="about-story-prose">
                <p>
                  Tháng 9 năm 2024, dự án JobNest được bắt đầu bởi một nhóm kỹ sư phần mềm trẻ. Khi ấy, việc tìm kiếm một công việc công nghệ thường gặp vô vàn rào cản: mức lương bị giấu kín với cụm từ "Thỏa thuận", hàng loạt bài đăng tuyển dụng ảo trôi nổi để thu thập dữ liệu cá nhân, và các quy trình phỏng vấn kéo dài nhiều tuần mà không nhận lại được bất kỳ dòng phản hồi nào.
                </p>
                <p>
                  Chúng tôi đặt ra một câu hỏi cốt lõi: <em>Nếu AI có thể giải quyết các bài toán kỹ thuật phức tạp nhất, tại sao không dùng nó để mang lại sự công bằng và minh bạch cho chính người lao động?</em>
                </p>
                <p>
                  Từ ý tưởng đó, công cụ <strong>AI MatchScore</strong> đầu tiên ra đời, giúp người tìm việc soi chiếu độ tương thích của CV trước khi nhấn nút nộp đơn. Đi cùng là quy trình xác thực doanh nghiệp nghiêm ngặt, kiên quyết từ chối những tin tuyển dụng mập mờ hoặc yêu cầu người ứng tuyển đóng tiền cọc.
                </p>
                <p>
                  Đến nay, JobNest đã trở thành điểm tựa tin cậy kết nối hàng triệu lượt ứng viên với hơn 150.000 doanh nghiệp hàng đầu trên khắp cả nước.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUES: BỘ GIÁ TRỊ CỐT LÕI (TRÌNH BÀY DẢI NGANG THOÁNG ĐÃNG) */}
      <section className="about-values-section">
        <div className="container" style={{ maxWidth: '1180px' }}>
          <div className="text-start mb-5">
            <span className="about-section-kicker">NGUYÊN TẮC HÀNH ĐỘNG</span>
            <h2 className="about-section-heading mt-2">Bộ giá trị định hình cách JobNest phụng sự</h2>
          </div>

          <div className="row g-4">
            {values.map((v, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="about-value-row">
                  <div className="about-value-icon">{v.icon}</div>
                  <div>
                    <h3 className="about-value-title">{v.title}</h3>
                    <p className="about-value-desc">{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TIMELINE: HÀNH TRÌNH PHÁT TRIỂN (BỐ CỤC TIẾN TRÌNH LIÊN TỤC, KHÔNG DÙNG THẺ HỘP) */}
      <section className="about-milestones-section">
        <div className="container" style={{ maxWidth: '1180px' }}>
          <div className="text-start mb-5">
            <span className="about-section-kicker">HÀNH TRÌNH BỀN BỈ</span>
            <h2 className="about-section-heading mt-2">Các mốc son phát triển</h2>
          </div>

          <div className="about-milestones-rail">
            <div className="about-milestones-line" />
            <div className="row g-4 g-lg-5">
              {milestones.map((m, idx) => (
                <div key={idx} className="col-12 col-lg-4">
                  <div className="about-milestone-step">
                    <div className="about-milestone-head">
                      <div className="about-milestone-dot" />
                      <div className="about-milestone-year">{m.year}</div>
                      <span className="about-milestone-pill">{m.badge}</span>
                    </div>
                    <h3 className="about-milestone-title">{m.title}</h3>
                    <p className="about-milestone-desc">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PARTNERS: HỆ THỐNG DOANH NGHIỆP ĐỒNG HÀNH */}
      <section className="about-partners-section">
        <div className="container" style={{ maxWidth: '1180px' }}>
          <div className="text-center mb-5">
            <span className="about-section-kicker">ĐỐI TÁC CHIẾN LƯỢC</span>
            <h3 className="about-partners-title mt-2">Được tin chọn bởi những thương hiệu dẫn đầu</h3>
          </div>

          <div className="row g-4 justify-content-center align-items-center">
            {partners.map((p, idx) => (
              <div key={idx} className="col-6 col-sm-4 col-lg-2 text-center">
                <div className="about-partner-card" title={p.name}>
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="about-partner-logo-img"
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

      {/* 7. BOTTOM CALL TO ACTION: TRANG NHÃ & DỄ HÀNH ĐỘNG */}
      <section className="about-cta-section">
        <div className="container" style={{ maxWidth: '820px' }}>
          <div className="about-cta-inner text-center">
            <h2 className="about-cta-title mb-3">
              Sẵn sàng làm chủ bước tiến sự nghiệp tiếp theo?
            </h2>
            <p className="about-cta-sub mb-4">
              Khám phá hàng ngàn cơ hội công nghệ chất lượng cao hoặc tìm kiếm ứng viên tài năng cho doanh nghiệp của bạn ngay hôm nay.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/jobs" className="btn-about-primary">
                <span>Tìm việc làm ngay</span>
                <FaBriefcase size={14} />
              </Link>
              <Link to="/register?role=EMPLOYER" className="btn-about-outline">
                <span>Dành cho Nhà tuyển dụng</span>
                <FaBuilding size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
