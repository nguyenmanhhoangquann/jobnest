import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import Home from './pages/Home.jsx';
import JobList from './pages/JobList.jsx';
import JobDetail from './pages/JobDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AppliedJobs from './pages/candidate/AppliedJobs.jsx';
import SavedJobs from './pages/candidate/SavedJobs.jsx';
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx';
import PostJob from './pages/employer/PostJob.jsx';
import ReceivedApplications from './pages/employer/ReceivedApplications.jsx';
import EmployerJobs from './pages/employer/EmployerJobs.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Companies from './pages/Companies.jsx';
import Blog from './pages/Blog.jsx';
import About from './pages/About.jsx';
import Support from './pages/Support.jsx';
import SalaryReport from './pages/SalaryReport.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import ToastHost from './components/common/ToastHost.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';

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
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Tuyến đường Layout Nhà tuyển dụng (EMPLOYER) */}
          <Route
            path="/employer"
            element={
              <ProtectedRoute allowedRole="EMPLOYER">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/employer/dashboard" replace />} />
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="edit-job/:id" element={<PostJob />} />
            <Route path="applications" element={<ReceivedApplications />} />
            <Route path="jobs" element={<EmployerJobs />} />
          </Route>

          {/* Tuyến đường giao diện chính (CANDIDATE & Khách) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/search" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/salary-report" element={<SalaryReport />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />

            {/* Tuyến đường Quản trị viên (ADMIN) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Tuyến đường ứng viên (CANDIDATE) */}
            <Route
              path="/candidate/applied-jobs"
              element={
                <ProtectedRoute allowedRole="CANDIDATE">
                  <AppliedJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/saved-jobs"
              element={
                <ProtectedRoute allowedRole="CANDIDATE">
                  <SavedJobs />
                </ProtectedRoute>
              }
            />

            <Route path="/support" element={<Support />} />
            <Route path="*" element={<NotFoundPlaceholder />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastHost />
    </AuthProvider>
  );
}
