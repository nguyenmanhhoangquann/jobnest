import React from 'react';
import {
  FaSlidersH,
  FaUndo,
  FaSearch,
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUserGraduate,
  FaClock,
  FaTimes,
} from 'react-icons/fa';

export default function JobFilterSidebar({ filters, onChange, onReset }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const activeFilters = [];
  if (filters.keyword && filters.keyword.trim()) {
    activeFilters.push({ key: 'keyword', label: `"${filters.keyword}"`, clearVal: '' });
  }
  if (filters.category && filters.category !== 'all') {
    const catLabels = {
      cntt: 'CNTT',
      'kinh-doanh': 'Kinh doanh',
      marketing: 'Marketing',
      'tai-chinh': 'Tài chính',
      'ke-toan': 'Kế toán',
      'nhan-su': 'Nhân sự',
      'thiet-ke': 'Thiết kế',
      'san-xuat': 'Sản xuất',
    };
    activeFilters.push({
      key: 'category',
      label: catLabels[filters.category] || filters.category,
      clearVal: 'all',
    });
  }
  if (filters.area && filters.area !== 'all') {
    const areaLabels = {
      'ha-noi': 'Hà Nội',
      'ho-chi-minh': 'TP. HCM',
      'da-nang': 'Đà Nẵng',
      'hai-phong': 'Hải Phòng',
      'can-tho': 'Cần Thơ',
    };
    activeFilters.push({
      key: 'area',
      label: areaLabels[filters.area] || filters.area,
      clearVal: 'all',
    });
  }
  if (filters.salary && filters.salary !== 'all') {
    const salLabels = {
      'under-10': '< 10 triệu',
      '10-20': '10 - 20 triệu',
      '20-30': '20 - 30 triệu',
      'over-30': '> 30 triệu',
      deal: 'Thỏa thuận',
    };
    activeFilters.push({
      key: 'salary',
      label: salLabels[filters.salary] || filters.salary,
      clearVal: 'all',
    });
  }
  if (filters.experience && filters.experience !== 'all') {
    const expLabels = {
      none: 'Chưa có kn',
      '1-year': '1 năm kn',
      '2-years': '2 năm kn',
      '3-years': '3 năm kn',
      '5-plus': 'Trên 5 năm',
    };
    activeFilters.push({
      key: 'experience',
      label: expLabels[filters.experience] || filters.experience,
      clearVal: 'all',
    });
  }
  if (filters.jobType && filters.jobType !== 'all') {
    const typeLabels = {
      'full-time': 'Toàn thời gian',
      'part-time': 'Bán thời gian',
      intern: 'Thực tập sinh',
    };
    activeFilters.push({
      key: 'jobType',
      label: typeLabels[filters.jobType] || filters.jobType,
      clearVal: 'all',
    });
  }

  const activeCount = activeFilters.length;

  return (
    <div className="filter-sidebar">
      {/* Header bar: Title, Count Badge, Reset link */}
      <div className="d-flex justify-content-between align-items-center pb-2.5 mb-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <FaSlidersH size={13} className="text-warning" />
          <h3 className="filter-sidebar__title mb-0">Bộ lọc tìm kiếm</h3>
          {activeCount > 0 && (
            <span
              className="badge bg-warning text-dark font-monospace fw-bold"
              style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px' }}
            >
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            className="btn-reset-filter"
            onClick={onReset}
            title="Xóa tất cả bộ lọc về mặc định"
          >
            <FaUndo size={10} className="me-1" />
            <span>Xóa lọc</span>
          </button>
        )}
      </div>

      {/* Active tags strip (if any filters selected) */}
      {activeCount > 0 && (
        <div className="filter-active-chips-wrap mb-3">
          {activeFilters.map((af) => (
            <button
              key={af.key}
              type="button"
              className="filter-active-chip"
              onClick={() => handleChange(af.key, af.clearVal)}
              title={`Bỏ lọc ${af.label}`}
            >
              <span>{af.label}</span>
              <FaTimes size={9} />
            </button>
          ))}
        </div>
      )}

      {/* 1. Từ khóa (Search Drawer Style) */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <FaSearch size={11} className="me-1 text-secondary" />
          <span>Từ khóa tìm kiếm</span>
        </label>
        <div className="job-filter-input-wrap">
          <FaSearch size={12} className="text-muted ms-2.5 flex-shrink-0" />
          <input
            type="text"
            className="job-filter-input"
            placeholder="Chức danh, kỹ năng, công ty..."
            value={filters.keyword || ''}
            onChange={(e) => handleChange('keyword', e.target.value)}
          />
          {filters.keyword && (
            <button
              type="button"
              className="job-filter-clear-btn"
              onClick={() => handleChange('keyword', '')}
              aria-label="Xóa từ khóa"
            >
              <FaTimes size={10} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Địa điểm (Location Box chuẩn phong cách Built In như bên Công ty) */}
      <div className="filter-group mb-3">
        <div className={`job-filter-location-card ${filters.area && filters.area !== 'all' ? 'job-filter-location-card--active' : ''}`}>
          <div className="job-filter-location-content">
            <span className="job-filter-location-label">ĐỊA ĐIỂM</span>
            <select
              className="job-filter-location-select"
              value={filters.area || 'all'}
              onChange={(e) => handleChange('area', e.target.value)}
            >
              <option value="all">Toàn quốc (Tất cả)</option>
              <option value="ha-noi">Hà Nội</option>
              <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
              <option value="da-nang">Đà Nẵng</option>
              <option value="hai-phong">Hải Phòng</option>
              <option value="can-tho">Cần Thơ</option>
            </select>
          </div>

          <button
            type="button"
            className="job-filter-gps-btn"
            title={filters.area && filters.area !== 'all' ? 'Đặt lại tất cả địa điểm' : 'Định vị toàn quốc'}
            onClick={() => handleChange('area', 'all')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="7" />
              <line x1="12" y1="1" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="5" y1="12" x2="1" y2="12" />
              <line x1="23" y1="12" x2="19" y2="12" />
              <circle cx="12" cy="12" r="2" fill="#EA580C" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Ngành nghề (Industry Dropdown) */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <FaBriefcase size={11} className="me-1 text-secondary" />
          <span>Ngành nghề</span>
          {filters.category && filters.category !== 'all' && <span className="filter-dot-active" />}
        </label>
        <div className="job-filter-select-wrap">
          <select
            className={`job-filter-select ${filters.category && filters.category !== 'all' ? 'job-filter-select--active' : ''}`}
            value={filters.category || 'all'}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="all">Tất cả ngành nghề</option>
            <option value="cntt">Công nghệ thông tin (IT)</option>
            <option value="kinh-doanh">Kinh doanh / Bán hàng</option>
            <option value="marketing">Marketing / Truyền thông</option>
            <option value="tai-chinh">Tài chính / Ngân hàng</option>
            <option value="ke-toan">Kế toán / Kiểm toán</option>
            <option value="nhan-su">Nhân sự / Hành chính / CSKH</option>
            <option value="thiet-ke">Thiết kế / Sáng tạo</option>
            <option value="san-xuat">Sản xuất / Vận hành</option>
          </select>
          <span className="job-filter-caret">▼</span>
        </div>
      </div>

      {/* 4. Mức lương (Salary Dropdown) */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <FaMoneyBillWave size={11} className="me-1 text-secondary" />
          <span>Mức thu nhập</span>
          {filters.salary && filters.salary !== 'all' && <span className="filter-dot-active" />}
        </label>
        <div className="job-filter-select-wrap">
          <select
            className={`job-filter-select ${filters.salary && filters.salary !== 'all' ? 'job-filter-select--active' : ''}`}
            value={filters.salary || 'all'}
            onChange={(e) => handleChange('salary', e.target.value)}
          >
            <option value="all">Tất cả mức lương</option>
            <option value="under-10">Dưới 10 triệu</option>
            <option value="10-20">10 - 20 triệu</option>
            <option value="20-30">20 - 30 triệu</option>
            <option value="over-30">Trên 30 triệu</option>
            <option value="deal">Thỏa thuận</option>
          </select>
          <span className="job-filter-caret">▼</span>
        </div>
      </div>

      {/* 5. Kinh nghiệm (Experience Dropdown) */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <FaUserGraduate size={11} className="me-1 text-secondary" />
          <span>Kinh nghiệm</span>
          {filters.experience && filters.experience !== 'all' && <span className="filter-dot-active" />}
        </label>
        <div className="job-filter-select-wrap">
          <select
            className={`job-filter-select ${filters.experience && filters.experience !== 'all' ? 'job-filter-select--active' : ''}`}
            value={filters.experience || 'all'}
            onChange={(e) => handleChange('experience', e.target.value)}
          >
            <option value="all">Tất cả kinh nghiệm</option>
            <option value="none">Chưa có kinh nghiệm</option>
            <option value="1-year">Dưới 1 năm</option>
            <option value="2-years">1 - 2 năm</option>
            <option value="3-years">2 - 5 năm</option>
            <option value="5-plus">Trên 5 năm</option>
          </select>
          <span className="job-filter-caret">▼</span>
        </div>
      </div>

      {/* 6. Loại hình làm việc (Employment Type) */}
      <div className="filter-group mb-1">
        <label className="filter-label">
          <FaClock size={11} className="me-1 text-secondary" />
          <span>Loại hình làm việc</span>
          {filters.jobType && filters.jobType !== 'all' && <span className="filter-dot-active" />}
        </label>
        <div className="job-filter-select-wrap">
          <select
            className={`job-filter-select ${filters.jobType && filters.jobType !== 'all' ? 'job-filter-select--active' : ''}`}
            value={filters.jobType || 'all'}
            onChange={(e) => handleChange('jobType', e.target.value)}
          >
            <option value="all">Tất cả loại hình</option>
            <option value="full-time">Toàn thời gian (Full time)</option>
            <option value="part-time">Bán thời gian (Part time)</option>
            <option value="intern">Thực tập sinh (Internship)</option>
          </select>
          <span className="job-filter-caret">▼</span>
        </div>
      </div>
    </div>
  );
}