import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaRocket,
  FaLightbulb,
  FaShieldAlt,
  FaUsers,
  FaAward,
  FaRobot,
  FaCheckCircle,
  FaChartLine,
  FaHeart,
  FaBriefcase,
  FaArrowRight,
  FaBuilding,
  FaSearch,
} from 'react-icons/fa';

export default function About() {
  const stats = [
    { number: '2.5M+', label: 'Ứng viên tiềm năng', desc: 'Hồ sơ người tìm việc chất lượng trên toàn quốc' },
    { number: '150K+', label: 'Nhà tuyển dụng', desc: 'Doanh nghiệp uy tín đồng hành và tuyển dụng' },
    { number: '90.000+', label: 'Việc làm mở tuyển', desc: 'Cơ hội nghề nghiệp đa dạng mọi ngành nghề' },
    { number: '98.5%', label: 'Tỷ lệ hài lòng', desc: 'Đánh giá tích cực từ ứng viên và đối tác' },
  ];

  const coreValues = [
    {
      icon: <FaRobot size={24} className="text-warning" />,
      title: 'Ứng dụng AI Thông minh',
      desc: 'Tích hợp mô hình AI tiên tiến hỗ trợ tự động gợi ý mô tả việc làm JD và phân tích độ tương thích CV chính xác đến từng tiêu chí.',
    },
    {
      icon: <FaShieldAlt size={24} className="text-primary" />,
      title: 'Minh bạch & Đáng tin cậy',
      desc: '100% doanh nghiệp và tin tuyển dụng được kiểm duyệt chặt chẽ, loại bỏ hoàn toàn tin giả, tin lừa đảo hoặc phân biệt đối xử.',
    },
    {
      icon: <FaRocket size={24} className="text-danger" />,
      title: 'Tốc độ & Hiệu quả',
      desc: 'Quy trình nộp CV và duyệt hồ sơ diễn ra trong vài giây. Rút ngắn thời gian tuyển dụng của doanh nghiệp từ hàng tuần xuống hàng ngày.',
    },
    {
      icon: <FaHeart size={24} className="text-success" />,
      title: 'Lấy con người làm trọng tâm',
      desc: 'Cung cấp công cụ tư vấn phỏng vấn, phân tích thị trường lương và đồng hành trọn đời cùng bước tiến sự nghiệp của người lao động.',
    },
  ];

  const milestones = [
    { year: '2024', title: 'Khởi đầu sứ mệnh', desc: 'Ý tưởng xây dựng nền tảng kết nối nhân tài thế hệ mới JobNest được thai nghén với kiến trúc mở.' },
    { year: '2025', title: 'Đột phá AI & Công nghệ', desc: 'Tích hợp trợ lý trí tuệ nhân tạo Gemini đánh giá CV tự động và sinh JD chuẩn công nghiệp.' },
    { year: '2026', title: 'Mở rộng toàn quốc', desc: 'Đạt mốc 150.000+ doanh nghiệp kết nối, trở thành điểm đến hàng đầu cho thế hệ lao động tri thức số.' },
  ];

  const partners = [
    { name: 'FPT Corporation', logo: '/images/companies/fpt.svg', industry: 'Công nghệ thông tin' },
    { name: 'Viettel Telecom', logo: '/images/companies/viettel.svg', industry: 'Viễn thông quân đội' },
    { name: 'MB Bank', logo: '/images/companies/mb-bank.png', industry: 'Ngân hàng số' },
    { name: 'Vinamilk', logo: '/images/companies/vinamilk.svg', industry: 'Hàng tiêu dùng FMCG' },
    { name: 'MISA', logo: '/images/companies/misa.svg', industry: 'Phần mềm quản trị' },
    { name: 'Ngân hàng VIB', logo: '/images/companies/vib.png', industry: 'Tài chính - Ngân hàng' },
  ];

  return (
    <div className="about-page" style={{ backgroundColor: '#FCFCFD' }}>
      {/* 1. HERO BANNER */}
      <section className="py-5 border-bottom bg-white">
        <div className="container" style={{ maxWidth: '1140px' }}>
          <div className="row align-items-center g-5 py-lg-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-warning-subtle text-warning-emphasis small fw-bold mb-3">
                <FaRocket size={13} /> VỀ CHÚNG TÔI • JOBNEST VIETNAM
              </div>
              <h1 className="display-5 fw-bold text-dark mb-3 lh-sm">
                Kết nối <span className="text-warning-emphasis">Nhân tài</span>, Kiến tạo <span className="text-dark">Tương lai</span> Sự nghiệp
              </h1>
              <p className="lead text-secondary mb-4" style={{ fontSize: '17px', lineHeight: '1.7' }}>
                JobNest là nền tảng công nghệ nhân sự thông minh thế hệ mới, tiên phong ứng dụng trí tuệ nhân tạo (AI) giúp hàng triệu ứng viên tiếp cận việc làm mơ ước và hỗ trợ doanh nghiệp xây dựng đội ngũ tinh hoa vững mạnh.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/jobs" className="btn btn-brand px-4 py-2.5 fw-bold d-inline-flex align-items-center gap-2">
                  <FaSearch size={14} /> Khám phá việc làm
                </Link>
                <Link to="/register?role=EMPLOYER" className="btn btn-outline-dark px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2">
                  <FaBuilding size={14} /> Dành cho nhà tuyển dụng
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <div className="p-4 rounded-4 shadow-sm bg-light border position-relative overflow-hidden">
                <div className="position-absolute top-0 end-0 p-3 opacity-10">
                  <FaAward size={160} />
                </div>
                <img
                  src="/images/jobnest-logo.png"
                  alt="JobNest Logo"
                  style={{ maxHeight: '60px', objectFit: 'contain' }}
                  className="mb-4"
                />
                <h4 className="fw-bold text-dark mb-2">Hệ sinh thái Tuyển dụng 4.0</h4>
                <p className="text-muted small mb-4">
                  "Your Career. Your Future. Your Way." — Trao quyền cho người lao động làm chủ sự nghiệp của chính mình.
                </p>
                <div className="p-3 bg-white rounded-3 border text-start">
                  <div className="d-flex align-items-center gap-2 text-success small fw-bold mb-1">
                    <FaCheckCircle size={14} /> Cam kết chất lượng
                  </div>
                  <div className="small text-muted">
                    Hơn 90 tin tuyển dụng thực tế mỗi ngày từ các tập đoàn hàng đầu Việt Nam.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-5 bg-white border-bottom">
        <div className="container" style={{ maxWidth: '1140px' }}>
          <div className="row g-4 text-center">
            {stats.map((item, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div className="p-3 h-100 rounded-3 bg-light bg-opacity-50 border">
                  <div className="display-6 fw-bold text-dark mb-1">{item.number}</div>
                  <div className="fw-bold text-warning-emphasis small mb-1">{item.label}</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SỨ MỆNH & TẦM NHÌN */}
      <section className="py-5">
        <div className="container" style={{ maxWidth: '1140px' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white">
                <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-warning-subtle text-warning-emphasis mb-3" style={{ width: '56px', height: '56px' }}>
                  <FaLightbulb size={26} />
                </div>
                <h3 className="fw-bold text-dark mb-3">Sứ mệnh của chúng tôi</h3>
                <p className="text-secondary" style={{ lineHeight: '1.7', fontSize: '15px' }}>
                  Tại JobNest, chúng tôi tin rằng mỗi cá nhân đều sở hữu tiềm năng độc bản xứng đáng được đặt vào môi trường làm việc phù hợp nhất. Sứ mệnh của chúng tôi là xóa bỏ khoảng cách thông tin giữa người lao động và doanh nghiệp bằng giải pháp công nghệ minh bạch, nhanh chóng và công bằng.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white">
                <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-primary-subtle text-primary mb-3" style={{ width: '56px', height: '56px' }}>
                  <FaChartLine size={26} />
                </div>
                <h3 className="fw-bold text-dark mb-3">Tầm nhìn chiến lược</h3>
                <p className="text-secondary" style={{ lineHeight: '1.7', fontSize: '15px' }}>
                  Xây dựng JobNest trở thành hệ sinh thái số toàn diện về nhân sự và phát triển nghề nghiệp tại Việt Nam. Không chỉ là nơi tìm việc, JobNest định hướng là người bạn đồng hành tin cậy cung cấp phân tích thị trường, lộ trình kỹ năng và công nghệ AI hỗ trợ sự nghiệp trọn đời.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GIÁ TRỊ CỐT LÕI */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container" style={{ maxWidth: '1140px' }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-2">Giá trị cốt lõi</h2>
            <p className="text-muted small">Những nguyên tắc định hình cách chúng tôi kiến tạo sản phẩm và phục vụ cộng đồng</p>
          </div>
          <div className="row g-4">
            {coreValues.map((v, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div className="card h-100 border p-3.5 rounded-3 bg-light bg-opacity-25 hover-shadow transition">
                  <div className="mb-3">{v.icon}</div>
                  <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '16px' }}>{v.title}</h5>
                  <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ĐỐI TÁC DOANH NGHIỆP UY TÍN */}
      <section className="py-5">
        <div className="container" style={{ maxWidth: '1140px' }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-2">Đối tác Doanh nghiệp Chiến lược</h2>
            <p className="text-muted small">Hơn 150.000 thương hiệu hàng đầu đặt niềm tin tuyển dụng nhân tài cùng JobNest</p>
          </div>
          <div className="row g-3">
            {partners.map((p, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-2">
                <div className="card h-100 border p-3 text-center rounded-3 bg-white d-flex align-items-center justify-content-center">
                  <img
                    src={p.logo}
                    alt={p.name}
                    style={{ maxHeight: '36px', maxWidth: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="mb-2"
                  />
                  <div className="fw-bold small text-dark text-truncate w-100" style={{ fontSize: '12px' }}>
                    {p.name}
                  </div>
                  <div className="text-muted text-truncate w-100" style={{ fontSize: '10.5px' }}>
                    {p.industry}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="display-6 fw-bold mb-3">Sẵn sàng bứt phá sự nghiệp cùng JobNest?</h2>
          <p className="text-white-50 mb-4" style={{ fontSize: '16px' }}>
            Tham gia cộng đồng nhân tài ngay hôm nay để nhận thông báo việc làm mới nhất và trải nghiệm công nghệ đánh giá hồ sơ CV bằng AI.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-warning px-4 py-2.5 fw-bold text-dark">
              Đăng ký tài khoản miễn phí
            </Link>
            <Link to="/support" className="btn btn-outline-light px-4 py-2.5 fw-semibold">
              Trò chuyện cùng AI Bot
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
