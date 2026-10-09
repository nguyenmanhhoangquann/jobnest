import React, { useState, useEffect, memo } from 'react';

function FuturisticHudClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    let timer = null;
    const start = () => {
      if (!timer) timer = setInterval(() => setTime(new Date()), 1000);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else {
        setTime(new Date());
        start();
      }
    };

    start();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const rawHours = time.getHours();
  const ampm = rawHours >= 12 ? 'PM' : 'AM';
  const hours12 = rawHours % 12 || 12;
  const hoursStr = String(hours12).padStart(2, '0');
  const minutesStr = String(time.getMinutes()).padStart(2, '0');
  const secondsStr = String(time.getSeconds()).padStart(2, '0');

  const weekdays = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  const weekdayStr = weekdays[time.getDay()];
  const dayStr = String(time.getDate()).padStart(2, '0');
  const monthStr = String(time.getMonth() + 1).padStart(2, '0');
  const yearStr = time.getFullYear();

  return (
    <div className="transparent-clock-wrapper">
      {/* Tag trạng thái nhẹ nhàng phía trên */}
      <div className="transparent-clock-status d-flex align-items-center justify-content-center gap-2 mb-1">
        <span className="live-pulse-dot" />
        <span className="transparent-clock-tag">THỜI GIAN THỰC TẾ</span>
        <span className="text-muted" style={{ opacity: 0.4 }}>•</span>
        <span className="transparent-clock-zone">GMT+07 (VIỆT NAM)</span>
      </div>

      {/* Hiển thị giờ số to trong suốt, sắc nét */}
      <div className="transparent-time-digits">
        <span className="transparent-digit">{hoursStr}</span>
        <span className="transparent-colon">:</span>
        <span className="transparent-digit">{minutesStr}</span>
        <span className="transparent-colon">:</span>
        <span className="transparent-digit transparent-digit--sec">{secondsStr}</span>
        <span className="transparent-ampm">{ampm}</span>
      </div>

      {/* Dòng ngày tháng rõ ràng */}
      <div className="transparent-date-row">
        <span className="fw-bold text-dark">{weekdayStr}</span>
        <span className="mx-1 text-muted">•</span>
        <span>Ngày {dayStr}/{monthStr}/{yearStr}</span>
      </div>
    </div>
  );
}

export default memo(FuturisticHudClock);
