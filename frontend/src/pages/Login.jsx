import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaBolt,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaBuilding,
  FaGraduationCap,
  FaCheckCircle,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { showToast } from '../components/common/ToastHost.jsx';
import { Spinner } from '../components/common/Loading.jsx';
import '../styles/auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeQuickRole, setActiveQuickRole] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const loggedUser = await login(username.trim(), password);
      showToast('success', `Đăng nhập thành công! Chào mừng ${loggedUser.fullName || loggedUser.username}`);
      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
      } else if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (loggedUser.role === 'EMPLOYER') {
        navigate('/employer/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickUser, quickPass, roleKey) => {
    setUsername(quickUser);
    setPassword(quickPass);
    setActiveQuickRole(roleKey);
    setErrorMsg('');
  };

  return (
    <div className="auth-ambient-wrapper">
      {/* Background Ambience Layers */}
      <div className="auth-ambient-grid" />
      <div className="auth-glow-orb-1" />
      <div className="auth-glow-orb-2" />

      {/* Main Double-Bezel Card */}
      <div className="auth-shell">
        <div className="auth-core">
          {/* Logo & Brand Identity */}
          <div className="text-center mb-4">
            <Link to="/" className="auth-logo-frame text-decoration-none">
              <img
                src="/images/jobnest-logo.png"
                alt="JobNest"
                style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>

            <div className="d-flex align-items-center justify-content-center gap-1.5 mb-1.5">
              <span className="badge bg-warning-subtle text-warning-emphasis px-2.5 py-1 rounded-pill small fw-bold">
                XÁC THỰC BẢO MẬT
              </span>
            </div>
            <h1 className="h4 fw-bold text-dark mb-1" style={{ letterSpacing: '-0.02em' }}>
              Chào mừng bạn trở lại
            </h1>
            <p className="text-muted small mb-0">Đăng nhập tài khoản JobNest để tiếp tục hành trình sự nghiệp</p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="alert alert-danger py-2.5 px-3 rounded-3 small mb-3.5 d-flex align-items-center gap-2">
              <span className="flex-grow-1">{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Input: Username */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary mb-1.5">
                Tên đăng nhập hoặc Email
              </label>
              <div className="auth-input-group">
                <span className="auth-input-icon">
                  <FaUser size={13} />
                </span>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Ví dụ: ungvien, tuyendung..."
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setActiveQuickRole('');
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="mb-3.5">
              <div className="d-flex justify-content-between align-items-center mb-1.5">
                <label className="form-label small fw-semibold text-secondary mb-0">
                  Mật khẩu
                </label>
              </div>
              <div className="auth-input-group">
                <span className="auth-input-icon">
                  <FaLock size={13} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input pe-5"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button type="submit" className="auth-submit-btn mb-4" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập hệ thống</span>
                  <FaArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Segmented Control (Hỗ trợ kiểm thử chấm bài) */}
          <div className="quick-login-container mb-3.5">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '12px' }}>
                <FaBolt size={11} className="text-warning" /> Tài khoản mẫu (Bấm để điền nhanh):
              </span>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className={`quick-login-chip ${activeQuickRole === 'candidate' ? 'quick-login-chip--active' : ''}`}
                onClick={() => handleQuickLogin('ungvien', '123456', 'candidate')}
              >
                <FaGraduationCap size={12} />
                <span>Ứng viên</span>
              </button>

              <button
                type="button"
                className={`quick-login-chip ${activeQuickRole === 'employer' ? 'quick-login-chip--active' : ''}`}
                onClick={() => handleQuickLogin('tuyendung', '123456', 'employer')}
              >
                <FaBuilding size={11} />
                <span>Nhà tuyển dụng</span>
              </button>

              <button
                type="button"
                className={`quick-login-chip ${activeQuickRole === 'admin' ? 'quick-login-chip--active' : ''}`}
                onClick={() => handleQuickLogin('admin', '123456', 'admin')}
              >
                <FaShieldAlt size={11} />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Registration Redirect & Return Home */}
          <div className="text-center small text-muted pt-2 border-top">
            Chưa có tài khoản JobNest?{' '}
            <Link to="/register" className="fw-bold text-dark text-decoration-none">
              Đăng ký ngay <FaArrowRight size={10} className="ms-0.5 text-warning" />
            </Link>
          </div>

          <div className="text-center mt-3">
            <Link to="/" className="text-secondary small text-decoration-none d-inline-flex align-items-center gap-1">
              <FaArrowLeft size={11} /> Quay về Trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
