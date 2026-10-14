import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FaSearch,
  FaBuilding,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCheckCircle,
  FaUsers,
  FaGlobe,
  FaArrowLeft,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowRight,
  FaShareAlt,
  FaBookmark,
  FaRegBookmark,
  FaHeartbeat,
  FaGraduationCap,
  FaUmbrellaBeach,
  FaLightbulb,
  FaHandshake,
  FaAward,
  FaFire,
  FaBolt,
  FaUserFriends,
  FaCheck,
} from 'react-icons/fa';
import mockCompanies from '../mock/companies.js';
import companyApi from '../api/companyApi.js';
import { showToast } from '../components/common/ToastHost.jsx';

const COMPANY_EXTRAS = {
  1: {
    tagline: 'Tiên phong chuyển đổi số và kiến tạo tương lai bền vững cùng công nghệ AI.',
    founded: 1988,
    offices: '30+ Văn phòng toàn cầu',
    officesCount: '30+',
    activeUsers: '50M+',
    funding: 'Niêm yết HOSE (FPT)',
    ownership: 'Tập đoàn Công nghệ',
    hq: 'Cầu Giấy, Hà Nội',
  },
  2: {
    tagline: 'Ngân hàng số thông minh với hệ sinh thái tài chính toàn diện phục vụ hàng triệu khách hàng.',
    founded: 1994,
    offices: '300+ Chi nhánh toàn quốc',
    officesCount: '300+',
    activeUsers: '28M+',
    funding: 'Niêm yết HOSE (MBB)',
    ownership: 'Ngân hàng Thương mại',
    hq: 'Ba Đình, Hà Nội',
  },
  3: {
    tagline: 'Nền tảng phần mềm SaaS và giải pháp quản trị doanh nghiệp phục vụ hơn 250.000 tổ chức.',
    founded: 1994,
    offices: '5 Văn phòng vùng',
    officesCount: '5+',
    activeUsers: '2.5M+',
    funding: 'Cổ phần Công nghệ',
    ownership: 'Doanh nghiệp SaaS',
    hq: 'Cầu Giấy, Hà Nội',
  },
  4: {
    tagline: 'Tập đoàn công nghệ - viễn thông hàng đầu khu vực, phát triển mạng 5G và nền tảng số quốc gia.',
    founded: 1989,
    offices: 'Hoạt động tại 11 Quốc gia',
    officesCount: '11+',
    activeUsers: '80M+',
    funding: 'Tập đoàn Quốc gia',
    ownership: 'Viễn thông & Công nghệ',
    hq: 'Cầu Giấy, Hà Nội',
  },
  5: {
    tagline: 'Dẫn đầu xu hướng ngân hàng bán lẻ và công nghệ thẻ số hóa phong cách sống.',
    founded: 1996,
    offices: '170+ Chi nhánh toàn quốc',
    officesCount: '170+',
    activeUsers: '5M+',
    funding: 'Niêm yết HOSE (VIB)',
    ownership: 'Ngân hàng Thương mại',
    hq: 'Hoàn Kiếm, Hà Nội',
  },
  6: {
    tagline: 'Thương hiệu sữa quốc gia với chuỗi cung ứng bền vững chuẩn quốc tế và cam kết Net Zero.',
    founded: 1976,
    offices: '15 Trang trại & 13 Nhà máy',
    officesCount: '28+',
    activeUsers: '45M+',
    funding: 'Niêm yết HOSE (VNM)',
    ownership: 'Tập đoàn Tiêu dùng',
    hq: 'Quận 7, TP.HCM',
  },
  7: {
    tagline: 'Dẫn đầu trải nghiệm khách hàng (CX) toàn cầu với giải pháp công nghệ đa kênh tiên tiến.',
    founded: 1973,
    offices: '275+ Trung tâm toàn cầu',
    officesCount: '275+',
    activeUsers: '100M+',
    funding: 'Niêm yết NASDAQ (CNXC)',
    ownership: 'Tập đoàn Đa quốc gia',
    hq: 'Quận 12, TP.HCM',
  },
  8: {
    tagline: 'Đầu tư đa ngành, phân phối thiết bị cơ điện và chuỗi cung ứng thương mại hiện đại.',
    founded: 2012,
    offices: '3 Trụ sở miền',
    officesCount: '3+',
    activeUsers: '1.2M+',
    funding: 'Tư nhân Đầu tư',
    ownership: 'Thương mại Cơ điện',
    hq: 'Hai Bà Trưng, Hà Nội',
  },
  9: {
    tagline: 'Nhà phát triển đại đô thị thông minh và hệ sinh thái dịch vụ tiêu chuẩn quốc tế.',
    founded: 1993,
    offices: 'Đại đô thị toàn quốc',
    officesCount: '20+',
    activeUsers: '8M+',
    funding: 'Niêm yết HOSE (VHM)',
    ownership: 'Bất động sản Đô thị',
    hq: 'Gia Lâm, Hà Nội',
  },
  10: {
    tagline: 'Tập đoàn sản xuất công nghiệp và chế tạo thép hàng đầu Đông Nam Á.',
    founded: 1992,
    offices: 'Hệ thống khu liên hợp toàn quốc',
    officesCount: '15+',
    activeUsers: '10M+',
    funding: 'Niêm yết HOSE (HPG)',
    ownership: 'Tập đoàn Công nghiệp',
    hq: 'Long Biên, Hà Nội',
  },
  11: {
    tagline: 'Định chế tài chính và dịch vụ chứng khoán uy tín số 1 trên thị trường vốn Việt Nam.',
    founded: 1997,
    offices: '12 Chi nhánh toàn quốc',
    officesCount: '12+',
    activeUsers: '2M+',
    funding: 'Niêm yết HOSE (SSI)',
    ownership: 'Tài chính Chứng khoán',
    hq: 'Quận 1, TP.HCM',
  },
};

const DEFAULT_PERKS = [
  {
    icon: <FaHeartbeat size={20} className="text-danger" />,
    title: 'Sức khỏe & Bảo hiểm toàn diện',
    desc: 'Gói bảo hiểm sức khỏe cao cấp cho nhân viên và người thân, khám sức khỏe định kỳ hàng năm tại các bệnh viện quốc tế hàng đầu.',
  },
  {
    icon: <FaMoneyBillWave size={20} className="text-warning" />,
    title: 'Tài chính, Thưởng & ESOP',
    desc: 'Lương tháng 13, thưởng hiệu quả kinh doanh không giới hạn, xét tăng lương định kỳ 2 lần/năm cùng chính sách cổ phiếu thưởng ESOP.',
  },
  {
    icon: <FaUmbrellaBeach size={20} className="text-info" />,
    title: 'Thời gian & Cân bằng sống',
    desc: '15 - 20 ngày phép năm có lương, chế độ làm việc linh hoạt Hybrid / Remote kết hợp ngày nghỉ dịp sinh nhật và các kỳ nghỉ lễ dài.',
  },
  {
    icon: <FaGraduationCap size={20} className="text-primary" />,
    title: 'Đào tạo & Phát triển chuyên môn',
    desc: 'Tài trợ 100% chi phí thi chứng chỉ quốc tế (AWS, PMP, CFA...), khóa huấn luyện kỹ năng lãnh đạo và lộ trình thăng tiến rõ ràng.',
  },
  {
    icon: <FaBuilding size={20} className="text-success" />,
    title: 'Môi trường làm việc chuẩn quốc tế',
    desc: 'Văn phòng hiện đại, Pantry miễn phí đồ uống & đồ ăn nhẹ cả ngày, khu vực thư giãn giải trí và phòng tập thể thao tiện nghi.',
  },
  {
    icon: <FaAward size={20} className="text-warning" />,
    title: 'Vinh danh & Phúc lợi gia đình',
    desc: 'Chương trình khen thưởng cá nhân & tập thể xuất sắc hàng quý, Company Trip du lịch hàng năm và quà tặng ý nghĩa vào các dịp lễ tết.',
  },
];

const DEFAULT_VALUES = [
  {
    icon: <FaLightbulb size={22} className="text-warning" />,
    title: 'Đổi mới & Tiên phong (Innovation First)',
    desc: 'Không ngừng thử nghiệm công nghệ mới, khuyến khích sáng kiến đột phá và cải tiến liên tục để tạo ra giá trị khác biệt cho cộng đồng.',
  },
  {
    icon: <FaHandshake size={22} className="text-primary" />,
    title: 'Tôn trọng & Hòa nhập (Diversity & Inclusion)',
    desc: 'Xây dựng môi trường bình đẳng, tôn trọng sự đa dạng cá nhân, luôn lắng nghe và trao quyền để mỗi cá nhân phát huy tối đa tiềm năng.',
  },
  {
    icon: <FaCheckCircle size={22} className="text-success" />,
    title: 'Chính trực & Cam kết (Integrity & Excellence)',
    desc: 'Lấy sự trung thực và minh bạch làm kim chỉ nam, kiên định thực hiện cam kết với khách hàng, đối tác và đồng nghiệp.',
  },
  {
    icon: <FaUsers size={22} className="text-info" />,
    title: 'Đồng hành & Gắn kết (One Team Mindset)',
    desc: 'Cùng chung mục tiêu phụng sự xã hội, sẵn sàng sẻ chia kiến thức và tương trợ lẫn nhau để cùng tiến xa hơn.',
  },
];

const CATEGORY_TABS = [
  { id: 'ALL', label: 'Tất cả lĩnh vực' },
  { id: 'IT - Phần mềm', label: 'Công nghệ thông tin' },
  { id: 'Kinh doanh', label: 'Kinh doanh - Bán hàng' },
  { id: 'Ngân hàng', label: 'Tài chính - Ngân hàng' },
  { id: 'Sản xuất', label: 'Sản xuất - Vận hành' },
  { id: 'Dịch vụ Khách hàng', label: 'Dịch vụ - CSKH' },
  { id: 'Bất động sản', label: 'Bất động sản' },
];

const SEARCH_HINTS = ['FPT', 'Ngân hàng', 'IT', 'Marketing', 'Hà Nội', 'TP.HCM'];

const getJobSkills = (job, industry) => {
  if (job.skills && job.skills.length > 0) return job.skills;
  const t = (job.title || '').toLowerCase();
  if (t.includes('java')) return ['Java', 'Spring Boot', 'Cloud Microservices'];
  if (t.includes('frontend') || t.includes('react')) return ['ReactJS', 'Next.js', 'TypeScript'];
  if (t.includes('devops') || t.includes('cloud') || t.includes('platform')) return ['AWS', 'Kubernetes', 'Docker'];
  if (t.includes('ai') || t.includes('data')) return ['Python', 'Machine Learning', 'Data Science'];
  if (t.includes('banker') || t.includes('khách hàng')) return ['Tài chính DN', 'B2B', 'SME'];
  if (t.includes('security') || t.includes('bảo mật')) return ['An toàn thông tin', 'SOC', 'Network'];
  if (t.includes('teller') || t.includes('giao dịch')) return ['Giao dịch số', 'CSKH', 'Nghiệp vụ'];
  if (t.includes('kinh doanh') || t.includes('sales')) return ['B2B Sales', 'Đàm phán', 'CRM'];
  if (t.includes('marketing')) return ['Digital Marketing', 'SEO / Ads', 'Content'];
  if (t.includes('thiết kế') || t.includes('designer')) return ['Figma', 'UI/UX', 'Product Design'];
  return [industry || 'Chuyên môn', 'Chế độ tốt'];
};

export default function Companies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCompanyId = searchParams.get('id');

  const [companiesList, setCompaniesList] = useState(mockCompanies);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [activeIndustry, setActiveIndustry] = useState('ALL');
  const [companyTab, setCompanyTab] = useState('overview');
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    companyApi.getCompanies().then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setCompaniesList(res);
      }
    });
  }, []);

  const filteredCompanies = useMemo(() => {
    return companiesList.filter((c) => {
      if (activeIndustry !== 'ALL' && !c.industry?.includes(activeIndustry)) {
        return false;
      }
      if (selectedLocation !== 'all' && !c.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        return (
          c.name?.toLowerCase().includes(kw) ||
          c.shortName?.toLowerCase().includes(kw) ||
          c.industry?.toLowerCase().includes(kw) ||
          c.location?.toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [companiesList, searchKeyword, activeIndustry, selectedLocation]);

  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) return null;
    return companiesList.find((c) => String(c.id) === String(selectedCompanyId));
  }, [companiesList, selectedCompanyId]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('success', 'Đã sao chép liên kết công ty vào bộ nhớ tạm!');
  };

  const handleToggleFollow = () => {
    setIsFollowed(!isFollowed);
    showToast('success', !isFollowed ? 'Đã lưu và theo dõi tin tuyển dụng của công ty!' : 'Đã hủy theo dõi công ty.');
  };

  // NẾU ĐANG CHỌN 1 CÔNG TY -> XEM CHI TIẾT CÔNG TY THEO THIẾT KẾ NOVATECH - JOBNEST
  if (selectedCompany) {
    const extras = COMPANY_EXTRAS[selectedCompany.id] || {
      tagline: `${selectedCompany.shortName} kiến tạo môi trường làm việc chuyên nghiệp, nuôi dưỡng nhân tài và phát triển bền vững.`,
      founded: 1995,
      offices: 'Chi nhánh toàn quốc',
      officesCount: '6+',
      activeUsers: '10M+',
      funding: 'Doanh nghiệp Hàng đầu',
      ownership: 'Doanh nghiệp Cổ phần',
      hq: selectedCompany.location,
    };
    const jobsList = selectedCompany.jobs || [];

    return (
      <div className="novatech-page-wrap">
        {/* 1. HERO BANNER BLOCK (NovaTech Canvas) */}
        <section className="novatech-hero-wrap">
          <div className="novatech-hero-dots-left" />
          <div className="novatech-hero-dots-right" />

          <div className="container" style={{ maxWidth: '1240px' }}>
            {/* Breadcrumb nhẹ nhàng */}
            <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 text-muted small fw-semibold"
                onClick={() => setSearchParams({})}
              >
                Doanh nghiệp
              </button>
              <span>›</span>
              <span className="text-secondary">{selectedCompany.shortName || selectedCompany.name}</span>
            </div>

            {/* Profile Identity Bar */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
              <div className="d-flex align-items-center" style={{ gap: '26px' }}>
                {/* Logo Box */}
                <div className="novatech-logo-box position-relative">
                  <img
                    src={selectedCompany.logo}
                    alt={selectedCompany.name}
                    className="novatech-logo-img"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div
                    className="fw-bold text-dark d-none align-items-center justify-content-center w-100 h-100 fs-3"
                  >
                    {(selectedCompany.shortName || selectedCompany.name).charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Company Name & Meta */}
                <div>
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1.5">
                    <h1 className="h4 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.02em', fontSize: '28px' }}>
                      {selectedCompany.name}
                    </h1>
                    {selectedCompany.verified && (
                      <span className="novatech-verified-badge" title="Doanh nghiệp xác thực">
                        <FaCheck size={9} />
                      </span>
                    )}
                    <span className="novatech-badge-tag">{selectedCompany.industry}</span>
                    <span className="novatech-badge-tag">{extras.ownership || 'Enterprise Tech'}</span>
                  </div>

                  <p className="mb-2 fw-semibold" style={{ fontSize: '15px', maxWidth: '760px', color: '#334155', lineHeight: '1.5' }}>
                    "{extras.tagline}"
                  </p>

                  <div className="d-flex flex-wrap align-items-center gap-3" style={{ fontSize: '14.5px', color: '#334155' }}>
                    <span className="d-inline-flex align-items-center gap-1.5 fw-medium">
                      <FaMapMarkerAlt size={13} className="text-secondary" />
                      <span>{extras.hq || selectedCompany.location} • Làm việc linh hoạt</span>
                    </span>
                    <span>•</span>
                    <span className="d-inline-flex align-items-center gap-1.5 fw-medium">
                      <FaUsers size={13} className="text-secondary" />
                      <span>{selectedCompany.size}</span>
                    </span>
                    {selectedCompany.website && (
                      <>
                        <span>•</span>
                        <a
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-decoration-none d-inline-flex align-items-center gap-1 fw-bold"
                          style={{ color: '#0F172A' }}
                        >
                          <FaGlobe size={13} />
                          <span>{selectedCompany.website.replace('https://', '')}</span>
                          <span style={{ fontSize: '11px', color: '#EA580C' }}>↗</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* CTAs bên phải */}
              <div className="d-flex align-items-center gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  className={`btn novatech-btn-follow d-inline-flex align-items-center gap-2 ${
                    isFollowed ? 'novatech-btn-follow--active' : ''
                  }`}
                  onClick={handleToggleFollow}
                >
                  {isFollowed ? <FaBookmark size={13} /> : <FaRegBookmark size={13} />}
                  <span>{isFollowed ? 'Đang theo dõi' : 'Theo dõi'}</span>
                </button>

                <button
                  type="button"
                  className="btn novatech-btn-view-jobs d-inline-flex align-items-center gap-2"
                  onClick={() => {
                    const el = document.getElementById('company-jobs-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <FaBriefcase size={13} />
                  <span>Xem việc làm ({jobsList.length})</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. MAIN 2-COLUMN CONTENT GRID */}
        <div className="container py-4 my-2" style={{ maxWidth: '1240px' }}>
          <div className="row g-4 align-items-start">
            {/* CỘT TRÁI (~68% width): Danh sách việc làm & vị trí nổi bật */}
            <div className="col-12 col-lg-8" id="company-jobs-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div className="text-uppercase fw-bold" style={{ fontSize: '12px', letterSpacing: '0.06em', color: '#475569' }}>
                    VIỆC LÀM &amp; VỊ TRÍ NỔI BẬT
                  </div>
                  <h2 className="fw-bold mb-0" style={{ fontSize: '22px', color: '#0F172A', letterSpacing: '-0.02em' }}>
                    Cơ hội nghề nghiệp tại {selectedCompany.shortName} ({jobsList.length})
                  </h2>
                </div>

                <span className="badge bg-white border px-3 py-1.5 rounded-pill fw-semibold shadow-xs" style={{ fontSize: '13px', color: '#334155' }}>
                  Đang mở tuyển dụng
                </span>
              </div>

              {jobsList.length === 0 ? (
                <div className="p-5 bg-white border rounded-4 text-center text-muted shadow-xs">
                  <FaBriefcase size={36} className="text-muted mb-2 mx-auto" />
                  <h3 className="h6 fw-bold text-dark mb-1">Hiện tại chưa có bài đăng tuyển dụng</h3>
                  <p className="text-muted small mb-0">Doanh nghiệp chưa mở đơn tuyển dụng mới nào trên hệ thống.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {jobsList.map((job) => (
                    <div key={job.id} className="novatech-featured-job-card">
                      <div className="d-flex flex-column gap-1">
                        <h3 className="fw-bold mb-1" style={{ fontSize: '18px', color: '#0F172A', lineHeight: '1.35' }}>
                          <Link to={`/jobs/${job.id}`} className="text-decoration-none hover-primary" style={{ color: '#0F172A' }}>
                            {job.title}
                          </Link>
                        </h3>
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-2" style={{ fontSize: '14.5px', color: '#334155' }}>
                          <span className="fw-semibold text-dark">
                            {job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType === 'INTERN' ? 'Thực tập' : 'Bán thời gian'}
                          </span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span className="fw-bold" style={{ fontSize: '16px', color: '#15803D' }}>
                            {job.salaryText}
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-1.5">
                          {getJobSkills(job, selectedCompany.industry).map((skill, sIdx) => (
                            <span key={sIdx} className="novatech-job-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        to={`/jobs/${job.id}`}
                        className="btn btn-outline-dark rounded-pill fw-bold btn-sm px-4 py-2 text-nowrap align-self-center"
                        style={{ fontSize: '13.5px' }}
                      >
                        Ứng tuyển ngay →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CỘT PHẢI (~32% width): Quick Stats & Company Overview */}
            <div className="col-12 col-lg-4">
              <div className="d-flex flex-column gap-3.5">
                {/* 2 Thẻ Stats đầu tiên */}
                <div className="row g-2.5">
                  <div className="col-6">
                    <div className="novatech-stat-card">
                      <div className="fw-bold text-dark mb-0" style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                        {extras.officesCount || '6+'}
                      </div>
                      <div className="small fw-semibold mt-1" style={{ fontSize: '13.5px', color: '#334155' }}>Văn phòng toàn cầu</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="novatech-stat-card">
                      <div className="fw-bold text-dark mb-0" style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                        {extras.activeUsers || '14M+'}
                      </div>
                      <div className="small fw-semibold mt-1" style={{ fontSize: '13.5px', color: '#334155' }}>Khách hàng / Users</div>
                    </div>
                  </div>
                </div>

                {/* Thẻ Thông tin doanh nghiệp (Company Overview) */}
                <div className="novatech-overview-card">
                  <h3 className="fw-bold mb-3" style={{ fontSize: '18px', color: '#0F172A' }}>
                    Thông tin doanh nghiệp
                  </h3>

                  <div className="d-flex flex-column">
                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Năm thành lập</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{extras.founded}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Hình thức</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{extras.ownership || 'Doanh nghiệp Cổ phần'}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Vốn / Niêm yết</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{extras.funding || 'Niêm yết HOSE'}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Lĩnh vực</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{selectedCompany.industry}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Quy mô</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{selectedCompany.size}</strong>
                    </div>

                    {selectedCompany.website && (
                      <div className="novatech-overview-row">
                        <span style={{ color: '#475569', fontWeight: 500 }}>Trang web</span>
                        <a
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noreferrer"
                          className="fw-bold text-decoration-none d-inline-flex align-items-center gap-1"
                          style={{ color: '#EA580C', fontSize: '14.5px' }}
                        >
                          <span>{selectedCompany.website.replace('https://', '')}</span>
                          <span style={{ fontSize: '11px' }}>↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GIAO DIỆN CHÍNH: DANH SÁCH DOANH NGHIỆP HÀNG ĐẦU
  return (
    <div className="companies-page-root">
      {/* 1. HERO SECTION */}
      <section className="companies-hero-box">
        <div className="companies-hero-dots-left" />
        <div className="companies-hero-dots-right" />

        <div className="container position-relative" style={{ maxWidth: '860px', zIndex: 2 }}>
          {/* Large headline */}
          <h1 className="companies-hero-title">
            Khám phá văn hóa &amp; <span className="highlight-orange">Cơ hội việc làm</span>
          </h1>

          {/* Subtitle */}
          <p className="companies-hero-subtitle">
            Tìm hiểu môi trường làm việc, chế độ đãi ngộ và cơ hội phát triển sự nghiệp từ những doanh nghiệp uy tín hàng đầu.
          </p>

          {/* Modern Split Search Bar */}
          <div className="companies-search-bar">
            <FaSearch className="text-secondary flex-shrink-0" size={17} />
            <input
              type="text"
              className="companies-search-input"
              placeholder="Tìm theo tên công ty, từ khóa, công nghệ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />

            <div className="companies-search-divider" />

            <div className="d-flex align-items-center gap-1.5 flex-shrink-0 pe-2">
              <FaMapMarkerAlt className="text-secondary" size={14} />
              <select
                className="companies-search-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="all">Tất cả địa điểm</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </div>

            <button
              type="button"
              className="companies-search-btn"
              onClick={() => {}}
            >
              <FaSearch size={13} />
              <span>Tìm kiếm</span>
            </button>
          </div>

          {/* Popular Search Text Links (Clean Human Design) */}
          <div className="companies-trending-bar">
            <span className="companies-trending-label">Tìm kiếm phổ biến:</span>
            {['FPT', 'Viettel', 'MB Bank', 'Vinamilk', 'MISA', 'Ngân hàng', 'SaaS', 'Hà Nội'].map((hint, index, arr) => (
              <React.Fragment key={hint}>
                <button
                  type="button"
                  className="companies-trending-item"
                  onClick={() => {
                    setSearchKeyword(hint);
                    if (activeIndustry !== 'ALL') setActiveIndustry('ALL');
                  }}
                >
                  {hint}
                </button>
                {index < arr.length - 1 && <span className="companies-trending-dot">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTER & 3. COMPANY SECTION */}
      <div className="container py-4" style={{ maxWidth: '1280px' }}>
        {/* Category Filter Buttons (Pill shaped) */}
        <div className="companies-filter-nav mb-4">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeIndustry === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`companies-pill-btn ${isActive ? 'companies-pill-btn--active' : ''}`}
                onClick={() => setActiveIndustry(tab.id)}
              >
                {isActive && <span className="companies-pill-accent" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="companies-section-header">
          <div>
            <h2 className="companies-section-title">Doanh nghiệp nổi bật</h2>
            <p className="companies-section-subtitle">
              Khám phá môi trường làm việc và cơ hội nghề nghiệp từ các doanh nghiệp hàng đầu.
            </p>
          </div>

          <div>
            {activeIndustry !== 'ALL' || searchKeyword ? (
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 text-secondary small fw-semibold"
                onClick={() => {
                  setActiveIndustry('ALL');
                  setSearchKeyword('');
                }}
              >
                Xem tất cả →
              </button>
            ) : (
              <span className="small text-muted fw-semibold">
                Hiển thị {filteredCompanies.length} doanh nghiệp
              </span>
            )}
          </div>
        </div>

        {/* 4. COMPANY CARDS (3-COLUMN RESPONSIVE GRID) */}
        {filteredCompanies.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
            <FaBuilding size={42} className="text-muted mb-2 mx-auto" />
            <h3 className="h6 fw-bold text-dark mb-1">Không tìm thấy công ty phù hợp</h3>
            <p className="text-muted small mb-3">Vui lòng thử lại với từ khóa tìm kiếm hoặc danh mục khác.</p>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mx-auto"
              onClick={() => {
                setSearchKeyword('');
                setActiveIndustry('ALL');
              }}
            >
              Xem tất cả doanh nghiệp
            </button>
          </div>
        ) : (
          <div className="row g-3 g-lg-3.5">
            {filteredCompanies.map((comp) => (
              <div key={comp.id} className="col-12 col-sm-6 col-lg-3">
                <div
                  className="company-card-premium"
                  onClick={() => setSearchParams({ id: comp.id })}
                >
                  {/* 16:9 Cover Image with Rounded Top */}
                  <div className="company-card-cover-wrap">
                    <img
                      src={comp.cover}
                      alt={comp.name}
                      className="company-card-cover-img"
                    />
                  </div>

                  {/* Body with overlapping logo */}
                  <div className="company-card-body">
                    {/* Company Logo Overlap */}
                    <div className="company-card-logo-overlap position-relative">
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="company-card-logo-img"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }
                        }}
                      />
                      <div
                        className="fw-bold text-dark d-none align-items-center justify-content-center w-100 h-100 rounded-3 bg-light"
                        style={{ fontSize: '18px' }}
                      >
                        {(comp.shortName || comp.name).charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Company Name & Verified Badge */}
                    <div className="company-name-row d-flex align-items-center gap-1.5">
                      <h3 className="company-card-name text-truncate mb-0" title={comp.name}>
                        {comp.shortName || comp.name}
                      </h3>
                      {comp.verified && (
                        <FaCheckCircle
                          className="text-success flex-shrink-0"
                          size={14}
                          title="Doanh nghiệp đã xác thực"
                        />
                      )}
                    </div>

                    {/* Industry */}
                    <div className="company-card-industry text-truncate">
                      {comp.industry}
                    </div>

                    {/* Location */}
                    <div className="company-card-location">
                      <FaMapMarkerAlt size={13} className="text-secondary flex-shrink-0" />
                      <span className="text-truncate">{comp.location}</span>
                    </div>

                    {/* Footer: Yellow Job Count Badge + CTA */}
                    <div className="company-card-footer">
                      <span className="company-jobs-badge">
                        {comp.jobs?.length || 0} việc làm đang tuyển
                      </span>

                      <div className="company-card-cta">
                        <span>Khám phá công ty</span>
                        <FaArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
