import React from 'react';
import { FaBriefcase } from 'react-icons/fa';
import { APP_NAME } from './constants';

export default function App() {
  return (
    <div className="container-app py-5 text-center">
      <div className="d-inline-flex align-items-center justify-content-center p-3 mb-3 rounded-3" style={{ background: 'var(--color-primary)' }}>
        <FaBriefcase size={32} color="var(--color-text)" />
      </div>
      <h1 className="fw-bold mb-2">{APP_NAME}</h1>
      <p className="text-muted mb-4">Kết nối tài năng - Kiến tạo tương lai</p>
      <div className="d-flex justify-content-center gap-3">
        <button className="btn-brand">Tìm việc làm</button>
        <button className="btn-ghost">Đăng tuyển dụng</button>
      </div>
    </div>
  );
}
