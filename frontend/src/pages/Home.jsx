import React from 'react';
import Hero from '../components/home/Hero.jsx';
import FeaturedJobs from '../components/home/FeaturedJobs.jsx';
import TopCompanies from '../components/home/TopCompanies.jsx';

export default function Home() {
  return (
    <div className="home-page">
      {/* 1. Khối Hero Banner + Cột Danh mục nhanh (Hình 1) */}
      <Hero />

      {/* 2. Toàn bộ phần thân dưới: Nền xám nhạt dịu mắt chuẩn TopCV (#F4F5F7) */}
      <div className="home-main-content-bg pb-5">
        {/* 2. Khối Việc làm nổi bật (Hình 3) */}
        <FeaturedJobs />

        {/* 3. Khối Thương hiệu lớn tiêu biểu (TopCV Pro Company) */}
        <TopCompanies />
      </div>
    </div>
  );
}
