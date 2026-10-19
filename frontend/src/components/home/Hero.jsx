import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaChevronDown, FaFire } from 'react-icons/fa';

const SUGGESTED_TAGS = [
  'AI',
  'Cloud',
  'SQL',
  'Security',
  'Java',
  'AWS',
  'Design',
  'Tester',
  'React',
];

const CITIES = [
  { value: 'all', label: 'Tất cả thành phố' },
  { value: 'ha-noi', label: 'Hà Nội' },
  { value: 'ho-chi-minh', label: 'TP. Hồ Chí Minh' },
  { value: 'da-nang', label: 'Đà Nẵng' },
  { value: 'hai-phong', label: 'Hải Phòng' },
  { value: 'can-tho', label: 'Cần Thơ' },
];

export default function Hero() {
  const [keyword, setKeyword] = useState('');
  const [area, setArea] = useState('all');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (area && area !== 'all') params.append('area', area);
    navigate(`/jobs/search?${params.toString()}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/jobs/search?keyword=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="hero-section--itsearch">
      <div className="itsearch-container">
        {/* 1. Tiêu đề chính chuẩn ITviec */}
        <h1 className="itsearch-headline">
          1.250+ Việc làm IT dành cho Developer <span className="itsearch-headline-highlight">"Chất"</span>
        </h1>

        {/* 2. Thanh tìm kiếm khung chuẩn ITviec (K tròn, bo góc kỹ thuật 6px) */}
        <form className="itsearch-bar itsearch-bar--tech" onSubmit={handleSearch}>
          {/* Dropdown địa điểm */}
          <div className="itsearch-location-wrap itsearch-location-wrap--tech">
            <FaMapMarkerAlt className="itsearch-location-icon" />
            <select
              className="itsearch-location-select"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              aria-label="Chọn thành phố"
            >
              {CITIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <FaChevronDown className="itsearch-location-chevron" />
          </div>

          <div className="itsearch-divider" />

          {/* Ô nhập từ khóa kỹ năng / chức danh / công ty */}
          <div className="itsearch-input-wrap">
            <input
              type="text"
              className="itsearch-input"
              placeholder="Nhập từ khóa kỹ năng (Java, iOS...), chức danh, công ty..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label="Nhập từ khóa kỹ năng, chức danh hoặc công ty"
            />
          </div>

          {/* Nút Tìm kiếm cam chuẩn ITviec bo góc nhẹ 6px (K tròn) */}
          <button type="submit" className="itsearch-btn itsearch-btn--tech">
            <FaSearch size={14} />
            <span>Tìm kiếm</span>
          </button>
        </form>

        {/* 4. Dải từ khóa gợi ý (Suggestions for you dạng Tech Chips k tròn) */}
        <div className="itsearch-suggestions">
          <span className="itsearch-suggestions-label">Gợi ý dành cho bạn:</span>
          <div className="d-flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className="itsearch-tag-chip itsearch-tag-chip--tech"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Dải thông điệp chạy chữ ngọn lửa hiệu ứng Marquee (Khung k tròn, viền công nghệ AI) */}
        <div className="itsearch-ticker-bar itsearch-ticker-bar--tech">
          <div className="itsearch-ticker-fire" title="Nóng">
            <FaFire className="itsearch-fire-svg" size={16} />
          </div>
          <div className="itsearch-ticker-track-wrap">
            <div className="itsearch-ticker-track">
              <span className="itsearch-ticker-text">
                JobNest - Không chỉ tìm một công việc, mà tìm thấy nơi bạn thuộc về và phát triển sự nghiệp.
              </span>
              <span className="itsearch-ticker-text" aria-hidden="true">
                JobNest - Không chỉ tìm một công việc, mà tìm thấy nơi bạn thuộc về và phát triển sự nghiệp.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
