import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Home from './pages/Home.jsx';
import JobList from './pages/JobList.jsx';
import JobDetail from './pages/JobDetail.jsx';
import ToastHost from './components/common/ToastHost.jsx';

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
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/search" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/support" element={<SupportPlaceholder />} />
            <Route path="*" element={<NotFoundPlaceholder />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastHost />
    </AuthProvider>
  );
}
