import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { APP_NAME, CONTACT_INFO } from '../../constants';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container-app">
        <div className="row g-4 py-5">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="col-12 col-md-6 col-lg-4">
            <Link to="/" className="d-flex align-items-center gap-2 mb-3 text-decoration-none">
              <span className="brand__icon">
                <FaBriefcase size={20} />
              </span>
              <span className="fs-4 fw-bold text-white">{APP_NAME}</span>
            </Link>
            <p className="footer-desc mb-4">
              Nền tảng kết nối người tìm việc và nhà tuyển dụng hàng đầu, tích hợp công nghệ AI hỗ trợ tìm việc và đánh giá hồ sơ chuẩn xác.
            </p>
            <div className="d-flex align-items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="Facebook JobNest"
              >
                <FaFacebookF size={15} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="LinkedIn JobNest"
              >
                <FaLinkedinIn size={15} />
              </a>
              <a
                href={CONTACT_INFO.githubRepo}
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="GitHub Repository JobNest"
              >
                <FaGithub size={16} />
              </a>
            </div>
          </div>

          {/* Cột 2: Dành cho ứng viên */}
          <div className="col-6 col-md-6 col-lg-2">
            <h5 className="footer-heading">Dành cho ứng viên</h5>
            <ul className="footer-links list-unstyled">
              <li><Link to="/jobs">Việc làm</Link></li>
              <li><Link to="/candidate/saved">Việc đã lưu</Link></li>
              <li><Link to="/candidate/applied">Việc đã ứng tuyển</Link></li>
              <li><Link to="/support">Hỗ trợ</Link></li>
            </ul>
          </div>

          {/* Cột 3: Nhà tuyển dụng */}
          <div className="col-6 col-md-6 col-lg-3">
            <h5 className="footer-heading">Nhà tuyển dụng</h5>
            <ul className="footer-links list-unstyled">
              <li><Link to="/employer/post-job">Đăng tin tuyển dụng</Link></li>
              <li><Link to="/employer/cvs">Quản lý CV</Link></li>
              <li><Link to="/employer/ai-review">AI đánh giá CV</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="col-12 col-md-6 col-lg-3">
            <h5 className="footer-heading">Liên hệ</h5>
            <ul className="footer-contact list-unstyled">
              <li><strong>Email:</strong> <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></li>
              <li><strong>Hotline:</strong> <a href={`tel:${CONTACT_INFO.hotline}`}>{CONTACT_INFO.hotline}</a></li>
              <li><strong>Địa chỉ:</strong> {CONTACT_INFO.address}</li>
            </ul>
          </div>
        </div>

        {/* Thanh bản quyền */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center py-3 border-top">
          <p className="mb-2 mb-md-0">
            © 2026 {APP_NAME}. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <a href="#terms" className="footer-sublink">Điều khoản</a>
            <span>·</span>
            <a href="#privacy" className="footer-sublink">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
