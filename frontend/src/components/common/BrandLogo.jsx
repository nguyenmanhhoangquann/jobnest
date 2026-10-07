import React from 'react';

export default function BrandLogo({ size = 'md' }) {
  return (
    <div className={`brand-logo-emphatic brand-logo-emphatic--${size}`}>
      {/* Icon biểu tượng cánh chim công nghệ cách điệu góc vát */}
      <div className="brand-logo-icon">
        <svg
          viewBox="0 0 36 36"
          width="32"
          height="32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cánh đa giác vát góc dứt khoát */}
          <path d="M3 24L18 5L33 24H23L18 15L13 24H3Z" fill="#111827" />
          <path d="M12 26L18 17L24 26L18 31L12 26Z" fill="#FBC725" />
          <circle cx="18" cy="9" r="2.5" fill="#FBC725" />
        </svg>
      </div>

      {/* Typography Emphatic biến tấu góc nghiêng mạnh mẽ */}
      <div className="brand-logo-text-wrap">
        <span className="brand-text-job">JOB</span>
        <span className="brand-text-nest">NEST</span>
      </div>
    </div>
  );
}
