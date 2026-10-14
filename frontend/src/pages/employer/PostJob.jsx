import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaMagic, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import jobApi from '../../api/jobApi.js';
import aiApi from '../../api/aiApi.js';
import { showToast } from '../../components/common/ToastHost.jsx';
import { Spinner } from '../../components/common/Loading.jsx';

export default function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [submitting, setSubmitting] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [loadingJob, setLoadingJob] = useState(isEdit);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      category: 'cntt',
      location: 'Hà Nội',
      salaryText: '15 - 25 triệu',
      position: 'staff',
      jobType: 'FULL_TIME',
      experience: '1-year',
      deadline: '2026-12-31',
      description: '',
      requirements: '',
      benefits: '',
    },
  });

  useEffect(() => {
    if (id) {
      setLoadingJob(true);
      jobApi
        .getJobDetail(id)
        .then((job) => {
          let expVal = job.experience || '1-year';
          if (expVal === '1-2') expVal = '1-year';
          if (expVal === '2-5') expVal = '2-years';
          if (expVal === 'gt5') expVal = '5-plus';
          if (expVal === 'lt1' || expVal === 'none') expVal = 'none';

          reset({
            title: job.title || '',
            category: job.category?.slug || (typeof job.category === 'string' ? job.category : 'cntt'),
            location: job.location || '',
            salaryText: job.salaryText || '',
            position: job.position || 'staff',
            jobType: job.jobType || 'FULL_TIME',
            experience: expVal,
            deadline: job.deadline ? String(job.deadline).split('T')[0] : '2026-12-31',
            description: job.description || '',
            requirements: job.requirements || '',
            benefits: job.benefits || '',
          });
        })
        .catch(() => {
          showToast('error', 'Không tìm thấy tin tuyển dụng cần sửa.');
          navigate('/employer/jobs');
        })
        .finally(() => {
          setLoadingJob(false);
        });
    }
  }, [id, reset, navigate]);

  const jobTitle = watch('title');

  // Tính năng AI tự động sinh JD (Mục 14.3 & 14.4 PDF)
  const handleGenerateAiJd = async () => {
    let titleVal = watch('title');
    if (!titleVal || !titleVal.trim()) {
      const inputEl = document.querySelector('input[placeholder*="Senior Frontend"]');
      if (inputEl && inputEl.value) {
        titleVal = inputEl.value;
        setValue('title', titleVal);
      }
    }

    if (!titleVal || !titleVal.trim()) {
      showToast('info', 'Vui lòng nhập Tiêu đề công việc trước khi tạo bằng AI!');
      return;
    }

    setGeneratingAi(true);
    try {
      const generated = await aiApi.generateJd({ title: titleVal });
      setValue('description', generated.description, { shouldDirty: true, shouldValidate: true });
      setValue('requirements', generated.requirements, { shouldDirty: true, shouldValidate: true });
      setValue('benefits', generated.benefits, { shouldDirty: true, shouldValidate: true });
      showToast('success', 'AI đã tạo thành công bản mô tả công việc hoàn chỉnh!');
    } catch (err) {
      showToast('error', 'Không thể tạo nội dung từ AI lúc này.');
    } finally {
      setGeneratingAi(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await jobApi.updateJob(id, data);
        showToast('success', 'Cập nhật tin tuyển dụng thành công!');
        navigate('/employer/jobs');
      } else {
        const newJob = await jobApi.createJob(data);
        showToast('success', 'Đăng tin tuyển dụng thành công!');
        navigate('/employer/jobs');
      }
    } catch (err) {
      showToast('error', err.message || 'Lỗi khi lưu tin tuyển dụng.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-job-page">
      <div className="mb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-link p-0 text-muted text-decoration-none small d-inline-flex align-items-center"
        >
          <FaArrowLeft className="me-1" /> Quay lại trang trước
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fs-4 fw-bold mb-1">
            {isEdit ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
          </h1>
          <p className="text-muted small mb-0">
            {isEdit ? 'Cập nhật thông tin bài đăng tuyển dụng trên hệ thống' : 'Tiếp cận hàng nghìn ứng viên tiềm năng trên hệ thống JobNest'}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-warning text-dark fw-semibold d-inline-flex align-items-center gap-2"
          onClick={handleGenerateAiJd}
          disabled={generatingAi}
        >
          {generatingAi ? <Spinner size="sm" /> : <FaMagic className="text-warning" />}
          <span>Gợi ý JD nhanh bằng AI</span>
        </button>
      </div>

      {loadingJob ? (
        <div className="text-center py-5 card border shadow-sm bg-white">
          <Spinner size="lg" className="my-4 text-warning" />
          <p className="text-muted">Đang tải thông tin tin tuyển dụng...</p>
        </div>
      ) : (
        <div className="card border shadow-sm p-4 bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
          {/* Hàng 1: Tiêu đề & Ngành nghề */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-8">
              <label className="form-label small fw-semibold">Tiêu đề công việc *</label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                placeholder="Ví dụ: Senior Frontend Developer (ReactJS)"
                {...register('title', { required: 'Vui lòng nhập tiêu đề bài đăng' })}
              />
              {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">Ngành nghề *</label>
              <select className="form-select" {...register('category')}>
                <option value="cntt">Công nghệ thông tin</option>
                <option value="marketing">Marketing / Truyền thông</option>
                <option value="kinh-doanh">Kinh doanh / Bán hàng</option>
                <option value="thiet-ke">Thiết kế / Đồ họa</option>
                <option value="ke-toan">Kế toán / Kiểm toán</option>
                <option value="nhan-su">Nhân sự / Hành chính</option>
                <option value="tai-chinh">Tài chính / Ngân hàng</option>
                <option value="devops">DevOps / Hệ thống</option>
              </select>
            </div>
          </div>

          {/* Hàng 2: Mức lương & Địa điểm & Hạn nộp */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">Mức lương hiển thị *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: 15 - 25 triệu hoặc Thỏa thuận"
                {...register('salaryText', { required: true })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">Địa điểm làm việc *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: Cầu Giấy, Hà Nội"
                {...register('location', { required: true })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">Hạn nộp hồ sơ *</label>
              <input type="date" className="form-control" {...register('deadline')} />
            </div>
          </div>

          {/* Hàng 3: Cấp bậc, Hình thức & Kinh nghiệm */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">Cấp bậc</label>
              <select className="form-select" {...register('position')}>
                <option value="staff">Nhân viên</option>
                <option value="specialist">Chuyên viên</option>
                <option value="lead">Trưởng nhóm / Quản lý</option>
                <option value="intern">Thực tập sinh</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">Hình thức làm việc</label>
              <select className="form-select" {...register('jobType')}>
                <option value="FULL_TIME">Toàn thời gian (Full time)</option>
                <option value="PART_TIME">Bán thời gian (Part time)</option>
                <option value="INTERN">Thực tập sinh</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">Kinh nghiệm yêu cầu</label>
              <select className="form-select" {...register('experience')}>
                <option value="none">Không yêu cầu</option>
                <option value="1-year">1 năm</option>
                <option value="2-years">2 năm</option>
                <option value="3-years">3 năm</option>
                <option value="5-plus">Trên 5 năm</option>
              </select>
            </div>
          </div>

          {/* Mô tả công việc */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Mô tả công việc *</label>
            <textarea
              className="form-control"
              rows={5}
              placeholder="- Thực hiện phát triển tính năng sản phẩm...&#10;- Phối hợp cùng đội ngũ kỹ thuật..."
              {...register('description', { required: 'Vui lòng nhập mô tả công việc' })}
            />
          </div>

          {/* Yêu cầu ứng viên */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Yêu cầu ứng viên *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="- Có kinh nghiệm làm việc thực tế...&#10;- Thành thạo các kỹ năng chuyên môn..."
              {...register('requirements', { required: 'Vui lòng nhập yêu cầu ứng viên' })}
            />
          </div>

          {/* Quyền lợi */}
          <div className="mb-4">
            <label className="form-label small fw-semibold">Quyền lợi được hưởng</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="- Thu nhập cạnh tranh theo năng lực...&#10;- Đầy đủ chế độ bảo hiểm và đãi ngộ..."
              {...register('benefits')}
            />
          </div>

          {/* Nút hành động */}
          <div className="d-flex justify-content-end gap-3 pt-3 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn btn-brand px-4 py-2 fw-bold"
              disabled={submitting}
            >
              {submitting ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <FaCheckCircle className="me-1" />
                  {isEdit ? 'Lưu thay đổi tin tuyển dụng' : 'Xuất bản tin tuyển dụng'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
}
