import React, { useEffect, useState } from 'react';

export default function ScoreRing({ score = 0, size = 120, strokeWidth = 10 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    if (end === 0) {
      setAnimatedScore(0);
      return;
    }
    const duration = 800; // 0.8s
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getColor = (val) => {
    if (val < 50) return 'var(--color-danger)';
    if (val < 75) return 'var(--color-urgent)';
    return 'var(--color-success)';
  };

  const currentColor = getColor(score);

  return (
    <div
      className="score-ring position-relative d-inline-flex align-items-center justify-content-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform-rotate">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated score circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={currentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="position-absolute text-center">
        <span className="fw-bold" style={{ fontSize: `${size * 0.28}px`, color: currentColor }}>
          {animatedScore}
        </span>
        <span className="text-muted" style={{ fontSize: `${size * 0.14}px` }}>/100</span>
      </div>
    </div>
  );
}
