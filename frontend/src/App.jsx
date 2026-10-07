import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import JobCard from './components/job/JobCard';
import Pagination from './components/common/Pagination';
import EmptyState from './components/common/EmptyState';
import LoadingGrid, { Spinner } from './components/common/Loading';
import ScoreRing from './components/common/ScoreRing';
import StatusBadge from './components/common/StatusBadge';
import ToastHost, { showToast } from './components/common/ToastHost';

const mockDemoJobs = [
  {
    id: 101,
    title: 'Nhân Viên Kinh Doanh Ống Nước & Thiết Bị Điện - Thu Nhập Lên Đến 50 Triệu',
    company: { name: 'Công ty TNHH Ánh Dương' },
    salaryText: '15 - 50 triệu',
    location: 'Hà Nội',
    isTop: true,
    isHot: true,
    isUrgent: false,
    saved: true,
  },
  {
    id: 102,
    title: 'Lập Trình Viên Frontend ReactJS / TypeScript (Fresher - Junior)',
    company: { name: 'Công ty CP Công nghệ Sao Mai', logoUrl: '' },
    salaryText: '12 - 20 triệu',
    location: 'Hà Nội',
    isTop: false,
    isHot: true,
    isUrgent: true,
    saved: false,
  },
  {
    id: 103,
    title: 'Chuyên Viên Marketing & Truyền Thông Đa Phương Tiện',
    company: { name: 'Tập đoàn Truyền thông Vina Media' },
    salaryText: 'Thỏa thuận',
    location: 'TP. Hồ Chí Minh',
    isTop: false,
    isHot: false,
    isUrgent: true,
    saved: false,
  },
];

function ComponentShowcase() {
  const [page, setPage] = useState(1);
  const [showLoading, setShowLoading] = useState(false);

  return (
    <div className="container-app py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2">Hệ thống Component dùng chung JobNest</h1>
        <p className="text-muted">Kiểm thử trực quan các biến thể JobCard, Pagination, Badge, ScoreRing và Toast (Mục 8 PDF)</p>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button
            type="button"
            className="btn btn-brand"
            onClick={() => showToast('success', 'Thông báo thành công: Đã lưu việc làm!')}
          >
            Bật Toast Thành công
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => showToast('error', 'Thông báo lỗi: Vui lòng kiểm tra lại!')}
          >
            Bật Toast Lỗi
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowLoading(!showLoading)}
          >
            {showLoading ? 'Tắt Skeleton' : 'Xem Skeleton Loading'}
          </button>
        </div>
      </div>

      {/* 1. Lưới JobCard biến thể */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title fs-4">1. Thẻ việc làm JobCard (Mục 8.1)</h2>
          <span className="text-muted small">Đủ biến thể: TOP, HOT, GẤP, có/không logo, lưu</span>
        </div>

        {showLoading ? (
          <LoadingGrid count={3} />
        ) : (
          <div className="job-grid">
            {mockDemoJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* 2. Biến thể Compact (AppliedJobs) & StatusBadge */}
      <section className="mb-5 p-4 bg-light rounded-4 border">
        <h2 className="section-title fs-5 mb-3">2. Biến thể Compact kèm StatusBadge (Mục 8.1, 8.4)</h2>
        <div style={{ maxWidth: '600px' }}>
          <JobCard
            job={mockDemoJobs[0]}
            extra={
              <div className="d-flex justify-content-between align-items-center">
                <StatusBadge status="PENDING" />
                <span className="small text-muted">Nộp ngày: 07/10/2026</span>
                <span className="text-primary small fw-semibold cursor-pointer">Xem CV đã nộp</span>
              </div>
            }
          />
        </div>
      </section>

      {/* 3. Phân trang Pagination & AI ScoreRing */}
      <section className="mb-5 row g-4 align-items-center">
        <div className="col-12 col-md-7">
          <div className="p-4 bg-white rounded-4 border shadow-sm text-center">
            <h2 className="section-title fs-5 mb-3">3. Phân trang Pagination (Mục 8.3)</h2>
            <p className="small text-muted mb-3">Trang hiện tại: <strong>{page}</strong> / 10 (Hết trang thì nút "Sau" tự khóa mờ 40%)</p>
            <Pagination page={page} totalPages={10} onChange={setPage} />
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="p-4 bg-white rounded-4 border shadow-sm text-center">
            <h2 className="section-title fs-5 mb-3">4. Vòng điểm AI ScoreRing (Mục 8.4)</h2>
            <div className="d-flex justify-content-center gap-4 align-items-center">
              <div>
                <ScoreRing score={85} size={100} strokeWidth={8} />
                <div className="small fw-bold text-success mt-1">Phù hợp (85)</div>
              </div>
              <div>
                <ScoreRing score={62} size={100} strokeWidth={8} />
                <div className="small fw-bold text-warning mt-1">Cân nhắc (62)</div>
              </div>
              <div>
                <ScoreRing score={42} size={100} strokeWidth={8} />
                <div className="small fw-bold text-danger mt-1">Không hợp (42)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trạng thái rỗng EmptyState */}
      <section className="p-4 bg-white rounded-4 border">
        <h2 className="section-title fs-5 mb-3 text-center">5. Trạng thái rỗng EmptyState (Mục 8.4)</h2>
        <EmptyState
          title="Chưa có việc làm phù hợp"
          description="Hãy thử chọn ngành nghề hoặc khu vực khác để tìm thêm cơ hội việc làm hấp dẫn."
          action={<button className="btn btn-brand">Khám phá việc làm</button>}
        />
      </section>
    </div>
  );
}

function JobsPlaceholder() {
  return (
    <div className="container-app py-5 text-center">
      <h1 className="fw-bold mb-2">Danh sách Việc làm</h1>
      <p className="text-muted">Danh sách việc làm đầy đủ theo ngành nghề (sẽ hoàn thiện tại Bước 6)...</p>
    </div>
  );
}

function SearchPlaceholder() {
  return (
    <div className="container-app py-5 text-center">
      <h1 className="fw-bold mb-2">Tìm kiếm việc làm</h1>
      <p className="text-muted">Bộ lọc tìm kiếm 6 trường tiêu chuẩn (sẽ hoàn thiện tại Bước 6)...</p>
    </div>
  );
}

function SupportPlaceholder() {
  return (
    <div className="container-app py-5 text-center">
      <h1 className="fw-bold mb-2">Hỗ trợ - Trợ lý JobNest</h1>
      <p className="text-muted">Chatbot AI Gemini & Voice Speech (sẽ hoàn thiện tại Bước 10)...</p>
    </div>
  );
}

function LoginPlaceholder() {
  return (
    <div className="container-app py-5 text-center">
      <h1 className="fw-bold mb-2">Đăng nhập</h1>
      <p className="text-muted mb-4">Form đăng nhập tài khoản JobNest (sẽ hoàn thiện tại Bước 7)...</p>
      <Link to="/" className="btn btn-ghost">Về trang chủ</Link>
    </div>
  );
}

function RegisterPlaceholder() {
  return (
    <div className="container-app py-5 text-center">
      <h1 className="fw-bold mb-2">Đăng ký tài khoản</h1>
      <p className="text-muted mb-4">Đăng ký 2 bước phân tách Ứng viên / Nhà tuyển dụng (sẽ hoàn thiện tại Bước 7)...</p>
      <Link to="/" className="btn btn-ghost">Về trang chủ</Link>
    </div>
  );
}

function NotFoundPlaceholder() {
  return (
    <div className="container-app py-5 text-center">
      <h1 className="display-4 fw-bold text-muted mb-2">404</h1>
      <h2 className="fw-bold mb-3">Không tìm thấy trang</h2>
      <Link to="/" className="btn btn-brand">Về trang chủ</Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPlaceholder />} />
          <Route path="/register" element={<RegisterPlaceholder />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<ComponentShowcase />} />
            <Route path="/jobs" element={<JobsPlaceholder />} />
            <Route path="/jobs/search" element={<SearchPlaceholder />} />
            <Route path="/support" element={<SupportPlaceholder />} />
            <Route path="*" element={<NotFoundPlaceholder />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastHost />
    </AuthProvider>
  );
}
