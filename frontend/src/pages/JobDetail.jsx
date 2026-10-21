import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBriefcase,
  FaBuilding,
  FaShareAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaCheck,
  FaBookmark,
  FaRegBookmark,
  FaGlobe,
  FaPaperPlane,
  FaRobot,
  FaArrowRight,
  FaExternalLinkAlt,
  FaUsers,
  FaFlag,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import jobApi from '../api/jobApi.js';
import companyApi from '../api/companyApi.js';
import mockCompanies from '../mock/companies.js';
import JobCard from '../components/job/JobCard.jsx';
import ApplyModal from '../components/job/ApplyModal.jsx';
import ReportModal from '../components/job/ReportModal.jsx';
import { showToast } from '../components/common/ToastHost.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/job-detail.css';

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

const formatBulletPoints = (text) => {
  if (!text) return [];
  return text
    .split(/\n|•|✔|\r/)
    .map((s) => s.trim().replace(/^[•✔\-\*]\s*/, ''))
    .filter((s) => s.length > 5);
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
  const [isCompanyFollowed, setIsCompanyFollowed] = useState(false);

  useEffect(() => {
    if (job) {
      const rawName = job.company?.name || job.companyName || '';
      const comp = mockCompanies.find(
        (c) =>
          c.name === rawName ||
          (c.shortName && rawName.toLowerCase().includes(c.shortName.toLowerCase()))
      );
      const cId = job.company?.id || comp?.id;
      if (cId) {
        setIsCompanyFollowed(companyApi.isFollowed(cId));
      }
    }
  }, [job]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    window.scrollTo(0, 0);

    jobApi
      .getJobDetail(id)
      .then((data) => {
        setJob(data);
        const localSaved = (JSON.parse(localStorage.getItem('jn_local_saved_jobs') || '[]')).includes(String(id));
        setIsSaved(!!data.saved || localSaved);
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

  useEffect(() => {
    const handleSync = (e) => {
      if (e?.detail?.id === String(id)) {
        setIsSaved(!!e.detail.saved);
      }
    };
    window.addEventListener('saved-jobs-updated', handleSync);
    return () => window.removeEventListener('saved-jobs-updated', handleSync);
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
        window.dispatchEvent(new CustomEvent('open-saved-jobs', { detail: { tab: 'jobs' } }));
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

  // 1. Shimmer Skeleton Loader (Thay thế spinner đơn độc, loại bỏ Cumulative Layout Shift)
  if (loading) {
    return (
      <div className="job-detail-page">
        <section className="job-hero-section job-skeleton-wrap">
          <div className="container" style={{ maxWidth: '1240px' }}>
            <div className="job-skeleton-box mb-4" style={{ width: '280px', height: '16px' }} />
            <div className="d-flex align-items-center gap-4">
              <div className="job-skeleton-box flex-shrink-0" style={{ width: '88px', height: '88px', borderRadius: '18px' }} />
              <div className="flex-grow-1">
                <div className="job-skeleton-box mb-2" style={{ width: '60%', height: '32px' }} />
                <div className="job-skeleton-box mb-3" style={{ width: '40%', height: '18px' }} />
                <div className="d-flex gap-2">
                  <div className="job-skeleton-box" style={{ width: '120px', height: '28px', borderRadius: '99px' }} />
                  <div className="job-skeleton-box" style={{ width: '140px', height: '28px', borderRadius: '99px' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-4 my-2" style={{ maxWidth: '1240px' }}>
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="job-content-card job-skeleton-wrap p-4">
                <div className="job-skeleton-box mb-4" style={{ width: '200px', height: '24px' }} />
                <div className="job-skeleton-box mb-2" style={{ width: '100%', height: '16px' }} />
                <div className="job-skeleton-box mb-2" style={{ width: '90%', height: '16px' }} />
                <div className="job-skeleton-box mb-4" style={{ width: '75%', height: '16px' }} />
                <div className="job-skeleton-box mb-4" style={{ width: '200px', height: '24px' }} />
                <div className="job-skeleton-box mb-2" style={{ width: '100%', height: '16px' }} />
                <div className="job-skeleton-box mb-2" style={{ width: '85%', height: '16px' }} />
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="job-sidebar-card job-skeleton-wrap p-4">
                <div className="job-skeleton-box mb-3" style={{ width: '180px', height: '20px' }} />
                <div className="job-skeleton-box mb-2" style={{ width: '100%', height: '36px' }} />
                <div className="job-skeleton-box mb-2" style={{ width: '100%', height: '36px' }} />
                <div className="job-skeleton-box" style={{ width: '100%', height: '36px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-page py-5">
        <div className="container py-5 text-center">
          <div className="job-content-card mx-auto p-5" style={{ maxWidth: '600px' }}>
            <h2 className="fw-bold mb-3 text-dark fs-3">Không tìm thấy công việc này</h2>
            <p className="text-secondary mb-4">Tin tuyển dụng có thể đã hết hạn hoặc tạm dừng nhận hồ sơ.</p>
            <button type="button" onClick={handleBack} className="btn-job-apply-cta mx-auto">
              <FaArrowLeft size={13} />
              <span>Quay lại danh sách việc làm</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rawCompanyName = job.company?.name || job.companyName || 'Doanh nghiệp uy tín';
  const companyName = rawCompanyName
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
    .replace('Fpt', 'FPT')
    .replace('Mb', 'MB')
    .replace('Vib', 'VIB')
    .replace('Misa', 'MISA')
    .replace('Viettel', 'Viettel')
    .replace('Vinamilk', 'Vinamilk')
    .replace('Ssi', 'SSI')
    .replace('A.i', 'A.I')
    .replace('Sme', 'SME');

  const companyLogo = job.company?.logoUrl || job.logoUrl;
  const initial = companyName.charAt(0).toUpperCase();

  const companyInfo = mockCompanies.find(
    (c) =>
      c.name === rawCompanyName ||
      (c.shortName && rawCompanyName.toLowerCase().includes(c.shortName.toLowerCase())) ||
      (c.slug && (job.company?.slug === c.slug || job.company?.name?.toLowerCase().includes(c.slug)))
  ) || {};

  const targetCompanyId = job.company?.id || companyInfo.id;

  const handleToggleFollowCompany = () => {
    if (!targetCompanyId) return;
    const nextState = companyApi.toggleFollow(targetCompanyId);
    setIsCompanyFollowed(nextState);
    if (nextState) {
      showToast('success', `Đã lưu và theo dõi tin tuyển dụng của ${companyName}!`);
      window.dispatchEvent(new CustomEvent('open-saved-jobs', { detail: { tab: 'companies' } }));
    } else {
      showToast('info', `Đã bỏ quan tâm ${companyName}.`);
    }
  };
  const companyWebsite =
    companyInfo.website ||
    (rawCompanyName.toLowerCase().includes('fpt') ? 'https://fpt.com.vn' :
     rawCompanyName.toLowerCase().includes('viettel') ? 'https://viettel.com.vn' :
     rawCompanyName.toLowerCase().includes('mb') ? 'https://mbbank.com.vn' :
     rawCompanyName.toLowerCase().includes('vinamilk') ? 'https://vinamilk.com.vn' :
     rawCompanyName.toLowerCase().includes('misa') ? 'https://misa.vn' :
     rawCompanyName.toLowerCase().includes('vib') ? 'https://vib.com.vn' :
     null);

  const skillsList = getTechSkills(job, companyInfo.industry);

  const formatDeadline = (dl) => {
    if (!dl) return '31/12/2026';
    if (dl.includes('-')) {
      const parts = dl.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dl;
  };

  const descBullets = formatBulletPoints(job.description);
  const reqBullets = formatBulletPoints(job.requirements);
  const benBullets = formatBulletPoints(job.benefits);

  return (
    <div className="job-detail-page">
      {/* 1. HERO BANNER - CHỈN CHU, SÁNG RÕ, PHONG CÁCH EXECUTIVE */}
      <section className="job-hero-section">
        <div className="container" style={{ maxWidth: '1240px' }}>
          {/* Breadcrumbs Navigation */}
          <div className="job-breadcrumbs">
            <Link to="/">Trang chủ</Link>
            <span className="job-breadcrumbs-sep">/</span>
            <Link to="/jobs">Việc làm</Link>
            <span className="job-breadcrumbs-sep">/</span>
            <Link to={`/jobs/search?category=${encodeURIComponent(job.category?.slug || 'cntt')}`}>
              {job.category?.name || 'Công nghệ thông tin'}
            </Link>
            <span className="job-breadcrumbs-sep">/</span>
            <span className="text-dark fw-bold text-truncate" style={{ maxWidth: '300px' }}>
              {job.title}
            </span>
          </div>

          <div className="row align-items-center g-4">
            {/* Cột trái: Logo, Tiêu đề, Công ty, Huy hiệu */}
            <div className="col-12 col-lg-8">
              <div className="d-flex align-items-start" style={{ gap: '32px' }}>
                {/* Logo công ty trong khung squircle trang nhã */}
                <div className="job-company-logo-frame">
                  {companyLogo || companyInfo.logo ? (
                    <img
                      src={companyLogo || companyInfo.logo}
                      alt={companyName}
                      className="job-company-logo-img"
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
                    style={{ display: companyLogo || companyInfo.logo ? 'none' : 'flex' }}
                  >
                    {initial}
                  </div>
                </div>

                <div className="flex-grow-1">
                  <h1 className="job-main-title">{job.title}</h1>

                  <div className="job-company-row">
                    <Link
                      to={targetCompanyId ? `/companies?id=${targetCompanyId}` : '#'}
                      className="job-company-name-link"
                    >
                      <span>{companyName}</span>
                      <FaCheckCircle className="text-success" size={14} title="Doanh nghiệp xác thực pháp nhân" />
                    </Link>

                    <span className="job-sep-dot">•</span>
                    <span className="job-company-subtext">{companyInfo.industry || 'Công nghệ phần mềm'}</span>

                    {companyWebsite && (
                      <>
                        <span className="job-sep-dot">•</span>
                        <a
                          href={companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="job-company-website-link"
                        >
                          Website <FaExternalLinkAlt size={10} />
                        </a>
                      </>
                    )}
                  </div>

                  {/* Dải badge thông số việc làm */}
                  <div className="job-meta-row">
                    <span className="job-badge-salary">
                      <FaMoneyBillWave size={13} />
                      <span>{job.salaryText}</span>
                    </span>

                    <span className="job-badge-pill">
                      <FaMapMarkerAlt size={12} className="text-muted" />
                      <span>{job.location}</span>
                    </span>

                    <span className="job-badge-pill">
                      <FaBriefcase size={12} className="text-muted" />
                      <span>
                        {job.jobType === 'FULL_TIME'
                          ? 'Toàn thời gian'
                          : job.jobType === 'INTERN'
                          ? 'Thực tập'
                          : 'Bán thời gian'}
                      </span>
                    </span>

                    <span className="job-badge-pill">
                      <FaCalendarAlt size={12} className="text-muted" />
                      <span>Hạn nộp: {formatDeadline(job.deadline)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Các nút hành động chính */}
            <div className="col-12 col-lg-4 text-lg-end">
              <div className="job-actions-cluster justify-content-lg-end">
                <button
                  type="button"
                  className={`btn-job-outline-tool ${isSaved ? 'btn-job-outline-tool--active' : ''}`}
                  onClick={handleToggleSave}
                >
                  {isSaved ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
                  <span>{isSaved ? 'Đã lưu' : 'Lưu tin'}</span>
                </button>

                <button
                  type="button"
                  className="btn-job-outline-tool"
                  onClick={handleShare}
                  title="Chia sẻ tin tuyển dụng"
                >
                  <FaShareAlt size={14} />
                  <span>Chia sẻ</span>
                </button>

                <button
                  type="button"
                  className="btn-job-apply-cta"
                  onClick={handleApplyClick}
                >
                  <span>{hasApplied ? 'Đã nộp đơn' : 'Ứng tuyển ngay'}</span>
                  <FaPaperPlane size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT - 2 COLUMN GRID */}
      <div className="container py-4 my-2" style={{ maxWidth: '1240px' }}>
        <div className="row g-4 align-items-start">
          {/* CỘT TRÁI (~68% width): Main JD Content */}
          <div className="col-12 col-lg-8">
            <div className="job-content-card">
              {/* Mô tả công việc */}
              <section className="job-section-block">
                <h2 className="job-block-heading">
                  <span className="job-block-heading-bar" />
                  Mô tả công việc
                </h2>
                <p className="job-paragraph-text">
                  {job.description || 'Chưa có mô tả chi tiết cho công việc này.'}
                </p>

                {descBullets.length > 0 ? (
                  <div className="job-bullet-list">
                    {descBullets.map((bullet, idx) => (
                      <div key={idx} className="job-bullet-item">
                        <span className="job-check-badge">
                          <FaCheck size={10} />
                        </span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="job-bullet-list">
                    <div className="job-bullet-item">
                      <span className="job-check-badge"><FaCheck size={10} /></span>
                      <span>Tham gia thiết kế và triển khai kiến trúc hệ thống quy mô lớn, đảm bảo tính sẵn sàng cao.</span>
                    </div>
                    <div className="job-bullet-item">
                      <span className="job-check-badge"><FaCheck size={10} /></span>
                      <span>Phối hợp chặt chẽ cùng đội ngũ Product Owner, Frontend và QA để tối ưu hóa trải nghiệm sản phẩm.</span>
                    </div>
                    <div className="job-bullet-item">
                      <span className="job-check-badge"><FaCheck size={10} /></span>
                      <span>Nghiên cứu và ứng dụng các giải pháp công nghệ mới nhằm nâng cao hiệu suất xử lý dữ liệu.</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Kỹ năng chuyên môn & Tech Stack */}
              <section className="job-section-block">
                <h2 className="job-block-heading">
                  <span className="job-block-heading-bar" />
                  Kỹ năng chuyên môn &amp; Tech Stack
                </h2>
                <div className="d-flex flex-wrap gap-2">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="job-tech-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Yêu cầu ứng viên */}
              <section className="job-section-block">
                <h2 className="job-block-heading">
                  <span className="job-block-heading-bar" />
                  Yêu cầu ứng viên
                </h2>
                <p className="job-paragraph-text">
                  {job.requirements || 'Trao đổi chi tiết khi phỏng vấn.'}
                </p>

                {reqBullets.length > 0 ? (
                  <div className="job-bullet-list">
                    {reqBullets.map((bullet, idx) => (
                      <div key={idx} className="job-bullet-item">
                        <span className="job-check-badge">
                          <FaCheck size={10} />
                        </span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="job-bullet-list">
                    <div className="job-bullet-item">
                      <span className="job-check-badge"><FaCheck size={10} /></span>
                      <span>Tư duy lập trình vững chắc, am hiểu cấu trúc dữ liệu, giải thuật và các Design Patterns phổ biến.</span>
                    </div>
                    <div className="job-bullet-item">
                      <span className="job-check-badge"><FaCheck size={10} /></span>
                      <span>Có tinh thần trách nhiệm cao, chủ động học hỏi công nghệ mới và khả năng giải quyết vấn đề độc lập.</span>
                    </div>
                    <div className="job-bullet-item">
                      <span className="job-check-badge"><FaCheck size={10} /></span>
                      <span>Kỹ năng giao tiếp và làm việc nhóm tốt, đọc hiểu tài liệu kỹ thuật tiếng Anh thành thạo.</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Quyền lợi & Đãi ngộ */}
              <section className="job-section-block">
                <h2 className="job-block-heading">
                  <span className="job-block-heading-bar" />
                  Quyền lợi &amp; Đãi ngộ
                </h2>
                <p className="job-paragraph-text">
                  {job.benefits || 'Chế độ bảo hiểm và đãi ngộ theo quy định của công ty.'}
                </p>

                {benBullets.length > 0 ? (
                  <div className="job-bullet-list">
                    {benBullets.map((bullet, idx) => (
                      <div key={idx} className="job-bullet-item">
                        <span className="job-check-badge">
                          <FaCheck size={10} />
                        </span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="job-bullet-list">
                    <div className="job-bullet-item">
                      <span className="job-check-badge"><FaCheck size={10} /></span>
                      <span>Thu nhập cạnh tranh theo năng lực, thưởng lương tháng 13 và thưởng hiệu suất dự án hấp dẫn.</span>
                    </div>
                    <div className="job-bullet-item">
                      <span className="job-check-badge"><FaCheck size={10} /></span>
                      <span>Gói bảo hiểm sức khỏe toàn diện cao cấp cho nhân viên và chính sách chăm sóc người thân.</span>
                    </div>
                    <div className="job-bullet-item">
                      <span className="job-check-badge"><FaCheck size={10} /></span>
                      <span>Cấp phát laptop cấu hình cao, hỗ trợ 100% kinh phí thi các chứng chỉ quốc tế uy tín.</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Địa điểm làm việc */}
              <section className="job-section-block">
                <h2 className="job-block-heading">
                  <span className="job-block-heading-bar" />
                  Địa điểm làm việc cụ thể
                </h2>
                <div className="d-flex align-items-center gap-2 text-secondary" style={{ fontSize: '15px' }}>
                  <FaMapMarkerAlt className="text-danger flex-shrink-0" size={15} />
                  <span>
                    <strong>{job.location}</strong> ({companyInfo.hq || 'Văn phòng hiện đại, trung tâm công nghệ'})
                  </span>
                </div>
              </section>
            </div>
          </div>

          {/* CỘT PHẢI (~32% width): Executive Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column gap-4">
              {/* Card 1: Thông tin tuyển dụng tổng quan */}
              <div className="job-sidebar-card">
                <h3 className="job-sidebar-card-title">Thông tin chung</h3>

                <div className="d-flex flex-column">
                  <div className="job-sidebar-spec-row">
                    <span className="job-sidebar-spec-label">Hình thức làm việc</span>
                    <span className="job-sidebar-spec-value">
                      {job.jobType === 'FULL_TIME'
                        ? 'Toàn thời gian'
                        : job.jobType === 'INTERN'
                        ? 'Thực tập'
                        : 'Bán thời gian'}
                    </span>
                  </div>

                  <div className="job-sidebar-spec-row">
                    <span className="job-sidebar-spec-label">Cấp bậc</span>
                    <span className="job-sidebar-spec-value">
                      {job.position === 'intern'
                        ? 'Thực tập sinh'
                        : job.position === 'senior'
                        ? 'Senior / Chuyên viên chính'
                        : job.position === 'lead'
                        ? 'Trưởng nhóm / Leader'
                        : 'Nhân viên'}
                    </span>
                  </div>

                  <div className="job-sidebar-spec-row">
                    <span className="job-sidebar-spec-label">Kinh nghiệm</span>
                    <span className="job-sidebar-spec-value">
                      {job.experience === 'none'
                        ? 'Không yêu cầu'
                        : job.experience === '1-year' || job.experience === '1-2'
                        ? '1 - 2 năm'
                        : job.experience === '2-5'
                        ? '2 - 5 năm'
                        : 'Trên 5 năm'}
                    </span>
                  </div>

                  <div className="job-sidebar-spec-row">
                    <span className="job-sidebar-spec-label">Mức thu nhập</span>
                    <span className="job-sidebar-spec-value text-success">
                      {job.salaryText}
                    </span>
                  </div>

                  <div className="job-sidebar-spec-row">
                    <span className="job-sidebar-spec-label">Hạn nộp hồ sơ</span>
                    <span className="job-sidebar-spec-value">
                      {formatDeadline(job.deadline)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Về doanh nghiệp tuyển dụng */}
              <div className="job-sidebar-card">
                <h3 className="job-sidebar-card-title">Về doanh nghiệp</h3>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="position-relative flex-shrink-0"
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
                    }}
                  >
                    {companyLogo || companyInfo.logo ? (
                      <img
                        src={companyLogo || companyInfo.logo}
                        alt={companyName}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <span className="fw-bold fs-5 text-dark">{initial}</span>
                    )}
                  </div>

                  <div>
                    <h4 className="fw-bold mb-1 text-dark fs-6">{companyName}</h4>
                    <span className="text-secondary small">{companyInfo.industry || 'Doanh nghiệp công nghệ'}</span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2.5 mb-3 text-secondary small" style={{ lineHeight: '1.6' }}>
                  {companyInfo.size && (
                    <div className="d-flex align-items-center gap-2">
                      <FaUsers size={13} className="text-muted flex-shrink-0" />
                      <span>Quy mô: <strong>{companyInfo.size}</strong></span>
                    </div>
                  )}
                  {companyInfo.hq && (
                    <div className="d-flex align-items-center gap-2">
                      <FaBuilding size={13} className="text-muted flex-shrink-0" />
                      <span>Trụ sở: {companyInfo.hq}</span>
                    </div>
                  )}
                </div>

                {targetCompanyId && (
                  <div className="d-flex flex-column gap-2 mt-3">
                    <button
                      type="button"
                      className={`btn btn-sm w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 ${
                        isCompanyFollowed
                          ? 'btn-warning text-dark border-0'
                          : 'btn-outline-warning text-dark'
                      }`}
                      onClick={handleToggleFollowCompany}
                      title={isCompanyFollowed ? 'Bỏ quan tâm công ty' : 'Quan tâm công ty này'}
                    >
                      {isCompanyFollowed ? <FaBookmark size={12} /> : <FaRegBookmark size={12} />}
                      <span>{isCompanyFollowed ? 'Đã quan tâm công ty' : 'Quan tâm công ty'}</span>
                    </button>

                    <Link
                      to={`/companies?id=${targetCompanyId}`}
                      className="btn btn-outline-dark btn-sm w-100 fw-bold py-2 rounded-3 text-decoration-none d-flex align-items-center justify-content-center gap-2"
                    >
                      <span>Khám phá trang công ty</span>
                      <FaArrowRight size={11} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Card 3: Trợ lý AI đo độ khớp CV */}
              <div className="job-ai-card">
                <div className="job-ai-card-title">
                  <FaRobot size={18} />
                  <span>AI MatchScore Assistant</span>
                </div>
                <p className="job-ai-card-desc">
                  Kiểm tra độ tương thích của CV bạn với vị trí này trước khi nộp đơn để tăng 3x cơ hội được gọi phỏng vấn.
                </p>
                <button
                  type="button"
                  className="btn-job-ai-action"
                  onClick={handleApplyClick}
                >
                  <span>Phân tích CV ngay</span>
                  <FaArrowRight size={12} />
                </button>
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

              {/* Báo cáo tin vi phạm */}
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

        {/* 3. SIMILAR JOBS WIDGET */}
        {similarJobs.length > 0 && (
          <div className="mt-5 pt-4 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="text-uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#B45309' }}>
                  CƠ HỘI NGHỀ NGHIỆP TƯƠNG ĐỒNG
                </div>
                <h3 className="fw-bold text-dark mb-0 fs-5">
                  Việc làm tương tự cùng ngành ({similarJobs.length})
                </h3>
              </div>

              <Link to="/jobs" className="btn btn-link text-decoration-none fw-bold small p-0" style={{ color: '#0F172A' }}>
                Xem tất cả việc làm →
              </Link>
            </div>

            <div className="row g-3">
              {similarJobs.map((simJob) => (
                <div key={simJob.id} className="col-12 col-md-4">
                  <JobCard job={simJob} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          show={showApplyModal}
          job={job}
          onHide={() => setShowApplyModal(false)}
          onSuccess={() => setHasApplied(true)}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          show={showReportModal}
          jobId={job.id}
          jobTitle={job.title}
          onHide={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
