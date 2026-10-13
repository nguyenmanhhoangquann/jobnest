import React from 'react';

export default function InteractiveBook3D() {
  return (
    <div className="book-showcase-stage">
      <div className="book-showcase-glow" />
      <div className="book-showcase-wrapper">
        <img
          src="/images/itviec-book-3d-clean.png"
          alt="Báo cáo Lương IT &amp; Thị trường tuyển dụng IT Việt Nam 2025–2026"
          className="book-showcase-img"
        />
        <div className="book-showcase-shadow" />
      </div>
    </div>
  );
}
