import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaSlidersH,
  FaLightbulb,
  FaTimes,
} from 'react-icons/fa';
import jobApi from '../../api/jobApi.js';
import JobCard from '../job/JobCard.jsx';
import LoadingGrid from '../common/Loading.jsx';
import EmptyState from '../common/EmptyState.jsx';

const TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'FULL_TIME', label: 'Full time' },
  { id: 'PART_TIME', label: 'Part time' },
  { id: 'INTERN', label: 'Thực tập' },
];

const DISTRICT_CHIPS = [
  'Hà Nội',
  'Ba Đình',
  'Hoàn Kiếm',
  'Hai Bà Trưng',
  'Đống Đa',
  'Cầu Giấy',
  'Thanh Xuân',
  'Hà Đông',
  'Nam Từ Liêm',
  'Bắc Từ Liêm',
];

export default function FeaturedJobs() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('Hà Nội');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showTip, setShowTip] = useState(
    () => sessionStorage.getItem('jn_hide_tip') !== 'true'
  );

  const scrollRef = useRef(null);

  const loadJobs = () => {
    setLoading(true);
    setError(false);
    jobApi
      .getRandomJobs({
        limit: 6,
        type: activeTab,
        area: selectedLocation === 'Hà Nội' ? 'ha-noi' : selectedLocation,
      })
      .then((data) => {
        setJobs((data || []).slice(0, 6));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadJobs();
  }, [activeTab, selectedLocation]);

  const handleScrollChips = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth',
      });
    }
  };

  const handleCloseTip = () => {
    setShowTip(false);
    sessionStorage.setItem('jn_hide_tip', 'true');
  };

  return (
    <section className="featured-jobs-section py-5">
      <div className="container-app">
        {/* Hàng 1: Tiêu đề, Tab gốc & Nút điều hướng */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <h2 className="topcv-featured-title mb-0">Việc làm nổi bật</h2>

            {/* Dải tab bo tròn nguyên bản: Tất cả, Full time, Part time, Thực tập */}
            <div className="topcv-tab-group">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`topcv-tab-btn ${activeTab === tab.id ? 'topcv-tab-btn--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link to="/jobs" className="topcv-view-all-link">
              Xem tất cả →
            </Link>
            <div className="d-flex gap-1">
              <button
                type="button"
                className="circle-nav-btn circle-nav-btn--sm"
                onClick={loadJobs}
                aria-label="Tải lô trước"
              >
                <FaChevronLeft size={11} />
              </button>
              <button
                type="button"
                className="circle-nav-btn circle-nav-btn--sm"
                onClick={loadJobs}
                aria-label="Tải lô sau"
              >
                <FaChevronRight size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Hàng 2: Bộ lọc địa điểm & Dải chip quận */}
        <div className="topcv-filter-row mb-3">
          <div className="topcv-filter-select-wrap">
            <FaSlidersH className="text-muted ms-2 me-1" size={13} />
            <select
              className="topcv-filter-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="Hà Nội">Lọc theo: Hà Nội</option>
              <option value="TP. HCM">Lọc theo: TP. HCM</option>
              <option value="Đà Nẵng">Lọc theo: Đà Nẵng</option>
              <option value="all">Lọc theo: Tất cả</option>
            </select>
          </div>

          <div className="chips-scroll-container">
            <button
              type="button"
              className="chip-scroll-arrow chip-scroll-arrow--left"
              onClick={() => handleScrollChips('left')}
              aria-label="Cuộn sang trái"
            >
              <FaChevronLeft size={10} />
            </button>

            <div className="chips-scroll-track" ref={scrollRef}>
              {DISTRICT_CHIPS.map((chip) => {
                const isSelected = selectedLocation === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    className={`topcv-chip ${isSelected ? 'topcv-chip--selected' : ''}`}
                    onClick={() => setSelectedLocation(chip)}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="chip-scroll-arrow chip-scroll-arrow--right"
              onClick={() => handleScrollChips('right')}
              aria-label="Cuộn sang phải"
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>

        {/* Hàng 3: Hộp gợi ý nền xanh phấn tinh tế */}
        {showTip && (
          <div className="topcv-tip-box mb-4">
            <div className="d-flex align-items-center gap-2">
              <FaLightbulb className="text-primary flex-shrink-0" size={14} />
              <span className="small text-secondary">
                <strong>Gợi ý:</strong> Di chuột vào tiêu đề việc làm để xem thêm thông tin chi tiết
              </span>
            </div>
            <button
              type="button"
              className="btn-close-tip ms-auto"
              onClick={handleCloseTip}
              aria-label="Đóng gợi ý"
            >
              <FaTimes size={12} />
            </button>
          </div>
        )}

        {/* Hàng 4: Lưới 6 thẻ việc làm (3 cột x 2 hàng) */}
        {loading ? (
          <LoadingGrid count={6} />
        ) : error ? (
          <div className="text-center py-5">
            <p className="text-danger mb-3">Không tải được dữ liệu việc làm.</p>
            <button type="button" className="btn btn-brand" onClick={loadJobs}>
              Thử lại
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            title="Chưa có việc làm phù hợp"
            description="Hãy thử chọn khu vực hoặc tiêu chí khác."
          />
        ) : (
          <div className="row g-3">
            {jobs.map((job) => (
              <div key={job.id} className="col-12 col-md-6 col-lg-4">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
