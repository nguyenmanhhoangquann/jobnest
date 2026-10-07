import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaBolt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { showToast } from '../components/common/ToastHost.jsx';
import { Spinner } from '../components/common/Loading.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = location.state?.from || '/';

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
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickUser, quickPass) => {
    setUsername(quickUser);
    setPassword(quickPass);
    setErrorMsg('');
  };

  return (
    <div className="auth-page py-5">
      <div className="container-app">
        <div className="auth-card mx-auto">
          {/* Logo & Header */}
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-3">
              <span className="brand-logo__circle">JN</span>
              <span className="brand-logo__text">
                Job<strong>Nest</strong>
              </span>
            </Link>
            <h1 className="auth-title">Đăng nhập tài khoản</h1>
            <p className="text-muted small">Chào mừng bạn quay trở lại với JobNest</p>
          </div>

          {/* Thông báo lỗi nếu có */}
          {errorMsg && <div className="alert alert-danger py-2 small mb-3">{errorMsg}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Tên đăng nhập</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaUser size={13} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên đăng nhập hoặc email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-semibold mb-0">Mật khẩu</label>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaLock size={13} className="text-muted" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
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
            </div>

            <button type="submit" className="btn btn-brand w-100 py-2 fw-bold mb-3" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Đăng nhập'}
            </button>
          </form>

          {/* Khối đăng nhập nhanh (Mục 12.3 PDF - Phục vụ chấm bài) */}
          <div className="quick-login-box p-3 rounded mb-4">
            <div className="d-flex align-items-center gap-1 text-warning fw-semibold small mb-2">
              <FaBolt size={12} /> Tài khoản mẫu (Bấm để điền nhanh):
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary flex-fill"
                onClick={() => handleQuickLogin('ungvien', '123456')}
              >
                Ứng viên
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary flex-fill"
                onClick={() => handleQuickLogin('tuyendung', '123456')}
              >
                Nhà tuyển dụng
              </button>
            </div>
          </div>

          {/* Footer chuyển sang đăng ký */}
          <div className="text-center small text-muted">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="fw-semibold text-primary">
              Đăng ký ngay
            </Link>
          </div>

          <div className="text-center mt-3">
            <Link to="/" className="text-muted small text-decoration-none">
              <FaArrowLeft className="me-1" /> Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
