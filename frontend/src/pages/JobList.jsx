import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaSortAmountDown, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import jobApi from '../api/jobApi.js';
import JobCard from '../components/job/JobCard.jsx';
import JobFilterSidebar from '../components/job/JobFilterSidebar.jsx';
import Pagination from '../components/common/Pagination.jsx';
import LoadingGrid from '../components/common/Loading.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function JobList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [localKeyword, setLocalKeyword] = useState('');

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

  useEffect(() => {
    setLocalKeyword(filters.keyword);
  }, [filters.keyword]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ keyword: localKeyword, page: 1 });
    const el = document.getElementById('jobs-results-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="job-list-page">
      {/* 1. HERO SEARCH BANNER (Himalayas Style) */}
      <section className="jobs-hero-box">
        <div className="container" style={{ maxWidth: '860px' }}>
          <h1 className="jobs-hero-title">
            Tìm việc làm mơ ước cùng <span className="highlight-orange">JobNest</span>
          </h1>
          <p className="jobs-hero-subtitle">
            Khám phá cơ hội nghề nghiệp chất lượng cao từ các doanh nghiệp uy tín trên toàn quốc.
          </p>

          <form className="itviec-search-bar mx-auto" style={{ maxWidth: '820px' }} onSubmit={handleSearchSubmit}>
            <div className="itviec-search-location">
              <FaMapMarkerAlt size={15} className="text-secondary flex-shrink-0" />
              <select
                className="itviec-search-location-select"
                value={filters.area}
                onChange={(e) => updateFilters({ area: e.target.value, page: 1 })}
              >
                <option value="all">Tất cả thành phố</option>
                <option value="ha-noi">Hà Nội</option>
                <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
                <option value="da-nang">Đà Nẵng</option>
              </select>
              <span className="itviec-search-location-caret">▼</span>
            </div>

            <input
              type="text"
              className="itviec-search-input"
              placeholder="Nhập từ khóa kỹ năng (Java, iOS...), chức danh, công ty..."
              value={localKeyword}
              onChange={(e) => setLocalKeyword(e.target.value)}
            />

            <button type="submit" className="itviec-search-btn">
              <FaSearch size={14} />
              <span>Tìm kiếm</span>
            </button>
          </form>

          {/* Popular Search Text Links */}
          <div className="jobs-trending-bar">
            <span className="jobs-trending-label">Tìm kiếm phổ biến:</span>
            {['Toshiba', 'FPT', 'Java', 'ReactJS', 'Embedded', 'C++', 'Marketing', 'Kinh doanh', 'Hà Nội', 'TP.HCM'].map(
              (hint, idx, arr) => (
                <React.Fragment key={hint}>
                  <button
                    type="button"
                    className="jobs-trending-item"
                    onClick={() => {
                      setLocalKeyword(hint);
                      updateFilters({ keyword: hint, page: 1 });
                      const el = document.getElementById('jobs-results-anchor');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {hint}
                  </button>
                  {idx < arr.length - 1 && <span className="jobs-trending-dot">·</span>}
                </React.Fragment>
              )
            )}
          </div>
        </div>
      </section>

      {/* 2. MAIN JOBS LISTING SECTION */}
      <div className="container-fluid px-3 px-xl-5 py-4" id="jobs-results-anchor">
        {/* Nút bật/tắt bộ lọc trên mobile */}
        <div className="d-lg-none mb-3">
          <button
            type="button"
            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
          >
            <FaFilter size={14} />
            {showMobileFilter ? 'Đóng bộ lọc' : 'Mở bộ lọc tìm kiếm'}
          </button>
        </div>

        <div className="row g-4">
          {/* Cột trái: Bộ lọc sát bên trái, bề ngang gọn gàng 270px */}
          <div className={`col-lg-auto job-filter-sidebar-col ${showMobileFilter ? 'd-block' : 'd-none d-lg-block'}`}>
            <JobFilterSidebar
              filters={filters}
              onChange={updateFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Cột phải: Danh sách việc làm phong cách Himalayas */}
          <div className="col-lg flex-grow-1 min-w-0">
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
      </div>
    </div>
  );
}
