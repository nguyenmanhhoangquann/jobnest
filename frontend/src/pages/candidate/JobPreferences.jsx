import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserCheck,
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaLaptopCode,
  FaIndustry,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaSave,
  FaSlidersH,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { showToast } from '../../components/common/ToastHost.jsx';
import '../../styles/job-preferences.css';

const DEFAULT_PREFERENCES = {
  status: 'actively_looking', // actively_looking | open_to_offers | not_interested
  desiredTitles: 'Fullstack Developer, Frontend ReactJS',
  bio: 'Lập trình viên đam mê công nghệ mới, hướng tới xây dựng sản phẩm chất lượng cao với hiệu năng tối ưu.',
  experienceLevel: 'junior',
  workTypes: ['FULL_TIME'],
  workplaceSettings: ['HYBRID', 'REMOTE'],
  locations: ['Hà Nội'],
  targetSalaryMin: 18,
  skills: ['ReactJS', 'JavaScript', 'TypeScript', 'Java', 'Spring Boot', 'MySQL', 'Git'],
  industries: ['Công nghệ thông tin / Phần mềm', 'Fintech & Ngân hàng số'],
};

const SUGGESTED_SKILLS = [
  'ReactJS',
  'Vue.js',
  'TypeScript',
  'Node.js',
  'Java',
  'Spring Boot',
  'Python',
  'Docker',
  'Kubernetes',
  'AWS',
  'MySQL',
  'PostgreSQL',
  'RESTful API',
  'Tailwind CSS',
  'Next.js',
];

const INDUSTRIES_LIST = [
  'Công nghệ thông tin / Phần mềm',
  'Fintech & Ngân hàng số',
  'Thương mại điện tử (E-commerce)',
  'Marketing & Quảng cáo số',
  'Sản xuất & Kỹ thuật',
  'Giáo dục trực tuyến (EdTech)',
  'Y tế & Chăm sóc sức khỏe (HealthTech)',
];

export default function JobPreferences() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('jn_job_preferences');
      if (saved) return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    } catch {
      // Fallback to default
    }
    return DEFAULT_PREFERENCES;
  });

  const [skillInput, setSkillInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync user display name if present
  const userName = user?.displayName || user?.username || 'Ứng viên';

  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const toggleWorkType = (type) => {
    setFormData((prev) => {
      const exists = prev.workTypes.includes(type);
      return {
        ...prev,
        workTypes: exists
          ? prev.workTypes.filter((t) => t !== type)
          : [...prev.workTypes, type],
      };
    });
  };

  const toggleSetting = (setting) => {
    setFormData((prev) => {
      const exists = prev.workplaceSettings.includes(setting);
      return {
        ...prev,
        workplaceSettings: exists
          ? prev.workplaceSettings.filter((s) => s !== setting)
          : [...prev.workplaceSettings, setting],
      };
    });
  };

  const toggleLocation = (loc) => {
    setFormData((prev) => {
      const exists = prev.locations.includes(loc);
      return {
        ...prev,
        locations: exists
          ? prev.locations.filter((l) => l !== loc)
          : [...prev.locations, loc],
      };
    });
  };

  const toggleIndustry = (ind) => {
    setFormData((prev) => {
      const exists = prev.industries.includes(ind);
      return {
        ...prev,
        industries: exists
          ? prev.industries.filter((i) => i !== ind)
          : [...prev.industries, ind],
      };
    });
  };

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('jn_job_preferences', JSON.stringify(formData));
    showToast('success', 'Đã lưu nguyện vọng nghề nghiệp thành công!', 'THÀNH CÔNG');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="job-preferences-page">
      {/* Header Banner */}
      <section className="jp-header-banner">
        <div className="container-app">
          <div className="jp-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span>Hồ sơ cá nhân</span>
            <span>/</span>
            <span className="text-white">Chỉnh sửa bản thân</span>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="jp-title">Chỉnh sửa bản thân & Nguyện vọng</h1>
              <p className="jp-subtitle">
                Xin chào <strong>{userName}</strong>. Thiết lập mục tiêu sự nghiệp, mức lương kỳ vọng và môi trường mong muốn để thuật toán JobNest kết nối việc làm chuẩn xác nhất.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-outline-light d-inline-flex align-items-center gap-2">
              <FaArrowLeft size={12} /> Xem danh sách việc làm
            </Link>
          </div>
        </div>
      </section>

      {/* Main Preferences Form Container */}
      <main className="container-app py-4" style={{ maxWidth: '960px' }}>
        <form onSubmit={handleSave}>
          {/* Card 1: Trạng thái tìm việc (Built In Match Mode Status) */}
          <div className="jp-card">
            <h2 className="jp-card-title">
              <FaUserCheck className="text-warning" size={17} />
              Trạng thái tìm việc hiện tại
            </h2>
            <p className="jp-card-desc">
              Nhà tuyển dụng sẽ biết được mức độ sẵn sàng chuyển việc của bạn khi tiếp cận hồ sơ.
            </p>

            <div className="jp-status-grid">
              {/* Option 1: Actively looking */}
              <div
                className={`jp-status-option ${formData.status === 'actively_looking' ? 'jp-status-option--active' : ''}`}
                onClick={() => handleStatusChange('actively_looking')}
              >
                <div className="d-flex align-items-center mb-1">
                  <span className="jp-status-indicator bg-success" />
                  <div className="jp-status-name">Đang tích cực tìm việc</div>
                </div>
                <p className="jp-status-desc">
                  Sẵn sàng phỏng vấn và nhận offer việc làm ngay trong thời gian này.
                </p>
              </div>

              {/* Option 2: Open to offers */}
              <div
                className={`jp-status-option ${formData.status === 'open_to_offers' ? 'jp-status-option--active' : ''}`}
                onClick={() => handleStatusChange('open_to_offers')}
              >
                <div className="d-flex align-items-center mb-1">
                  <span className="jp-status-indicator bg-warning" />
                  <div className="jp-status-name">Mở lòng với cơ hội tốt</div>
                </div>
                <p className="jp-status-desc">
                  Hiện vẫn đang đi làm nhưng muốn lắng nghe các cơ hội đãi ngộ hấp dẫn hơn.
                </p>
              </div>

              {/* Option 3: Not looking */}
              <div
                className={`jp-status-option ${formData.status === 'not_interested' ? 'jp-status-option--active' : ''}`}
                onClick={() => handleStatusChange('not_interested')}
              >
                <div className="d-flex align-items-center mb-1">
                  <span className="jp-status-indicator bg-secondary" />
                  <div className="jp-status-name">Tạm thời chưa có nhu cầu</div>
                </div>
                <p className="jp-status-desc">
                  Đang hài lòng với công việc và tạm khóa nhận thông báo cơ hội mới.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Chức danh mong muốn & Giới thiệu bản thân */}
          <div className="jp-card">
            <h2 className="jp-card-title">
              <FaBriefcase className="text-primary" size={17} />
              Chức danh mục tiêu & Cấp bậc
            </h2>
            <p className="jp-card-desc">
              Những vai trò công việc bạn muốn theo đuổi tiếp theo trong sự nghiệp.
            </p>

            <div className="mb-3">
              <label className="form-label fw-bold small text-dark">
                Chức danh hoặc từ khóa công việc mong muốn
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: Frontend Engineer, Java Backend Developer, Fullstack Web..."
                value={formData.desiredTitles}
                onChange={(e) => setFormData({ ...formData, desiredTitles: e.target.value })}
              />
              <div className="form-text small">
                Ngăn cách các chức danh bằng dấu phẩy để hệ thống tối ưu bộ lọc.
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-dark mb-2">
                Cấp bậc kinh nghiệm mong muốn
              </label>
              <div className="jp-chip-group">
                {[
                  { id: 'intern', label: 'Thực tập sinh / Mới ra trường' },
                  { id: 'junior', label: 'Junior (1 - 2 năm kinh nghiệm)' },
                  { id: 'mid', label: 'Mid-level (2 - 5 năm kinh nghiệm)' },
                  { id: 'senior', label: 'Senior (5+ năm kinh nghiệm)' },
                  { id: 'lead', label: 'Trưởng nhóm / Quản lý' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`jp-chip ${formData.experienceLevel === item.id ? 'jp-chip--active' : ''}`}
                    onClick={() => setFormData({ ...formData, experienceLevel: item.id })}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label fw-bold small text-dark">
                Giới thiệu ngắn gọn về bản thân (Bio)
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Tóm tắt ngắn về kinh nghiệm, định hướng và thế mạnh nổi bật của bạn..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>

          {/* Card 3: Hình thức làm việc & Địa điểm */}
          <div className="jp-card">
            <h2 className="jp-card-title">
              <FaMapMarkerAlt className="text-danger" size={17} />
              Hình thức làm việc & Địa điểm
            </h2>
            <p className="jp-card-desc">
              Lựa chọn chế độ làm việc và khu vực địa lý phù hợp với lối sống của bạn.
            </p>

            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold small text-dark mb-2">
                  Loại hình hợp đồng
                </label>
                <div className="jp-chip-group">
                  {[
                    { id: 'FULL_TIME', label: 'Toàn thời gian' },
                    { id: 'PART_TIME', label: 'Bán thời gian' },
                    { id: 'INTERN', label: 'Thực tập' },
                    { id: 'CONTRACT', label: 'Freelance / Hợp đồng' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`jp-chip ${formData.workTypes.includes(item.id) ? 'jp-chip--active' : ''}`}
                      onClick={() => toggleWorkType(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-bold small text-dark mb-2">
                  Chế độ văn phòng
                </label>
                <div className="jp-chip-group">
                  {[
                    { id: 'REMOTE', label: 'Làm từ xa (Remote)' },
                    { id: 'HYBRID', label: 'Linh hoạt (Hybrid)' },
                    { id: 'ONSITE', label: 'Tại văn phòng (On-site)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`jp-chip ${formData.workplaceSettings.includes(item.id) ? 'jp-chip--active' : ''}`}
                      onClick={() => toggleSetting(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="form-label fw-bold small text-dark mb-2">
                Khu vực ưu tiên làm việc
              </label>
              <div className="jp-chip-group">
                {['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Toàn quốc'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    className={`jp-chip ${formData.locations.includes(loc) ? 'jp-chip--active' : ''}`}
                    onClick={() => toggleLocation(loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Mức lương kỳ vọng */}
          <div className="jp-card">
            <h2 className="jp-card-title">
              <FaDollarSign className="text-success" size={17} />
              Mức lương mong muốn
            </h2>
            <p className="jp-card-desc">
              Mức lương tối thiểu bạn mong muốn nhận được khi chuyển việc.
            </p>

            <div className="row align-items-center g-3">
              <div className="col-12 col-sm-6 col-md-4">
                <div className="input-group">
                  <input
                    type="number"
                    min="5"
                    max="150"
                    step="1"
                    className="form-control form-control-lg fw-bold"
                    value={formData.targetSalaryMin}
                    onChange={(e) =>
                      setFormData({ ...formData, targetSalaryMin: Number(e.target.value) || 0 })
                    }
                  />
                  <span className="input-group-text bg-light fw-bold">triệu / tháng</span>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-8">
                <span className="text-muted small">
                  Tương đương khoảng <strong>{(formData.targetSalaryMin * 12).toLocaleString()} triệu VNĐ / năm</strong> (chưa gồm thưởng hiệu quả & lương tháng 13).
                </span>
              </div>
            </div>
          </div>

          {/* Card 5: Kỹ năng cốt lõi (Skills & Tech Stack Tags) */}
          <div className="jp-card">
            <h2 className="jp-card-title">
              <FaLaptopCode className="text-info" size={17} />
              Kỹ năng & Công nghệ thế mạnh
            </h2>
            <p className="jp-card-desc">
              Thêm các ngôn ngữ, framework, công cụ bạn thành thạo để khớp lệnh AI tốt nhất.
            </p>

            <div className="jp-tag-wrap mb-2">
              {formData.skills.map((skill) => (
                <span key={skill} className="jp-tag-badge">
                  {skill}
                  <button
                    type="button"
                    className="jp-tag-remove"
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label={`Xóa ${skill}`}
                  >
                    <FaTimes size={11} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="jp-tag-input"
                placeholder="Nhập kỹ năng rồi bấm Enter (ví dụ: Docker, AWS...)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
            </div>

            <div className="small text-muted mb-2">Gợi ý kỹ năng phổ biến:</div>
            <div className="jp-quick-skills">
              {SUGGESTED_SKILLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="jp-quick-skill-btn"
                  onClick={() => handleAddSkill(s)}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Card 6: Ngành nghề quan tâm */}
          <div className="jp-card">
            <h2 className="jp-card-title">
              <FaIndustry className="text-warning" size={17} />
              Lĩnh vực doanh nghiệp quan tâm
            </h2>
            <p className="jp-card-desc">
              Chọn các ngành nghề bạn muốn làm việc hoặc phát triển chuyên môn.
            </p>

            <div className="jp-chip-group">
              {INDUSTRIES_LIST.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  className={`jp-chip ${formData.industries.includes(ind) ? 'jp-chip--active' : ''}`}
                  onClick={() => toggleIndustry(ind)}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="jp-sticky-actions">
            <div className="container-app d-flex justify-content-between align-items-center">
              <span className="text-muted small">
                {savedSuccess ? (
                  <span className="text-success fw-bold d-inline-flex align-items-center gap-1">
                    <FaCheck size={12} /> Đã cập nhật thành công!
                  </span>
                ) : (
                  'Những thay đổi sẽ lập tức áp dụng cho gợi ý việc làm của bạn'
                )}
              </span>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setFormData(DEFAULT_PREFERENCES);
                    showToast('info', 'Đã đặt lại về mặc định.');
                  }}
                >
                  Đặt lại
                </button>
                <button type="submit" className="btn btn-jp-save d-inline-flex align-items-center gap-2">
                  <FaSave size={14} /> Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
