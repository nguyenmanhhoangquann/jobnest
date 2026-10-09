import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import BrandLogo from '../common/BrandLogo.jsx';
import { ZaloIcon } from '../common/ZaloContactButton.jsx';
import { APP_NAME, CONTACT_INFO } from '../../constants.js';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container-app">
        {/* Hàng trên: 4 cột nội dung chính */}
        <div className="row g-4 py-5">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="col-12 col-md-6 col-lg-4">
            <Link to="/" className="d-inline-flex align-items-center mb-3 text-decoration-none">
              <div className="bg-white p-2 px-3 rounded-3 shadow-sm d-inline-flex align-items-center">
                <BrandLogo size="md" />
              </div>
            </Link>
            <p className="footer-desc mb-3">
              Hệ sinh thái kết nối việc làm và phát triển sự nghiệp hàng đầu, tích hợp công nghệ AI
              hỗ trợ phân tích CV và gợi ý cơ hội nghề nghiệp tối ưu cho người Việt.
            </p>

            <div className="footer-hotline-box p-3 rounded-3 mb-3">
              <div className="d-flex align-items-center gap-2 mb-1">
                <FaPhoneAlt style={{ color: '#FEF08A' }} size={13} />
                <span className="small text-white" style={{ opacity: 0.9 }}>
                  Tổng đài tư vấn miễn phí:
                </span>
              </div>
              <a
                href={`tel:${CONTACT_INFO.hotline}`}
                className="fs-5 fw-bold text-decoration-none"
                style={{ color: '#FEF08A' }}
              >
                {CONTACT_INFO.hotline}
              </a>
              <div className="small mt-1" style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.75)' }}>
                Thứ 2 - Thứ 6 (08:00 - 18:00) | Thứ 7 (08:00 - 12:00)
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="Facebook JobNest"
                title="Facebook"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="LinkedIn JobNest"
                title="LinkedIn"
              >
                <FaLinkedinIn size={14} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="YouTube JobNest"
                title="YouTube"
              >
                <FaYoutube size={14} />
              </a>
              <a
                href={CONTACT_INFO.zalo || `https://zalo.me/${(CONTACT_INFO.hotline || '19006868').replace(/\s+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="Zalo JobNest"
                title="Zalo"
              >
                <ZaloIcon size={18} />
              </a>
              <a
                href={CONTACT_INFO.githubRepo}
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="GitHub Repository JobNest"
                title="Mã nguồn GitHub"
              >
                <FaGithub size={15} />
              </a>
            </div>
          </div>

          {/* Cột 2: Về JobNest */}
          <div className="col-6 col-md-6 col-lg-2">
            <h5 className="footer-heading">Về {APP_NAME}</h5>
            <ul className="footer-links list-unstyled">
              <li><Link to="/about">Giới thiệu chung</Link></li>
              <li><Link to="/jobs">Cơ hội việc làm</Link></li>
              <li><Link to="/blog">Cẩm nang nghề nghiệp</Link></li>
              <li><Link to="/support">Trung tâm hỗ trợ</Link></li>
              <li><a href="#privacy">Chính sách bảo mật</a></li>
              <li><a href="#terms">Quy chế hoạt động</a></li>
            </ul>
          </div>

          {/* Cột 3: Dành cho Ứng viên */}
          <div className="col-6 col-md-6 col-lg-3">
            <h5 className="footer-heading">Dành cho Ứng viên</h5>
            <ul className="footer-links list-unstyled">
              <li><Link to="/jobs">Tìm việc làm mới nhất</Link></li>
              <li><Link to="/candidate/saved-jobs">Công việc đã lưu</Link></li>
              <li><Link to="/candidate/applied-jobs">Việc làm đã ứng tuyển</Link></li>
              <li><Link to="/support">Trợ lý AI tư vấn CV</Link></li>
              <li><Link to="/register?role=candidate">Tạo tài khoản tìm việc</Link></li>
            </ul>
          </div>

          {/* Cột 4: Dành cho Nhà tuyển dụng & Liên hệ */}
          <div className="col-12 col-md-6 col-lg-3">
            <h5 className="footer-heading">Dành cho Doanh nghiệp</h5>
            <ul className="footer-links list-unstyled mb-3">
              <li><Link to="/employer/post-job">Đăng tin tuyển dụng</Link></li>
              <li><Link to="/employer/dashboard">Bảng điều khiển tuyển dụng</Link></li>
              <li><Link to="/employer/applications">Quản lý hồ sơ ứng viên</Link></li>
              <li><Link to="/register?role=employer">Đăng ký Nhà tuyển dụng</Link></li>
            </ul>

            <h5 className="footer-heading fs-6 mb-2">Trụ sở làm việc</h5>
            <ul className="footer-contact list-unstyled small mb-0">
              <li className="d-flex align-items-start gap-2 mb-2">
                <FaMapMarkerAlt className="mt-1 shrink-0" style={{ color: '#FEF08A' }} size={13} />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope className="shrink-0" style={{ color: '#FEF08A' }} size={13} />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-decoration-none text-white">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Thanh bản quyền & Chứng nhận dưới cùng */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center py-3 border-top">
          <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
            <FaShieldAlt style={{ color: '#FEF08A' }} size={14} />
            <span>
              © 2026 {APP_NAME}. Bản quyền thuộc về Đồ án tốt nghiệp Công nghệ thông tin.
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-white bg-opacity-20 text-white border border-white border-opacity-25 small d-inline-flex align-items-center gap-1">
              <FaCheckCircle style={{ color: '#FEF08A' }} size={10} /> Đã kiểm duyệt an toàn
            </span>
            <a href="#terms" className="footer-sublink">Điều khoản sử dụng</a>
            <span>·</span>
            <a href="#privacy" className="footer-sublink">Bảo mật thông tin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
