import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  FaUserGraduate,
  FaBuilding,
  FaArrowLeft,
  FaCheck,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { showToast } from '../components/common/ToastHost.jsx';
import { Spinner } from '../components/common/Loading.jsx';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register: registerApi } = useAuth();

  const initialRole = searchParams.get('role')?.toUpperCase() === 'EMPLOYER' ? 'EMPLOYER' : 'CANDIDATE';
  const hasRoleParam = !!searchParams.get('role');

  const [step, setStep] = useState(hasRoleParam ? 2 : 1);
  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerApi({
        role,
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        companyName: role === 'EMPLOYER' ? data.companyName : undefined,
        phone: role === 'EMPLOYER' ? data.phone : undefined,
      });

      showToast('success', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      showToast('error', err.message || 'Đăng ký thất bại, tên đăng nhập hoặc email có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page py-5">
      <div className="container-app">
        <div className="auth-card mx-auto" style={{ maxWidth: step === 1 ? '560px' : '480px' }}>
          {/* Logo & Header */}
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-3">
              <span className="brand-logo__circle">JN</span>
              <span className="brand-logo__text">
                Job<strong>Nest</strong>
              </span>
            </Link>
            <h1 className="auth-title">Đăng ký tài khoản</h1>
            <p className="text-muted small">
              {step === 1 ? 'Bước 1: Chọn loại tài khoản phù hợp với bạn' : `Bước 2: Điền thông tin ${role === 'CANDIDATE' ? 'Ứng viên' : 'Nhà tuyển dụng'}`}
            </p>
          </div>

          {/* BƯỚC 1: Chọn vai trò */}
          {step === 1 && (
            <div>
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6">
                  <div
                    className={`role-select-card p-3 text-center h-100 ${role === 'CANDIDATE' ? 'role-select-card--active' : ''}`}
                    onClick={() => setRole('CANDIDATE')}
                  >
                    <div className="role-icon-box mx-auto mb-2">
                      <FaUserGraduate size={24} />
                    </div>
                    <h3 className="fs-6 fw-bold mb-1">Người tìm việc</h3>
                    <p className="small text-muted mb-0">Tìm việc làm mơ ước, nộp CV và theo dõi trạng thái ứng tuyển.</p>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div
                    className={`role-select-card p-3 text-center h-100 ${role === 'EMPLOYER' ? 'role-select-card--active' : ''}`}
                    onClick={() => setRole('EMPLOYER')}
                  >
                    <div className="role-icon-box mx-auto mb-2">
                      <FaBuilding size={24} />
                    </div>
                    <h3 className="fs-6 fw-bold mb-1">Nhà tuyển dụng</h3>
                    <p className="small text-muted mb-0">Đăng tin tuyển dụng và tìm kiếm nhân tài chất lượng.</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-brand w-100 py-2 fw-bold mb-3"
                onClick={() => setStep(2)}
              >
                Tiếp tục <FaCheck className="ms-1" size={12} />
              </button>
            </div>
          )}

          {/* BƯỚC 2: Form chi tiết theo vai trò */}
          {step === 2 && (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Nút quay lại bước 1 nếu không có url query param bắt buộc */}
              <button
                type="button"
                className="btn btn-link text-muted p-0 text-decoration-none small mb-3 d-inline-flex align-items-center"
                onClick={() => setStep(1)}
              >
                <FaArrowLeft className="me-1" size={11} /> Đổi loại tài khoản ({role === 'CANDIDATE' ? 'Ứng viên' : 'Nhà tuyển dụng'})
              </button>

              {role === 'EMPLOYER' && (
                <>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Tên công ty *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                      placeholder="Ví dụ: Công ty Cổ phần Công nghệ ABC"
                      {...register('companyName', { required: 'Vui lòng nhập tên công ty' })}
                    />
                    {errors.companyName && <div className="invalid-feedback">{errors.companyName.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Số điện thoại liên hệ *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Ví dụ: 0912345678"
                      {...register('phone', { required: 'Vui lòng nhập số điện thoại' })}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  {role === 'CANDIDATE' ? 'Họ và tên *' : 'Người liên hệ đại diện *'}
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email *</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Email không hợp lệ',
                    },
                  })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Tên đăng nhập *</label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  placeholder="Tối thiểu 3 ký tự"
                  {...register('username', {
                    required: 'Vui lòng nhập tên đăng nhập',
                    minLength: { value: 3, message: 'Tên đăng nhập tối thiểu 3 ký tự' },
                  })}
                />
                {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Mật khẩu *</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Tối thiểu 6 ký tự"
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu',
                      minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
                {errors.password && <div className="text-danger small mt-1">{errors.password.message}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Xác nhận mật khẩu *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Nhập lại mật khẩu"
                  {...register('confirmPassword', {
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: (value) => value === passwordValue || 'Mật khẩu xác nhận không khớp',
                  })}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-brand w-100 py-2 fw-bold mb-3"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : 'Hoàn tất đăng ký'}
              </button>
            </form>
          )}

          <div className="text-center small text-muted">
            Đã có tài khoản?{' '}
            <Link to="/login" className="fw-semibold text-primary">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
