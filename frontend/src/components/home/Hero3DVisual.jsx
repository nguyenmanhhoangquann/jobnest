import React, { useRef, useEffect } from 'react';

export default function Hero3DVisual() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!container || !card) return;

    let animId = null;
    let targetX = 0;
    let targetY = 0;
    let currX = 0;
    let currY = 0;
    let idleTime = 0;
    let isHovered = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotX = 0;
    let dragRotY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (isDragging) {
        const deltaX = (e.clientX - dragStartX) * 0.25;
        const deltaY = (e.clientY - dragStartY) * 0.25;
        targetY = dragRotY + deltaX;
        targetX = Math.max(-28, Math.min(28, dragRotX - deltaY));
      } else {
        targetY = nx * 20; // Góc xoay ngang mượt
        targetX = -ny * 16; // Góc nghiêng dọc mượt
      }

      if (glare) {
        const glareX = ((nx + 1) / 2) * 100;
        const glareY = ((ny + 1) / 2) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.25) 0%, rgba(251, 191, 36, 0.12) 35%, transparent 70%)`;
        glare.style.opacity = '1';
      }
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      isDragging = false;
      targetX = 0;
      targetY = 0;
      if (glare) glare.style.opacity = '0';
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragRotX = currX;
      dragRotY = currY;
      container.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const loop = () => {
      idleTime += 0.025;
      const idleFloatY = isHovered ? 0 : Math.sin(idleTime * 0.7) * 7;
      const idleRotY = isHovered ? 0 : Math.sin(idleTime * 0.5) * 4;
      const idleRotX = isHovered ? 0 : Math.cos(idleTime * 0.6) * 2.5;

      // Giảm chấn (damping) bám theo chuột giống con lắc quán tính
      currX += (targetX - currX) * 0.075;
      currY += (targetY - currY) * 0.075;

      const finalRotX = currX + idleRotX;
      const finalRotY = currY + idleRotY;

      card.style.transform = `perspective(1000px) rotateX(${finalRotX.toFixed(2)}deg) rotateY(${finalRotY.toFixed(2)}deg) translateY(${idleFloatY.toFixed(2)}px) translateZ(15px)`;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-3d-interactive-stage"
      title="Di chuột hoặc kéo chuột để xoay chuyển ảnh 3D"
      style={{ cursor: 'grab' }}
    >
      <div className="refero-glow refero-glow--amber" />
      <div className="refero-glow refero-glow--cyan" />
      <div ref={cardRef} className="hero-3d-interactive-card">
        <picture>
          <source srcSet="/images/hero-3d-character.webp" type="image/webp" />
          <img
            src="/images/hero-3d-character.png"
            alt="JobNest AI Career Platform"
            className="hero-3d-character-img"
            width="444"
            height="358"
            draggable={false}
          />
        </picture>
        <div ref={glareRef} className="hero-3d-glare-overlay" />
      </div>
    </div>
  );
}
