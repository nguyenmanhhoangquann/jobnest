import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaTimes, FaSortAmountDown } from 'react-icons/fa';
import jobApi from '../api/jobApi.js';
import JobCard from '../components/job/JobCard.jsx';
import Pagination from '../components/common/Pagination.jsx';
import LoadingGrid from '../components/common/Loading.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function JobList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Đọc filters trực tiếp từ URL query params
  const filters = useMemo(() => {
    return {
      keyword: searchParams.get('keyword') || '',
      category: searchParams.get('category') || 'all',
      area: searchParams.get('area') || 'all',
      salary: searchParams.get('salary') || 'all',
      experience: searchParams.get('experience') || 'all',
      jobType: searchParams.get('jobType') || 'all',
      sort: searchParams.get('sort') || 'newest',
      page: parseInt(searchParams.get('page') || '1', 10),
    };
  }, [searchParams]);

  const [searchInput, setSearchInput] = useState(filters.keyword);
  useEffect(() => {
    setSearchInput(filters.keyword);
  }, [filters.keyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ keyword: searchInput, page: 1 });
  };

  // Khóa cuộn trang và lắng nghe phím ESC khi mở Offcanvas
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showAllFilters) {
        setShowAllFilters(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (showAllFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showAllFilters]);

  // Cập nhật URL khi người dùng thay đổi bộ lọc
  const updateFilters = (newFilters) => {
    const next = { ...filters, ...newFilters };
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, val]) => {
      if (val && val !== 'all' && val !== '') {
        params.set(key, val);
      }
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
    const el = document.getElementById('jobs-results-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    params.set('page', 1);
    setSearchParams(params);
  };

  // Tải danh sách công việc mỗi khi URL params thay đổi
  useEffect(() => {
    setLoading(true);
    jobApi
      .getJobs({
        keyword: filters.keyword,
        category: filters.category,
        area: filters.area,
        salary: filters.salary,
        experience: filters.experience,
        jobType: filters.jobType,
        sort: filters.sort,
        page: filters.page,
        size: 10,
      })
      .then((data) => {
        setJobs(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [filters]);

  // Danh sách chip lọc đang kích hoạt
  const activeChips = useMemo(() => {
    const list = [];
    if (filters.keyword && filters.keyword.trim()) {
      list.push({ key: 'keyword', label: `"${filters.keyword}"`, clearVal: '' });
    }
    if (filters.area && filters.area !== 'all') {
      const map = {
        'ha-noi': 'Hà Nội',
        'ho-chi-minh': 'TP. HCM',
        'da-nang': 'Đà Nẵng',
        'hai-phong': 'Hải Phòng',
        'can-tho': 'Cần Thơ',
      };
      list.push({ key: 'area', label: map[filters.area] || filters.area, clearVal: 'all' });
    }
    if (filters.category && filters.category !== 'all') {
      const map = {
        cntt: 'CNTT',
        'kinh-doanh': 'Kinh doanh',
        marketing: 'Marketing',
        'tai-chinh': 'Tài chính',
        'ke-toan': 'Kế toán',
        'nhan-su': 'Nhân sự',
        'thiet-ke': 'Thiết kế',
        'san-xuat': 'Sản xuất',
      };
      list.push({ key: 'category', label: map[filters.category] || filters.category, clearVal: 'all' });
    }
    if (filters.salary && filters.salary !== 'all') {
      const map = {
        'under-10': '< 10 triệu',
        '10-20': '10 - 20 triệu',
        '20-30': '20 - 30 triệu',
        'over-30': '> 30 triệu',
        deal: 'Thỏa thuận',
      };
      list.push({ key: 'salary', label: map[filters.salary] || filters.salary, clearVal: 'all' });
    }
    if (filters.experience && filters.experience !== 'all') {
      const map = {
        none: 'Chưa có kn',
        '1-year': '< 1 năm kn',
        '2-years': '1 - 2 năm kn',
        '3-years': '2 - 5 năm kn',
        '5-plus': '> 5 năm kn',
      };
      list.push({ key: 'experience', label: map[filters.experience] || filters.experience, clearVal: 'all' });
    }
    if (filters.jobType && filters.jobType !== 'all') {
      const map = {
        'full-time': 'Toàn thời gian',
        'part-time': 'Bán thời gian',
        intern: 'Thực tập sinh',
      };
      list.push({ key: 'jobType', label: map[filters.jobType] || filters.jobType, clearVal: 'all' });
    }
    return list;
  }, [filters]);

  return (
    <div className="companies-page-root">
      {/* 1. HERO SECTION (Title + Search Bar - scrolls away naturally) */}
      <section className="builtin-companies-hero-wrap">
        <div className="builtin-hero-inner">
          <h1 className="builtin-hero-title">
            Khám phá cơ hội việc làm chất lượng cao
          </h1>

          {/* Thanh tìm kiếm việc làm (Search Bar) */}
          <form className="builtin-search-bar" onSubmit={handleSearchSubmit}>
            <FaSearch size={16} className="builtin-search-icon" />
            <input
              type="text"
              className="builtin-search-input"
              placeholder="Tìm việc làm theo chức danh, kỹ năng, công ty..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className="builtin-search-clear"
                onClick={() => {
                  setSearchInput('');
                  updateFilters({ keyword: '', page: 1 });
                }}
                aria-label="Xóa từ khóa"
              >
                ✕
              </button>
            )}
            <button type="submit" className="builtin-search-submit-btn">
              Tìm việc
            </button>
          </form>
        </div>
      </section>

      {/* 2. STICKY FILTER BAR (Cố định các button đi theo khi lướt xuống) */}
      <div className="builtin-filter-sticky-bar">
        <div className="builtin-hero-inner">
          {/* Thanh lọc chuẩn Built In: Địa điểm, Ngành nghề, Mức lương hiện trước */}
          <div className="builtin-filter-bar">
            {/* Địa điểm (Location Box) */}
            <div className={`builtin-location-box ${filters.area !== 'all' ? 'builtin-location-box--active' : ''}`}>
              <div className="builtin-location-content">
                <span className="builtin-location-label">ĐỊA ĐIỂM</span>
                <select
                  className="builtin-location-select"
                  value={filters.area}
                  onChange={(e) => updateFilters({ area: e.target.value, page: 1 })}
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
                className="builtin-gps-btn"
                title={filters.area !== 'all' ? 'Đặt lại toàn quốc' : 'Định vị toàn quốc'}
                onClick={() => updateFilters({ area: 'all', page: 1 })}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="7" />
                  <line x1="12" y1="1" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="5" y1="12" x2="1" y2="12" />
                  <line x1="23" y1="12" x2="19" y2="12" />
                  <circle cx="12" cy="12" r="2" fill="#EA580C" />
                </svg>
              </button>
            </div>

            {/* Ngành nghề (Category Pill) */}
            <div className={`builtin-pill-wrap ${filters.category !== 'all' ? 'builtin-pill-wrap--active' : ''}`}>
              <select
                className="builtin-pill-select"
                value={filters.category}
                onChange={(e) => updateFilters({ category: e.target.value, page: 1 })}
              >
                <option value="all">Ngành nghề</option>
                <option value="cntt">Công nghệ thông tin (IT)</option>
                <option value="kinh-doanh">Kinh doanh - Bán hàng</option>
                <option value="marketing">Marketing - Truyền thông</option>
                <option value="tai-chinh">Tài chính - Ngân hàng</option>
                <option value="ke-toan">Kế toán - Kiểm toán</option>
                <option value="nhan-su">Nhân sự - Hành chính</option>
                <option value="thiet-ke">Thiết kế - Sáng tạo</option>
                <option value="san-xuat">Sản xuất - Vận hành</option>
              </select>
              <span className="builtin-pill-caret">▼</span>
            </div>

            {/* Mức lương (Salary Pill) */}
            <div className={`builtin-pill-wrap ${filters.salary !== 'all' ? 'builtin-pill-wrap--active' : ''}`}>
              <select
                className="builtin-pill-select"
                value={filters.salary}
                onChange={(e) => updateFilters({ salary: e.target.value, page: 1 })}
              >
                <option value="all">Mức lương</option>
                <option value="under-10">Dưới 10 triệu</option>
                <option value="10-20">10 - 20 triệu</option>
                <option value="20-30">20 - 30 triệu</option>
                <option value="over-30">Trên 30 triệu</option>
                <option value="deal">Thỏa thuận</option>
              </select>
              <span className="builtin-pill-caret">▼</span>
            </div>

            {/* Phân cách đứng */}
            <div className="builtin-divider" />

            {/* Tất cả bộ lọc (Mở Offcanvas Drawer chuẩn Built In) */}
            <button
              type="button"
              className={`builtin-all-filters-btn ${activeChips.length > 0 ? 'builtin-all-filters-btn--active' : ''}`}
              onClick={() => setShowAllFilters(true)}
              title="Mở tất cả bộ lọc"
            >
              <span>Tất cả bộ lọc</span>
              {activeChips.length > 0 && (
                <span
                  className="badge bg-white text-danger font-monospace fw-bold rounded-pill"
                  style={{ fontSize: '10px', padding: '2px 6px' }}
                >
                  +{activeChips.length}
                </span>
              )}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </button>

            {/* Xóa lọc (Reset) */}
            <button
              type="button"
              className="builtin-reset-btn"
              onClick={handleResetFilters}
            >
              Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {/* 2. OFFCANVAS ALL FILTERS DRAWER (Chuẩn phong cách BuiltIn.com/jobs) */}
      {showAllFilters && (
        <div
          className="builtin-offcanvas-backdrop"
          onClick={() => setShowAllFilters(false)}
        />
      )}

      <div
        className={`builtin-offcanvas ${showAllFilters ? 'builtin-offcanvas--open' : ''}`}
        aria-hidden={!showAllFilters}
      >
        {/* Header */}
        <div className="builtin-offcanvas-header">
          <h2 className="builtin-offcanvas-title">Tất cả bộ lọc</h2>
          <button
            type="button"
            className="builtin-offcanvas-close"
            onClick={() => setShowAllFilters(false)}
            aria-label="Đóng bộ lọc"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="builtin-offcanvas-body">
          {/* Summary đang chọn */}
          {activeChips.length > 0 && (
            <div className="p-3 rounded-3 mb-3" style={{ background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-bold text-dark">
                  Đang chọn ({activeChips.length} tiêu chí)
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none p-0 text-danger small fw-semibold"
                  onClick={handleResetFilters}
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {activeChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="badge bg-white text-dark border d-inline-flex align-items-center gap-1 py-1 px-2"
                    style={{ fontSize: '11px', cursor: 'pointer' }}
                    onClick={() => updateFilters({ [chip.key]: chip.clearVal, page: 1 })}
                    title="Nhấn để gỡ"
                  >
                    {chip.label}
                    <FaTimes size={8} className="text-muted" />
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 1. Từ khóa tìm kiếm */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Từ khóa tìm kiếm</span>
              {filters.keyword && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ keyword: '', page: 1 })}
                >
                  Xóa
                </button>
              )}
            </div>
            <div className="job-filter-input-wrap">
              <FaSearch size={12} className="text-muted ms-2.5 flex-shrink-0" />
              <input
                type="text"
                className="job-filter-input"
                placeholder="Chức danh, kỹ năng (Java, React...), công ty..."
                value={filters.keyword}
                onChange={(e) => updateFilters({ keyword: e.target.value, page: 1 })}
              />
              {filters.keyword && (
                <button
                  type="button"
                  className="job-filter-clear-btn"
                  onClick={() => updateFilters({ keyword: '', page: 1 })}
                  aria-label="Xóa từ khóa"
                >
                  <FaTimes size={10} />
                </button>
              )}
            </div>
          </div>

          {/* 2. Kinh nghiệm làm việc */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Kinh nghiệm</span>
              {filters.experience !== 'all' && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ experience: 'all', page: 1 })}
                >
                  Đặt lại
                </button>
              )}
            </div>
            <div className="builtin-offcanvas-radio-list">
              {[
                { value: 'all', label: 'Tất cả kinh nghiệm' },
                { value: 'none', label: 'Chưa có kinh nghiệm' },
                { value: '1-year', label: 'Dưới 1 năm (Entry Level)' },
                { value: '2-years', label: '1 - 2 năm (Junior)' },
                { value: '3-years', label: '2 - 5 năm (Mid-level)' },
                { value: '5-plus', label: 'Trên 5 năm (Senior)' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`builtin-offcanvas-radio-item ${filters.experience === opt.value ? 'builtin-offcanvas-radio-item--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="filter_experience"
                    value={opt.value}
                    checked={filters.experience === opt.value}
                    onChange={() => updateFilters({ experience: opt.value, page: 1 })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Hình thức làm việc */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Hình thức làm việc</span>
              {filters.jobType !== 'all' && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ jobType: 'all', page: 1 })}
                >
                  Đặt lại
                </button>
              )}
            </div>
            <div className="builtin-offcanvas-radio-list">
              {[
                { value: 'all', label: 'Tất cả hình thức' },
                { value: 'full-time', label: 'Toàn thời gian (Full-time)' },
                { value: 'part-time', label: 'Bán thời gian (Part-time)' },
                { value: 'intern', label: 'Thực tập sinh (Internship)' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`builtin-offcanvas-radio-item ${filters.jobType === opt.value ? 'builtin-offcanvas-radio-item--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="filter_jobType"
                    value={opt.value}
                    checked={filters.jobType === opt.value}
                    onChange={() => updateFilters({ jobType: opt.value, page: 1 })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Mức thu nhập */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Mức thu nhập</span>
              {filters.salary !== 'all' && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ salary: 'all', page: 1 })}
                >
                  Đặt lại
                </button>
              )}
            </div>
            <div className="builtin-offcanvas-radio-list">
              {[
                { value: 'all', label: 'Tất cả mức lương' },
                { value: 'under-10', label: 'Dưới 10 triệu' },
                { value: '10-20', label: '10 - 20 triệu' },
                { value: '20-30', label: '20 - 30 triệu' },
                { value: 'over-30', label: 'Trên 30 triệu' },
                { value: 'deal', label: 'Thỏa thuận' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`builtin-offcanvas-radio-item ${filters.salary === opt.value ? 'builtin-offcanvas-radio-item--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="filter_salary"
                    value={opt.value}
                    checked={filters.salary === opt.value}
                    onChange={() => updateFilters({ salary: opt.value, page: 1 })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Ngành nghề */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Ngành nghề</span>
              {filters.category !== 'all' && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ category: 'all', page: 1 })}
                >
                  Đặt lại
                </button>
              )}
            </div>
            <div className="builtin-offcanvas-radio-list">
              {[
                { value: 'all', label: 'Tất cả ngành nghề' },
                { value: 'cntt', label: 'Công nghệ thông tin (IT)' },
                { value: 'kinh-doanh', label: 'Kinh doanh - Bán hàng' },
                { value: 'marketing', label: 'Marketing - Truyền thông' },
                { value: 'tai-chinh', label: 'Tài chính - Ngân hàng' },
                { value: 'ke-toan', label: 'Kế toán - Kiểm toán' },
                { value: 'nhan-su', label: 'Nhân sự - Hành chính' },
                { value: 'thiet-ke', label: 'Thiết kế - Sáng tạo' },
                { value: 'san-xuat', label: 'Sản xuất - Vận hành' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`builtin-offcanvas-radio-item ${filters.category === opt.value ? 'builtin-offcanvas-radio-item--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="filter_category"
                    value={opt.value}
                    checked={filters.category === opt.value}
                    onChange={() => updateFilters({ category: opt.value, page: 1 })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. Địa điểm */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Địa điểm</span>
              {filters.area !== 'all' && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ area: 'all', page: 1 })}
                >
                  Đặt lại
                </button>
              )}
            </div>
            <div className="builtin-offcanvas-radio-list">
              {[
                { value: 'all', label: 'Toàn quốc (Tất cả)' },
                { value: 'ha-noi', label: 'Hà Nội' },
                { value: 'ho-chi-minh', label: 'TP. Hồ Chí Minh' },
                { value: 'da-nang', label: 'Đà Nẵng' },
                { value: 'hai-phong', label: 'Hải Phòng' },
                { value: 'can-tho', label: 'Cần Thơ' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`builtin-offcanvas-radio-item ${filters.area === opt.value ? 'builtin-offcanvas-radio-item--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="filter_area"
                    value={opt.value}
                    checked={filters.area === opt.value}
                    onChange={() => updateFilters({ area: opt.value, page: 1 })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer (Reset / View Results) */}
        <div className="builtin-offcanvas-footer">
          <button
            type="button"
            className="btn btn-link text-uppercase text-muted fw-bold p-0 text-decoration-none"
            style={{ fontSize: '13px', letterSpacing: '0.04em' }}
            onClick={handleResetFilters}
          >
            Xóa tất cả
          </button>
          <button
            type="button"
            className="builtin-offcanvas-submit-btn"
            onClick={() => setShowAllFilters(false)}
          >
            Xem kết quả ({totalElements})
          </button>
        </div>
      </div>

      {/* 3. MAIN JOBS LISTING SECTION */}
      <div className="container py-4" id="jobs-results-anchor" style={{ maxWidth: '1280px' }}>
        {/* Active chips strip */}
        {activeChips.length > 0 && (
          <div className="filter-active-chips-wrap mb-3">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                className="filter-active-chip"
                onClick={() => updateFilters({ [chip.key]: chip.clearVal, page: 1 })}
                title={`Bỏ lọc ${chip.label}`}
              >
                <span>{chip.label}</span>
                <FaTimes size={9} />
              </button>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-link text-decoration-none text-muted p-0 ms-2 small"
              onClick={handleResetFilters}
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* Header thanh kết quả & sắp xếp */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pb-3 mb-3 border-bottom gap-2">
          <span className="text-muted fs-6">
            Tìm thấy <strong className="text-dark">{totalElements}</strong> việc làm phù hợp
          </span>

          <div className="d-flex align-items-center gap-2">
            <FaSortAmountDown size={13} className="text-muted" />
            <span className="small text-muted text-nowrap">Sắp xếp:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: '160px' }}
              value={filters.sort}
              onChange={handleSortChange}
            >
              <option value="newest">Mới nhất</option>
              <option value="salary_desc">Lương cao nhất</option>
              <option value="salary_asc">Lương thấp nhất</option>
            </select>
          </div>
        </div>

        {/* Trạng thái Loading / Danh sách / Empty */}
        {loading ? (
          <LoadingGrid count={6} />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="Không tìm thấy việc làm phù hợp"
            description="Hãy thử điều chỉnh bộ lọc hoặc xóa các từ khóa tìm kiếm."
            actionText="Xóa tất cả bộ lọc"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="d-flex flex-column gap-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} variant="search-item" />
            ))}
          </div>
        )}

        {/* Phân trang chuẩn */}
        <div className="mt-4">
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
