import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

export default function HeroSearchBar({ variant = 'default' }) {
  const [keyword, setKeyword] = useState('');
  const [area, setArea] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (area && area !== 'all') params.append('area', area);
    navigate(`/jobs/search?${params.toString()}`);
  };

  const isRefero = variant === 'refero';

  return (
    <form
      className={`hero-search-bar ${isRefero ? 'hero-search-bar--refero' : ''}`}
      onSubmit={handleSearch}
    >
      <div className="hero-search-bar__input-wrap">
        <FaSearch
          className="ms-2 flex-shrink-0"
          size={16}
          style={{ color: isRefero ? '#FBBF24' : '#6B7280' }}
        />
        <input
          type="text"
          className="hero-search-bar__input"
          placeholder="Vị trí, kỹ năng hoặc công ty..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="Vị trí, kỹ năng hoặc tên công ty"
        />
      </div>

      <div className="hero-search-bar__divider d-none d-sm-block" />

      <div className="hero-search-bar__select-wrap">
        <FaMapMarkerAlt
          className="ms-2 flex-shrink-0"
          size={15}
          style={{ color: isRefero ? '#FBBF24' : '#6B7280' }}
        />
        <select
          className="hero-search-bar__select"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          aria-label="Chọn địa điểm làm việc"
        >
          <option value="">Tất cả địa điểm</option>
          <option value="ha-noi">Hà Nội</option>
          <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
          <option value="da-nang">Đà Nẵng</option>
          <option value="hai-phong">Hải Phòng</option>
          <option value="can-tho">Cần Thơ</option>
        </select>
      </div>

      <button
        type="submit"
        className={`hero-search-bar__btn ${isRefero ? 'hero-search-bar__btn--refero' : 'btn-brand'}`}
      >
        <FaSearch className="me-2 d-none d-sm-inline" size={14} />
        Tìm việc
      </button>
    </form>
  );
}
