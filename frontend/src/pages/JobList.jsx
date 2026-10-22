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

  // Kiểm tra xem các bộ lọc mở rộng (trong "Tất cả bộ lọc") có đang được kích hoạt không
  const hasRemainingFilters = Boolean(
    filters.keyword ||
    (filters.experience && filters.experience !== 'all') ||
    (filters.jobType && filters.jobType !== 'all')
  );

  const remainingActiveCount =
    (filters.keyword ? 1 : 0) +
    (filters.experience && filters.experience !== 'all' ? 1 : 0) +
    (filters.jobType && filters.jobType !== 'all' ? 1 : 0);

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
    setShowAllFilters(false);
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

  // Danh sách chip lọc đang kích hoạt để người dùng dễ theo dõi và gỡ bỏ
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
      {/* 1. HERO SECTION (Built In Style - Thanh lọc ngang chuẩn trang Công ty) */}
      <section className="builtin-companies-hero-wrap">
        <div className="builtin-hero-inner">
          <h1 className="builtin-hero-title">
            Khám phá cơ hội việc làm chất lượng cao
          </h1>

          {/* Thanh lọc chuẩn Built In: Địa điểm, Ngành nghề, Mức lương hiện trước */}
          <div className="builtin-filter-bar">
            {/* Địa điểm (Location Box) */}
            <div className="builtin-location-box">
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

            {/* Tất cả bộ lọc (All Filters Button) */}
            <button
              type="button"
              className={`builtin-all-filters-btn ${showAllFilters || hasRemainingFilters ? 'builtin-all-filters-btn--active' : ''}`}
              onClick={() => setShowAllFilters(!showAllFilters)}
              title="Tìm kiếm từ khóa & mở rộng bộ lọc"
            >
              <span>Tất cả bộ lọc</span>
              {remainingActiveCount > 0 && (
                <span
                  className="badge bg-warning text-dark font-monospace fw-bold"
                  style={{ fontSize: '10px', padding: '2px 5px', borderRadius: '4px' }}
                >
                  {remainingActiveCount}
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

          {/* Ngăn kéo chứa các bộ lọc còn lại (Từ khóa, Kinh nghiệm, Hình thức làm việc) */}
          {(showAllFilters || hasRemainingFilters) && (
            <div className="builtin-keyword-drawer flex-wrap gap-3">
              {/* Từ khóa */}
              <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ minWidth: '240px' }}>
                <FaSearch size={14} className="text-secondary flex-shrink-0" />
                <input
                  type="text"
                  className="builtin-keyword-input"
                  placeholder="Nhập từ khóa kỹ năng (Java, React...), chức danh, công ty..."
                  value={filters.keyword}
                  onChange={(e) => updateFilters({ keyword: e.target.value, page: 1 })}
                />
                {filters.keyword && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted p-0 me-1 text-decoration-none"
                    onClick={() => updateFilters({ keyword: '', page: 1 })}
                    title="Xóa từ khóa"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Kinh nghiệm */}
              <div className="builtin-drawer-field">
                <span className="builtin-drawer-label">Kinh nghiệm:</span>
                <select
                  className="builtin-drawer-select"
                  value={filters.experience}
                  onChange={(e) => updateFilters({ experience: e.target.value, page: 1 })}
                >
                  <option value="all">Tất cả kinh nghiệm</option>
                  <option value="none">Chưa có kinh nghiệm</option>
                  <option value="1-year">Dưới 1 năm</option>
                  <option value="2-years">1 - 2 năm</option>
                  <option value="3-years">2 - 5 năm</option>
                  <option value="5-plus">Trên 5 năm</option>
                </select>
              </div>

              {/* Loại hình làm việc */}
              <div className="builtin-drawer-field">
                <span className="builtin-drawer-label">Hình thức:</span>
                <select
                  className="builtin-drawer-select"
                  value={filters.jobType}
                  onChange={(e) => updateFilters({ jobType: e.target.value, page: 1 })}
                >
                  <option value="all">Tất cả hình thức</option>
                  <option value="full-time">Toàn thời gian</option>
                  <option value="part-time">Bán thời gian</option>
                  <option value="intern">Thực tập sinh</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. MAIN JOBS LISTING SECTION */}
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
