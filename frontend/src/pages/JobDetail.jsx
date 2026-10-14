import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBriefcase,
  FaUserTie,
  FaBuilding,
  FaShareAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaCheck,
  FaBookmark,
  FaRegBookmark,
  FaGlobe,
  FaFlag,
  FaEdit,
  FaTrash,
  FaArrowRight,
  FaExternalLinkAlt,
  FaShieldAlt,
} from 'react-icons/fa';
import jobApi from '../api/jobApi.js';
import mockCompanies from '../mock/companies.js';
import JobCard from '../components/job/JobCard.jsx';
import ApplyModal from '../components/job/ApplyModal.jsx';
import ReportModal from '../components/job/ReportModal.jsx';
import { Spinner } from '../components/common/Loading.jsx';
import { showToast } from '../components/common/ToastHost.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const getTechSkills = (job, industry) => {
  if (job.skills && job.skills.length > 0) return job.skills;
  const t = (job.title || '').toLowerCase();
  if (t.includes('java')) return ['Java', 'Spring Boot', 'Cloud Microservices', 'Docker', 'Kafka', 'Redis', 'PostgreSQL', 'AWS / GCP'];
  if (t.includes('frontend') || t.includes('react')) return ['ReactJS', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'RESTful API'];
  if (t.includes('devops') || t.includes('cloud')) return ['AWS', 'Kubernetes', 'Docker', 'CI/CD Pipeline', 'Terraform', 'Linux'];
  if (t.includes('ai') || t.includes('data')) return ['Python', 'Machine Learning', 'Data Science', 'PyTorch', 'SQL', 'FastAPI'];
  if (t.includes('banker') || t.includes('khách hàng')) return ['Tài chính DN', 'B2B Sales', 'Thẩm định tín dụng', 'SME', 'CSKH'];
  if (t.includes('security') || t.includes('bảo mật')) return ['An toàn thông tin', 'SOC', 'Network Security', 'Penetration Testing'];
  if (t.includes('teller') || t.includes('giao dịch')) return ['Giao dịch số', 'Nghiệp vụ ngân hàng', 'CSKH', 'Kiểm ngân'];
  if (t.includes('kinh doanh') || t.includes('sales')) return ['B2B Sales', 'Đàm phán thương mại', 'CRM', 'Thị trường'];
  if (t.includes('marketing')) return ['Digital Marketing', 'SEO / SEM', 'Content Strategy', 'Social Ads'];
  if (t.includes('thiết kế') || t.includes('designer')) return ['Figma', 'UI/UX Design', 'Design System', 'Prototyping'];
  return [industry || 'Kỹ năng chuyên môn', 'Làm việc nhóm', 'Tư duy logic'];
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuth } = useAuth();

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    window.scrollTo(0, 0);

    jobApi
      .getJobDetail(id)
      .then((data) => {
        setJob(data);
        setIsSaved(!!data.saved);
        setLoading(false);
        const catSlug = data.category?.slug || (typeof data.category === 'string' ? data.category : 'all');
        jobApi
          .getJobs({ category: catSlug, size: 4 })
          .then((res) => {
            const others = (res.content || []).filter((j) => String(j.id) !== String(data.id));
            setSimilarJobs(others.slice(0, 3));
          })
          .catch(() => {});
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleApplyClick = () => {
    if (!user) {
      showToast('info', 'Vui lòng đăng nhập để ứng tuyển công việc này!');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    if (user.role === 'EMPLOYER') {
      showToast('error', 'Tài khoản Nhà tuyển dụng không thể ứng tuyển!');
      return;
    }
    setShowApplyModal(true);
  };

  const handleToggleSave = async () => {
    if (!isAuth) {
      showToast('info', 'Vui lòng đăng nhập để lưu công việc này!');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (user?.role === 'EMPLOYER') {
      showToast('error', 'Chỉ người tìm việc mới lưu được việc làm!');
      return;
    }

    const next = !isSaved;
    setIsSaved(next);
    try {
      if (next) {
        await jobApi.saveJob(job.id);
        showToast('success', 'Đã lưu công việc vào danh sách quan tâm!');
      } else {
        await jobApi.unsaveJob(job.id);
        showToast('info', 'Đã bỏ lưu công việc.');
      }
    } catch {
      setIsSaved(!next);
      showToast('error', 'Không thể cập nhật trạng thái lưu việc làm.');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('success', 'Đã sao chép liên kết công việc vào bộ nhớ tạm!');
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner size="lg" className="my-5" />
        <p className="text-muted fw-semibold">Đang tải thông tin chi tiết việc làm...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3 text-dark">Không tìm thấy công việc này</h2>
        <p className="text-muted mb-4">Tin tuyển dụng có thể đã hết hạn hoặc bị gỡ bỏ khỏi hệ thống.</p>
        <button type="button" onClick={handleBack} className="btn btn-dark rounded-pill px-4 py-2">
          <FaArrowLeft className="me-2" /> Quay lại trang trước
        </button>
      </div>
    );
  }

  const companyName = job.company?.name || job.companyName || 'Doanh nghiệp uy tín';
  const companyLogo = job.company?.logoUrl || job.logoUrl;
  const initial = companyName.charAt(0).toUpperCase();

  const companyInfo = mockCompanies.find(
    (c) =>
      c.name === companyName ||
      (c.shortName && companyName.toLowerCase().includes(c.shortName.toLowerCase())) ||
      (c.slug && (job.company?.slug === c.slug || job.company?.name?.toLowerCase().includes(c.slug)))
  ) || {};

  const targetCompanyId = job.company?.id || companyInfo.id;
  const companyWebsite =
    companyInfo.website ||
    (companyName.toLowerCase().includes('a.i') ? 'https://aisoft.com.vn' :
     companyName.toLowerCase().includes('fpt') ? 'https://fpt.com.vn' :
     companyName.toLowerCase().includes('viettel') ? 'https://viettel.com.vn' :
     companyName.toLowerCase().includes('mb') ? 'https://mbbank.com.vn' :
     companyName.toLowerCase().includes('vinamilk') ? 'https://vinamilk.com.vn' :
     companyName.toLowerCase().includes('misa') ? 'https://misa.vn' :
     companyName.toLowerCase().includes('vinhomes') ? 'https://vinhomes.vn' :
     companyName.toLowerCase().includes('hòa phát') ? 'https://hoaphat.com.vn' :
     companyName.toLowerCase().includes('ssi') ? 'https://ssi.com.vn' :
     companyName.toLowerCase().includes('vib') ? 'https://vib.com.vn' :
     companyName.toLowerCase().includes('concentrix') ? 'https://concentrix.com' :
     companyName.toLowerCase().includes('k&m') ? 'https://kmholdings.vn' :
     null);

  const skillsList = getTechSkills(job, companyInfo.industry);

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* 1. HERO BANNER - WARM AMBIENT CANVAS */}
      <section className="job-hero-wrap">
        <div className="container" style={{ maxWidth: '1240px' }}>
          {/* Breadcrumbs Navigation */}
          <div className="d-flex align-items-center gap-2 mb-3 text-muted small" style={{ fontSize: '13.5px' }}>
            <Link to="/" className="text-muted text-decoration-none fw-semibold">
              Trang chủ
            </Link>
            <span>›</span>
            <Link to="/jobs" className="text-muted text-decoration-none fw-semibold">
              Việc làm
            </Link>
            <span>›</span>
            <span className="text-muted fw-semibold">{job.category?.name || 'Công nghệ thông tin'}</span>
            <span>›</span>
            <span className="text-dark fw-bold">{companyInfo.shortName || companyName}</span>
          </div>

          {/* Job Identity & Header Cluster */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-4">
            <div className="d-flex align-items-start align-items-sm-center" style={{ gap: '24px' }}>
              {/* Company Logo Box */}
              <div className="job-hero-logo-box position-relative">
                {companyLogo || companyInfo.logo ? (
                  <img
                    src={companyLogo || companyInfo.logo}
                    alt={companyName}
                    className="job-hero-logo-img"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div
                  className="fw-bold text-dark fs-3 align-items-center justify-content-center w-100 h-100"
                  style={{ display: (companyLogo || companyInfo.logo) ? 'none' : 'flex' }}
                >
                  {initial}
                </div>
              </div>

              {/* Title & Metadata Details */}
              <div>
                <h1 className="fw-bold text-dark mb-2" style={{ fontSize: '26px', letterSpacing: '-0.02em', lineHeight: '1.3' }}>
                  {job.title}
                </h1>

                <div className="d-flex flex-wrap align-items-center gap-2 mb-2.5">
                  <Link
                    to={targetCompanyId ? `/companies?id=${targetCompanyId}` : '#'}
                    className="fw-bold text-dark text-decoration-none d-inline-flex align-items-center gap-1.5"
                    style={{ fontSize: '15px' }}
                  >
                    <span>{companyName}</span>
                    <FaCheckCircle className="text-success" size={14} title="Doanh nghiệp xác thực" />
                  </Link>

                  {companyInfo.industry && (
                    <span className="badge bg-white text-secondary border fw-normal" style={{ fontSize: '12px' }}>
                      {companyInfo.industry}
                    </span>
                  )}
                </div>

                {/* Badges Stack */}
                <div className="d-flex flex-wrap align-items-center gap-2.5">
                  <span className="job-salary-chip">
                    <FaMoneyBillWave size={13} />
                    <span>{job.salaryText}</span>
                  </span>

                  <span className="job-meta-chip">
                    <FaMapMarkerAlt size={12} className="text-secondary" />
                    <span>{job.location}</span>
                  </span>

                  <span className="job-meta-chip">
                    <FaBriefcase size={12} className="text-secondary" />
                    <span>{job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType === 'INTERN' ? 'Thực tập' : 'Bán thời gian'}</span>
                  </span>

                  <span className="job-meta-chip">
                    <FaCalendarAlt size={12} className="text-secondary" />
                    <span>Hạn nộp: {job.deadline || '30/11/2026'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs Cluster */}
            <div className="d-flex align-items-center gap-2.5 flex-shrink-0 align-self-stretch align-self-lg-auto justify-content-start justify-content-lg-end">
              <button
                type="button"
                className={`btn job-btn-action ${isSaved ? 'job-btn-action--active' : ''}`}
                onClick={handleToggleSave}
              >
                {isSaved ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
                <span>{isSaved ? 'Đã lưu' : 'Lưu tin'}</span>
              </button>

              <button
                type="button"
                className="btn job-btn-action"
                onClick={handleShare}
                title="Chia sẻ tin tuyển dụng"
              >
                <FaShareAlt size={14} />
                <span>Chia sẻ</span>
              </button>

              <button
                type="button"
                className="btn job-btn-apply"
                onClick={handleApplyClick}
              >
                <FaBriefcase size={14} />
                <span>Ứng tuyển ngay</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT - 2 COLUMN GRID */}
      <div className="container py-4 my-2" style={{ maxWidth: '1240px' }}>
        <div className="row g-4.5 align-items-start" style={{ rowGap: '32px' }}>
          {/* CỘT TRÁI (~68% width): Main JD Content */}
          <div className="col-12 col-lg-8">
            <div className="job-detail-card mb-4">
              {/* Mô tả công việc */}
              <section className="mb-5 pb-4 border-bottom">
                <h2 className="job-section-title">Mô tả công việc</h2>
                <p className="text-secondary" style={{ lineHeight: '1.85', fontSize: '15.5px', color: '#334155', marginBottom: '22px' }}>
                  {job.description || 'Chưa có mô tả chi tiết cho công việc này.'}
                </p>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start gap-2.5 text-secondary" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    <FaCheck className="text-success mt-1 flex-shrink-0" size={13} />
                    <span>Tham gia thiết kế và triển khai kiến trúc hệ thống quy mô lớn, chịu tải cao và đảm bảo tính sẵn sàng.</span>
                  </div>
                  <div className="d-flex align-items-start gap-2.5 text-secondary" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    <FaCheck className="text-success mt-1 flex-shrink-0" size={13} />
                    <span>Phối hợp chặt chẽ cùng đội ngũ Product Owner, Frontend và QA để tối ưu hóa trải nghiệm sản phẩm.</span>
                  </div>
                  <div className="d-flex align-items-start gap-2.5 text-secondary" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    <FaCheck className="text-success mt-1 flex-shrink-0" size={13} />
                    <span>Nghiên cứu và ứng dụng các giải pháp công nghệ mới nhằm nâng cao hiệu suất xử lý dữ liệu.</span>
                  </div>
                </div>
              </section>

              {/* Kỹ năng & Tech Stack */}
              <section className="mb-5 pb-4 border-bottom">
                <h2 className="job-section-title">Kỹ năng chuyên môn &amp; Tech Stack</h2>
                <div className="d-flex flex-wrap gap-2.5">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="job-skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Yêu cầu ứng viên */}
              <section className="mb-5 pb-4 border-bottom">
                <h2 className="job-section-title">Yêu cầu ứng viên</h2>
                <p className="text-secondary" style={{ lineHeight: '1.85', fontSize: '15.5px', color: '#334155', marginBottom: '22px' }}>
                  {job.requirements || 'Trao đổi chi tiết khi phỏng vấn.'}
                </p>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start gap-2.5 text-secondary" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    <FaCheck className="text-success mt-1 flex-shrink-0" size={13} />
                    <span>Tư duy lập trình vững chắc, am hiểu cấu trúc dữ liệu, giải thuật và các Design Patterns phổ biến.</span>
                  </div>
                  <div className="d-flex align-items-start gap-2.5 text-secondary" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    <FaCheck className="text-success mt-1 flex-shrink-0" size={13} />
                    <span>Có tinh thần trách nhiệm cao, chủ động học hỏi công nghệ mới và khả năng giải quyết vấn đề độc lập.</span>
                  </div>
                  <div className="d-flex align-items-start gap-2.5 text-secondary" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    <FaCheck className="text-success mt-1 flex-shrink-0" size={13} />
                    <span>Kỹ năng giao tiếp và làm việc nhóm tốt, đọc hiểu tài liệu kỹ thuật tiếng Anh thành thạo.</span>
                  </div>
                </div>
              </section>

              {/* Quyền lợi được hưởng */}
              <section className="mb-5 pb-4 border-bottom">
                <h2 className="job-section-title">Quyền lợi &amp; Đãi ngộ</h2>
                <p className="text-secondary" style={{ lineHeight: '1.85', fontSize: '15.5px', color: '#334155', marginBottom: '22px' }}>
                  {job.benefits || 'Chế độ bảo hiểm và đãi ngộ theo quy định của công ty.'}
                </p>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start gap-2.5 text-secondary" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    <FaCheck className="text-success mt-1 flex-shrink-0" size={13} />
                    <span>Thu nhập cạnh tranh theo năng lực, thưởng lương tháng 13 và thưởng hiệu suất dự án hấp dẫn.</span>
                  </div>
                  <div className="d-flex align-items-start gap-2.5 text-secondary" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    <FaCheck className="text-success mt-1 flex-shrink-0" size={13} />
                    <span>Gói bảo hiểm sức khỏe toàn diện cao cấp cho nhân viên và chính sách chăm sóc người thân.</span>
                  </div>
                  <div className="d-flex align-items-start gap-2.5 text-secondary" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    <FaCheck className="text-success mt-1 flex-shrink-0" size={13} />
                    <span>Cấp phát laptop cấu hình cao, hỗ trợ 100% kinh phí thi các chứng chỉ quốc tế uy tín.</span>
                  </div>
                </div>
              </section>

              {/* Địa điểm làm việc */}
              <section>
                <h2 className="job-section-title">Địa điểm làm việc cụ thể</h2>
                <p className="text-secondary mb-0 d-flex align-items-center gap-2.5" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                  <FaMapMarkerAlt className="text-danger flex-shrink-0" size={14} />
                  <span>{job.location} ({companyInfo.hq || 'Văn phòng hiện đại, trung tâm thành phố'})</span>
                </p>
              </section>
            </div>
          </div>

          {/* CỘT PHẢI (~32% width): Executive Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column gap-3.5">
              {/* Thẻ Thông tin tuyển dụng */}
              <div className="job-sidebar-card">
                <h3 className="fw-bold mb-3" style={{ fontSize: '17px', color: '#0F172A' }}>
                  Thông tin tuyển dụng
                </h3>

                <div className="d-flex flex-column">
                  <div className="job-sidebar-row">
                    <span style={{ color: '#475569', fontWeight: 500 }}>Hình thức làm việc</span>
                    <strong style={{ color: '#0F172A', fontWeight: 700 }}>
                      {job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType === 'INTERN' ? 'Thực tập' : 'Bán thời gian'}
                    </strong>
                  </div>

                  <div className="job-sidebar-row">
                    <span style={{ color: '#475569', fontWeight: 500 }}>Cấp bậc</span>
                    <strong style={{ color: '#0F172A', fontWeight: 700 }}>
                      {job.position === 'intern'
                        ? 'Thực tập sinh'
                        : job.position === 'senior'
                        ? 'Senior / Chuyên viên chính'
                        : job.position === 'lead'
                        ? 'Trưởng nhóm / Leader'
                        : 'Nhân viên'}
                    </strong>
                  </div>

                  <div className="job-sidebar-row">
                    <span style={{ color: '#475569', fontWeight: 500 }}>Kinh nghiệm</span>
                    <strong style={{ color: '#0F172A', fontWeight: 700 }}>
                      {job.experience === 'none'
                        ? 'Không yêu cầu'
                        : job.experience === '1-year' || job.experience === '1-2'
                        ? '1 - 2 năm'
                        : job.experience === '2-5'
                        ? '2 - 5 năm'
                        : 'Trên 5 năm'}
                    </strong>
                  </div>

                  <div className="job-sidebar-row">
                    <span style={{ color: '#475569', fontWeight: 500 }}>Mức thu nhập</span>
                    <strong className="text-success" style={{ fontWeight: 800 }}>
                      {job.salaryText}
                    </strong>
                  </div>

                  <div className="job-sidebar-row">
                    <span style={{ color: '#475569', fontWeight: 500 }}>Hạn nộp hồ sơ</span>
                    <strong style={{ color: '#0F172A', fontWeight: 700 }}>
                      {job.deadline || '30/11/2026'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Thẻ Về nhà tuyển dụng */}
              <div className="job-sidebar-card">
                <h3 className="fw-bold mb-3" style={{ fontSize: '17px', color: '#0F172A' }}>
                  Về nhà tuyển dụng
                </h3>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="position-relative"
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '4px',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {companyLogo || companyInfo.logo ? (
                      <img
                        src={companyLogo || companyInfo.logo}
                        alt={companyName}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="fw-bold text-dark align-items-center justify-content-center w-100 h-100"
                      style={{ display: (companyLogo || companyInfo.logo) ? 'none' : 'flex' }}
                    >
                      {initial}
                    </div>
                  </div>

                  <div>
                    <h4 className="fw-bold mb-0 text-dark d-inline-flex align-items-center gap-1.5" style={{ fontSize: '16px', lineHeight: '1.3' }}>
                      <span>{companyName}</span>
                      <FaCheckCircle className="text-success flex-shrink-0" size={13} title="Doanh nghiệp xác thực" />
                    </h4>
                    <small className="text-muted fw-semibold">Quy mô: {companyInfo.size || '10.000+ nhân viên'}</small>
                  </div>
                </div>

                <p className="text-secondary small mb-3" style={{ lineHeight: '1.6', fontSize: '13.5px' }}>
                  {companyInfo.tagline ||
                    companyInfo.description?.slice(0, 140) + '...' ||
                    'Doanh nghiệp hàng đầu, tiên phong đổi mới công nghệ và kiến tạo môi trường làm việc chuẩn quốc tế.'}
                </p>

                {companyWebsite && (
                  <div className="mb-3">
                    <a
                      href={companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1"
                      style={{ color: '#EA580C' }}
                    >
                      <FaGlobe size={13} />
                      <span>{companyWebsite.replace('https://', '').replace(/\/$/, '')}</span>
                      <FaExternalLinkAlt size={10} />
                    </a>
                  </div>
                )}

                {targetCompanyId && (
                  <Link
                    to={`/companies?id=${targetCompanyId}`}
                    className="btn btn-outline-dark w-100 rounded-pill fw-bold py-2 d-inline-flex align-items-center justify-content-center gap-2"
                    style={{ fontSize: '13.5px' }}
                  >
                    <span>Khám phá trang công ty</span>
                    <FaArrowRight size={11} />
                  </Link>
                )}
              </div>

              {/* Employer edit actions nếu là Employer */}
              {user?.role === 'EMPLOYER' && (
                <div className="p-3 bg-white border rounded-4 d-flex align-items-center justify-content-between">
                  <span className="small fw-semibold text-secondary">Quản trị tin đăng</span>
                  <div className="d-flex align-items-center gap-2">
                    <Link
                      to={`/employer/edit-job/${job.id}`}
                      className="btn btn-sm btn-outline-primary"
                      title="Chỉnh sửa tin tuyển dụng"
                    >
                      <FaEdit size={13} className="me-1" /> Sửa
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={async () => {
                        if (window.confirm('Bạn có chắc muốn gỡ tin tuyển dụng này?')) {
                          await jobApi.deleteJob(job.id);
                          showToast('success', 'Đã gỡ tin tuyển dụng.');
                          navigate('/employer/jobs');
                        }
                      }}
                      title="Gỡ tin này"
                    >
                      <FaTrash size={13} className="me-1" /> Gỡ
                    </button>
                  </div>
                </div>
              )}

              {/* Discreet report link ở cuối */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none"
                  style={{ fontSize: '12.5px' }}
                  onClick={() => setShowReportModal(true)}
                >
                  <FaFlag className="me-1 opacity-50" size={11} /> Báo cáo tin tuyển dụng vi phạm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hàng việc làm tương tự cùng ngành dàn ngang 3 cột */}
        {similarJobs.length > 0 && (
          <div id="similar-jobs-section" className="mt-5 pt-4 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="text-uppercase fw-bold" style={{ fontSize: '12px', letterSpacing: '0.06em', color: '#64748B' }}>
                  CƠ HỘI NGHỀ NGHIỆP LIÊN QUAN
                </div>
                <h3 className="fw-bold text-dark mb-0" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
                  Việc làm tương tự cùng ngành ({similarJobs.length})
                </h3>
              </div>

              <Link to="/jobs" className="btn btn-link text-decoration-none fw-bold small p-0" style={{ color: '#EA580C' }}>
                Xem tất cả việc làm →
              </Link>
            </div>

            <div className="row g-3 align-items-stretch">
              {similarJobs.map((item) => (
                <div key={item.id} className="col-12 col-md-4">
                  <JobCard job={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ApplyModal
        job={job}
        show={showApplyModal}
        onHide={() => setShowApplyModal(false)}
        onSuccess={() => setHasApplied(true)}
      />

      <ReportModal
        job={job}
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
      />
    </div>
  );
}
