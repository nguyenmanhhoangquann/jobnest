import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
} from 'react-icons/fa';
import jobApi from '../api/jobApi.js';
import SaveButton from '../components/job/SaveButton.jsx';
import JobCard from '../components/job/JobCard.jsx';
import ApplyModal from '../components/job/ApplyModal.jsx';
import { Spinner } from '../components/common/Loading.jsx';
import { showToast } from '../components/common/ToastHost.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    jobApi
      .getJobDetail(id)
      .then((data) => {
        setJob(data);
        setLoading(false);
        // Tải thêm 3 công việc tương tự cùng ngành
        jobApi
          .getJobs({ category: data.category, size: 3 })
          .then((res) => {
            const others = (res.content || []).filter((j) => j.id !== data.id);
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

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('success', 'Đã sao chép liên kết công việc vào khay nhớ tạm!');
  };

  if (loading) {
    return (
      <div className="container-app py-5 text-center">
        <Spinner size="lg" className="my-5" />
        <p className="text-muted">Đang tải thông tin chi tiết việc làm...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container-app py-5 text-center">
        <h2 className="fw-bold mb-3">Không tìm thấy công việc này</h2>
        <p className="text-muted mb-4">Tin tuyển dụng có thể đã hết hạn hoặc bị gỡ bỏ.</p>
        <Link to="/jobs" className="btn btn-brand">
          <FaArrowLeft className="me-2" /> Quay lại danh sách việc làm
        </Link>
      </div>
    );
  }

  const initial = job.companyName ? job.companyName.charAt(0).toUpperCase() : 'J';

  return (
    <div className="job-detail-page py-4">
      <div className="container-app">
        {/* Nút quay lại */}
        <div className="mb-3">
          <Link to="/jobs" className="text-muted text-decoration-none small">
            <FaArrowLeft className="me-1" /> Quay lại tìm việc
          </Link>
        </div>

        {/* Khối Header Việc làm */}
        <div className="job-detail-header p-4 mb-4">
          <div className="row align-items-center g-3">
            <div className="col-auto">
              <div className="job-detail-logo">
                {job.logoUrl ? (
                  <img src={job.logoUrl} alt={job.companyName} />
                ) : (
                  <div className="job-detail-logo-fallback">{initial}</div>
                )}
              </div>
            </div>

            <div className="col">
              <h1 className="job-detail-title mb-2">{job.title}</h1>
              <p className="job-detail-company mb-2">
                <FaBuilding className="me-1 text-muted" /> {job.companyName}
              </p>
              <div className="d-flex flex-wrap gap-3 text-muted small">
                <span>
                  <FaMoneyBillWave className="me-1 text-warning" />{' '}
                  <strong className="text-dark">{job.salaryText}</strong>
                </span>
                <span>
                  <FaMapMarkerAlt className="me-1" /> {job.location}
                </span>
                <span>
                  <FaCalendarAlt className="me-1" /> Hạn nộp: {job.deadline || '30/10/2026'}
                </span>
              </div>
            </div>

            <div className="col-12 col-md-auto d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-brand px-4 py-2 fw-semibold"
                onClick={handleApplyClick}
              >
                Ứng tuyển ngay
              </button>
              <SaveButton jobId={job.id} initialSaved={job.saved} />
              <button
                type="button"
                className="btn btn-outline-secondary p-2"
                onClick={handleShare}
                aria-label="Chia sẻ công việc"
                title="Sao chép link chia sẻ"
              >
                <FaShareAlt size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Thân chi tiết: 2 cột */}
        <div className="row g-4">
          {/* Cột trái (70%): Chi tiết công việc */}
          <div className="col-lg-8">
            <div className="job-detail-body p-4 mb-4">
              {/* Mô tả công việc */}
              <section className="mb-4">
                <h2 className="job-detail-section-title">Mô tả công việc</h2>
                {/* Dùng pre-line chống XSS (Mục 10.3) */}
                <div className="job-detail-text">
                  {job.description || 'Chưa có mô tả chi tiết cho công việc này.'}
                </div>
              </section>

              {/* Yêu cầu ứng viên */}
              <section className="mb-4">
                <h2 className="job-detail-section-title">Yêu cầu ứng viên</h2>
                <div className="job-detail-text">
                  {job.requirements || 'Trao đổi chi tiết khi phỏng vấn.'}
                </div>
              </section>

              {/* Quyền lợi */}
              <section className="mb-4">
                <h2 className="job-detail-section-title">Quyền lợi được hưởng</h2>
                <div className="job-detail-text">
                  {job.benefits || 'Chế độ bảo hiểm và đãi ngộ theo quy định của công ty.'}
                </div>
              </section>

              {/* Địa điểm làm việc */}
              <section>
                <h2 className="job-detail-section-title">Địa điểm làm việc</h2>
                <p className="text-muted mb-0">
                  <FaMapMarkerAlt className="me-2 text-danger" />
                  {job.location}
                </p>
              </section>
            </div>

            {/* Việc làm liên quan */}
            {similarJobs.length > 0 && (
              <div className="similar-jobs-section mt-4">
                <h3 className="section-title fs-5 mb-3">Việc làm tương tự cùng ngành</h3>
                <div className="d-flex flex-column gap-3">
                  {similarJobs.map((item) => (
                    <JobCard key={item.id} job={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cột phải (30%): Tóm tắt & Công ty */}
          <div className="col-lg-4">
            {/* Box Thông tin chung */}
            <div className="sidebar-card p-4 mb-4">
              <h3 className="sidebar-card__title mb-3">Thông tin chung</h3>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-3 small">
                <li className="d-flex align-items-center gap-2">
                  <FaBriefcase className="text-muted" size={16} />
                  <div>
                    <div className="text-muted">Hình thức làm việc</div>
                    <strong className="text-dark">
                      {job.jobType === 'FULL_TIME'
                        ? 'Toàn thời gian'
                        : job.jobType === 'PART_TIME'
                        ? 'Bán thời gian'
                        : 'Thực tập'}
                    </strong>
                  </div>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FaUserTie className="text-muted" size={16} />
                  <div>
                    <div className="text-muted">Cấp bậc</div>
                    <strong className="text-dark">
                      {job.position === 'intern'
                        ? 'Thực tập sinh'
                        : job.position === 'lead'
                        ? 'Trưởng nhóm / Quản lý'
                        : 'Nhân viên'}
                    </strong>
                  </div>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FaMoneyBillWave className="text-muted" size={16} />
                  <div>
                    <div className="text-muted">Mức thu nhập</div>
                    <strong className="text-dark">{job.salaryText}</strong>
                  </div>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FaCalendarAlt className="text-muted" size={16} />
                  <div>
                    <div className="text-muted">Kinh nghiệm yêu cầu</div>
                    <strong className="text-dark">
                      {job.experience === 'none'
                        ? 'Không yêu cầu'
                        : job.experience === '1-year'
                        ? '1 năm'
                        : job.experience === '2-years'
                        ? '2 năm'
                        : job.experience === '3-years'
                        ? '3 năm'
                        : 'Trên 5 năm'}
                    </strong>
                  </div>
                </li>
              </ul>
            </div>

            {/* Box Công ty */}
            <div className="sidebar-card p-4">
              <h3 className="sidebar-card__title mb-3">Về công ty</h3>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="job-detail-logo-sm">
                  {job.logoUrl ? (
                    <img src={job.logoUrl} alt={job.companyName} />
                  ) : (
                    <div className="job-detail-logo-fallback-sm">{initial}</div>
                  )}
                </div>
                <div>
                  <h4 className="fs-6 fw-bold mb-0">{job.companyName}</h4>
                  <small className="text-muted">Quy mô: 50 - 200 nhân viên</small>
                </div>
              </div>
              <p className="small text-muted mb-3">
                Doanh nghiệp uy tín hoạt động chuyên sâu trong lĩnh vực, môi trường làm việc năng động, chuyên nghiệp.
              </p>
              <div className="d-flex align-items-center gap-2 text-success small">
                <FaCheckCircle /> Đã xác thực giấy phép kinh doanh
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplyModal
        job={job}
        show={showApplyModal}
        onHide={() => setShowApplyModal(false)}
        onSuccess={() => setHasApplied(true)}
      />
    </div>
  );
}
