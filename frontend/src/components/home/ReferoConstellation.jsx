import React, { useEffect, useRef } from 'react';
import { FaShieldAlt, FaMedal, FaBolt } from 'react-icons/fa';

export default function ReferoConstellation() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let width = 540;
    let height = 480;

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || 540;
      height = rect.height || 480;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 1. Khởi tạo các hạt chòm sao vệ tinh 3D quay quanh chữ JobNest
    const N = 85;
    const particles = [];
    const colors = ['#FBBF24', '#F59E0B', '#10B981', '#38BDF8', '#FFFFFF'];

    for (let i = 0; i < N; i++) {
      const angle = (Math.PI * 2 * i) / N;
      const radius = 170 + (Math.random() - 0.5) * 60;
      const x = Math.cos(angle) * radius;
      const y = (Math.sin(angle) * (radius * 0.45)) + (Math.random() - 0.5) * 50;
      const z = Math.sin(angle) * radius * 0.9;
      const color = colors[i % colors.length];
      const size = 2 + Math.random() * 2.5;
      particles.push({ x, y, z, color, size, speed: 0.003 + Math.random() * 0.004 });
    }

    // 2. Cấu hình tương tác chuột 3D (Mouse Parallax & Inertia)
    const mouse = {
      targetRotX: 0,
      targetRotY: 0,
      currRotX: 0,
      currRotY: 0,
      idleTime: 0,
    };

    const onMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouse.targetRotY = nx * 0.65; // Góc xoay ngang
      mouse.targetRotX = -ny * 0.55; // Góc nghiêng dọc
    };

    const onMouseLeave = () => {
      mouse.targetRotX = 0;
      mouse.targetRotY = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseleave', onMouseLeave);
    }

    // 3. Render loop 60fps
    const fov = 380;
    const totalSlices = 24; // 24 lớp đùn 3D cho chữ JobNest

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.idleTime += 0.02;

      // Giảm chấn (Damping) bám theo con trỏ chuột mượt mà
      mouse.currRotX += (mouse.targetRotX - mouse.currRotX) * 0.06;
      mouse.currRotY += (mouse.targetRotY - mouse.currRotY) * 0.06;

      // Chuyển động lơ lửng tự nhiên (Idle float)
      const floatAngleX = Math.sin(mouse.idleTime * 0.6) * 0.08;
      const floatAngleY = Math.cos(mouse.idleTime * 0.5) * 0.12;

      const rotX = mouse.currRotX + floatAngleX;
      const rotY = mouse.currRotY + floatAngleY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const cx = width / 2;
      const cy = height / 2;

      // ==========================================
      // A. Vẽ các hạt vệ tinh 3D và mạng lưới thần kinh
      // ==========================================
      const projectedParticles = [];
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Quỹ đạo xoay quanh tâm chữ JobNest
        const curAngle = Math.atan2(p.z, p.x) + p.speed;
        const curR = Math.sqrt(p.x * p.x + p.z * p.z);
        const px3d = Math.cos(curAngle) * curR;
        const pz3d = Math.sin(curAngle) * curR;
        p.x = px3d;
        p.z = pz3d;

        // Xoay theo góc chuột
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const scale = fov / (fov + z2 + 100);
        const px = cx + x1 * scale;
        const py = cy + y1 * scale;
        const alpha = Math.max(0.15, Math.min(1, (z2 + 200) / 400));

        projectedParticles.push({
          px,
          py,
          z: z2,
          scale,
          alpha,
          color: p.color,
          size: p.size,
        });
      }

      // Sắp xếp các hạt từ xa đến gần
      projectedParticles.sort((a, b) => a.z - b.z);

      // Đường liên kết hạt nơ-ron
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projectedParticles.length; i++) {
        const p1 = projectedParticles[i];
        let conns = 0;
        for (let j = i + 1; j < projectedParticles.length; j++) {
          if (conns >= 2) break;
          const p2 = projectedParticles[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 52) {
            const lineAlpha = (1 - dist / 52) * p1.alpha * p2.alpha * 0.35;
            ctx.strokeStyle = `rgba(251, 191, 36, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
            conns++;
          }
        }
      }

      // Vẽ các hạt nằm ở nửa sau (phía sau chữ)
      for (let i = 0; i < projectedParticles.length; i++) {
        const p = projectedParticles[i];
        if (p.z < 0) {
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.size * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ==========================================
      // B. Vẽ Khối Typography 3D "JobNest" (Extruded Voxel Slices)
      // ==========================================
      const slices = [];
      const halfSlices = totalSlices / 2;

      for (let i = -halfSlices; i <= halfSlices; i++) {
        const zDepth = i * 1.5; // Chiều sâu Z thực tế

        // Xoay 3D
        const x1 = zDepth * sinY;
        const z1 = zDepth * cosY;
        const y1 = -z1 * sinX;
        const z2 = z1 * cosX;

        const scale = fov / (fov + z2 + 80);
        const px = cx + x1 * scale;
        const py = cy + y1 * scale;

        // Tính màu sắc lớp đùn (Dark Bronze -> Amber -> Gold)
        const progress = (i + halfSlices) / totalSlices; // 0 (sau cùng) -> 1 (trước nhất)
        slices.push({
          px,
          py,
          z2,
          scale,
          progress,
          isFront: i === halfSlices,
        });
      }

      // Sắp xếp các lớp chữ từ xa đến gần
      slices.sort((a, b) => a.z2 - b.z2);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let idx = 0; idx < slices.length; idx++) {
        const slice = slices[idx];
        const fontSize = Math.round(68 * slice.scale);
        ctx.font = `900 ${fontSize}px 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`;

        if (slice.isFront) {
          // Lớp mặt trước sáng bóng rực rỡ (Front Face)
          const grad = ctx.createLinearGradient(
            slice.px - 140 * slice.scale,
            slice.py - 30 * slice.scale,
            slice.px + 140 * slice.scale,
            slice.py + 30 * slice.scale
          );
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.3, '#FDE68A');
          grad.addColorStop(0.7, '#FBBF24');
          grad.addColorStop(1, '#F59E0B');

          // Hào quang đổ bóng mềm
          ctx.shadowColor = 'rgba(251, 191, 36, 0.65)';
          ctx.shadowBlur = 24 * slice.scale;

          ctx.fillStyle = grad;
          ctx.fillText('JobNest', slice.px, slice.py);

          // Đường viền ánh sáng
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1 * slice.scale;
          ctx.strokeText('JobNest', slice.px, slice.py);

          // Subtitle 3D bên dưới
          const subFontSize = Math.round(11 * slice.scale);
          ctx.font = `800 ${subFontSize}px 'Plus Jakarta Sans', sans-serif`;
          ctx.letterSpacing = `${2 * slice.scale}px`;
          ctx.fillStyle = '#FDE68A';
          ctx.fillText('AI CAREER PLATFORM', slice.px, slice.py + 46 * slice.scale);
          ctx.letterSpacing = '0px';
        } else {
          // Các lớp đùn cạnh bên (3D Extrusion Sides)
          ctx.shadowBlur = 0;
          const p = slice.progress;

          // Chuyển màu chuyển tiếp mượt mà từ nâu sẫm đến hổ phách
          if (p < 0.3) {
            ctx.fillStyle = '#451A03'; // Nâu đen sâu
          } else if (p < 0.6) {
            ctx.fillStyle = '#78350F'; // Hổ phách đậm
          } else if (p < 0.85) {
            ctx.fillStyle = '#B45309'; // Vàng đồng
          } else {
            ctx.fillStyle = '#D97706'; // Vàng cam
          }

          ctx.fillText('JobNest', slice.px, slice.py);
        }
      }

      ctx.shadowBlur = 0;

      // ==========================================
      // C. Vẽ các hạt nằm ở nửa trước (phía trước chữ)
      // ==========================================
      for (let i = 0; i < projectedParticles.length; i++) {
        const p = projectedParticles[i];
        if (p.z >= 0) {
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.size * p.scale, 0, Math.PI * 2);
          ctx.fill();

          // Hào quang lấp lánh cho hạt gần
          if (p.z > 60) {
            ctx.globalAlpha = p.alpha * 0.3;
            ctx.beginPath();
            ctx.arc(p.px, p.py, p.size * p.scale * 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="refero-visual-wrapper position-relative"
      style={{ cursor: 'grab' }}
      title="Di chuột để xoay chuyển chữ JobNest 3D và chòm sao tri thức"
    >
      {/* Vùng hào quang tỏa sáng nền tối (Ambient Glows) */}
      <div className="refero-glow refero-glow--violet" />
      <div className="refero-glow refero-glow--amber" />
      <div className="refero-glow refero-glow--cyan" />

      {/* HTML5 Canvas 3D tương tác theo di chuột mượt mà */}
      <canvas
        ref={canvasRef}
        className="refero-interactive-canvas position-relative z-1"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

      {/* 3 Khung giá trị thương hiệu xung quanh Hero */}
      <div className="refero-chip refero-chip--top-right">
        <div className="refero-chip__icon refero-chip__icon--amber">
          <FaShieldAlt size={13} />
        </div>
        <div className="refero-chip__value text-warning text-nowrap">Uy tín</div>
      </div>

      <div className="refero-chip refero-chip--bottom-left">
        <div className="refero-chip__icon refero-chip__icon--violet">
          <FaMedal size={13} />
        </div>
        <div className="refero-chip__value text-nowrap" style={{ color: '#C4B5FD' }}>Chất lượng</div>
      </div>

      <div className="refero-chip refero-chip--bottom-right">
        <div className="refero-chip__icon refero-chip__icon--emerald">
          <FaBolt size={13} />
        </div>
        <div className="refero-chip__value text-nowrap" style={{ color: '#34D399' }}>Nhanh chóng</div>
      </div>
    </div>
  );
}
