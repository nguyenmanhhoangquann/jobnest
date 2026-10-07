import React from 'react';

export default function BrandLogo({ size = 'md', className = '' }) {
  const heightMap = {
    sm: '32px',
    md: '44px',
    lg: '56px',
  };

  const h = heightMap[size] || '44px';

  return (
    <div className={`d-inline-flex align-items-center ${className}`}>
      <img
        src="/images/jobnest-logo.png"
        alt="JOB NEST - Kết nối tài năng, nâng tầm sự nghiệp"
        style={{ height: h, width: 'auto', objectFit: 'contain' }}
        className="brand-logo-img"
      />
    </div>
  );
}
