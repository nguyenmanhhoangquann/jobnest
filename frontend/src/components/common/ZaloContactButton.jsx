import React from 'react';
import { useLocation } from 'react-router-dom';
import { CONTACT_INFO } from '../../constants.js';

export function ZaloIcon({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="24" fill="#0068FF" />
      <path
        d="M24 10C16.268 10 10 15.596 10 22.5C10 26.398 12.025 29.854 15.228 32.106L14 38L20.25 35.812C21.455 36.194 22.707 36.4 24 36.4C31.732 36.4 38 30.804 38 23.9C38 17 31.732 10 24 10Z"
        fill="white"
      />
      <text
        x="24"
        y="27"
        textAnchor="middle"
        fill="#0068FF"
        fontSize="10"
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Zalo
      </text>
    </svg>
  );
}

export default function ZaloContactButton() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const zaloUrl =
    CONTACT_INFO.zalo || `https://zalo.me/${(CONTACT_INFO.hotline || '19006868').replace(/\s+/g, '')}`;

  return (
    <aside aria-label="Hỗ trợ liên hệ Zalo" className="zalo-floating-container">
      <a
        href={zaloUrl}
        target="_blank"
        rel="noreferrer"
        className="zalo-floating-btn"
        title="Chat tư vấn qua Zalo"
        aria-label="Chat tư vấn qua Zalo"
      >
        <div className="zalo-floating-btn__pulse" />
        <div className="zalo-floating-btn__icon d-flex align-items-center justify-content-center">
          <ZaloIcon size={46} />
        </div>
        <span className="zalo-floating-btn__tooltip">Chat Zalo hỗ trợ</span>
      </a>
    </aside>
  );
}
