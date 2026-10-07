import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero.jsx';
import FeaturedJobs from '../components/home/FeaturedJobs.jsx';
import TopCompanies from '../components/home/TopCompanies.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();
  const employerLink = user?.role === 'EMPLOYER' ? '/employer/post-job' : '/register?role=employer';

  return (
    <div className="home-page">
      {/* 1. Khối Hero Banner + Cột Danh mục nhanh (Hình 1) */}
      <Hero />

      {/* 2. Khối Việc làm nổi bật (Hình 3) */}
      <FeaturedJobs />

      {/* 3. Khối Thương hiệu lớn tiêu biểu (TopCV Pro Company) */}
      <TopCompanies />

      {/* 4. Banner Nhà tuyển dụng (Mục 7.9) */}
      <section className="employer-banner-section py-4 mb-5">
        <div className="container-app">
          <div className="employer-banner d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div>
              <h2 className="employer-banner__title mb-1">Bạn đang tuyển dụng?</h2>
              <p className="employer-banner__desc mb-0">
                Đăng tin và để công nghệ AI giúp bạn chọn lọc hồ sơ ứng viên phù hợp nhất.
              </p>
            </div>
            <Link to={employerLink} className="employer-banner__btn">
              Đăng tin ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
