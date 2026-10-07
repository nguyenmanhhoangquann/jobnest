import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaSortAmountDown } from 'react-icons/fa';
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

  // Cập nhật URL khi người dùng thay đổi bộ lọc
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
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

  return (
    <div className="job-list-page py-4">
      {/* Container mở rộng sát 2 bên mép chuẩn TopCV */}
      <div className="container-fluid px-3 px-xl-5">
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

          {/* Cột phải: Danh sách việc làm mở rộng tối đa, thoáng đãng */}
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
