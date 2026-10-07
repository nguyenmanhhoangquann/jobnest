import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

export default function HeroSearchBar() {
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

  return (
    <form className="hero-search-bar" onSubmit={handleSearch}>
      <div className="hero-search-bar__input-wrap">
        <FaSearch className="text-muted ms-2" size={16} />
        <input
          type="text"
          className="hero-search-bar__input"
          placeholder="Nhập vị trí công việc, kỹ năng hoặc tên công ty..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="hero-search-bar__divider d-none d-sm-block" />

      <div className="hero-search-bar__select-wrap">
        <FaMapMarkerAlt className="text-muted ms-2" size={15} />
        <select
          className="hero-search-bar__select"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        >
          <option value="">Tất cả địa điểm</option>
          <option value="ha-noi">Hà Nội</option>
          <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
          <option value="da-nang">Đà Nẵng</option>
          <option value="hai-phong">Hải Phòng</option>
          <option value="can-tho">Cần Thơ</option>
        </select>
      </div>

      <button type="submit" className="btn-brand hero-search-bar__btn">
        <FaSearch className="me-2 d-none d-sm-inline" size={14} />
        Tìm kiếm
      </button>
    </form>
  );
}
