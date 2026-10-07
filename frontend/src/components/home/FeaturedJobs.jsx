import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaInfoCircle,
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
  'Tây Hồ',
  'Cầu Giấy',
  'Thanh Xuân',
  'Hà Đông',
  'Nam Từ Liêm',
  'Bắc Từ Liêm',
];

export default function FeaturedJobs() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ha-noi');
  const [selectedDistrict, setSelectedDistrict] = useState('Hà Nội');
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
        limit: 9,
        type: activeTab,
        area: selectedLocation,
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadJobs();
  }, [activeTab, selectedLocation, selectedDistrict]);

  const handleScrollChips = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -240 : 240,
        behavior: 'smooth',
      });
    }
  };

  const handleDistrictClick = (chip) => {
    if (selectedDistrict === chip) {
      setSelectedDistrict(''); // Bấm lần 2 để bỏ chọn
    } else {
      setSelectedDistrict(chip);
    }
  };

  const handleCloseTip = () => {
    setShowTip(false);
    sessionStorage.setItem('jn_hide_tip', 'true');
  };

  return (
    <section className="featured-jobs-section py-5">
      <div className="container-app">
        {/* Hàng 1: Tiêu đề, Tab pill & Link xem tất cả */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <h2 className="section-title">Việc làm nổi bật</h2>
            {/* Nhóm tab pill */}
            <div className="tab-pill-group">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`tab-pill-btn ${activeTab === tab.id ? 'tab-pill-btn--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link to="/jobs" className="view-all-link">
              Xem tất cả
            </Link>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="circle-nav-btn"
                onClick={loadJobs}
                aria-label="Tải lô việc làm trước"
              >
                <FaChevronLeft size={13} />
              </button>
              <button
                type="button"
                className="circle-nav-btn circle-nav-btn--active"
                onClick={loadJobs}
                aria-label="Tải lô việc làm sau"
              >
                <FaChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Hàng 2: Bộ lọc địa điểm & chip quận cuộn ngang */}
        <div className="filter-chips-row mb-4">
          <div className="location-select-wrap">
            <FaFilter className="text-muted ms-2" size={13} />
            <select
              className="location-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">Lọc theo: Tất cả</option>
              <option value="ha-noi">Lọc theo: Hà Nội</option>
              <option value="ho-chi-minh">Lọc theo: TP. HCM</option>
              <option value="da-nang">Lọc theo: Đà Nẵng</option>
            </select>
          </div>

          {/* Dải chip quận với 2 nút mũi tên cuộn ngang */}
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
                const isSelected = selectedDistrict === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    className={`chip district-chip ${isSelected ? 'district-chip--selected' : ''}`}
                    onClick={() => handleDistrictClick(chip)}
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

        {/* Hộp gợi ý (tùy chọn theo Mục 7.8) */}
        {showTip && (
          <div className="tip-box mb-4">
            <FaInfoCircle className="text-primary me-2 shrink-0" size={15} />
            <span className="small text-muted flex-grow-1">
              Gợi ý: Di chuột vào tiêu đề việc làm để xem thêm thông tin chi tiết
            </span>
            <button
              type="button"
              className="btn-close-tip"
              onClick={handleCloseTip}
              aria-label="Đóng gợi ý"
            >
              <FaTimes size={12} />
            </button>
          </div>
        )}

        {/* Lưới 9 thẻ việc làm */}
        {loading ? (
          <LoadingGrid count={9} />
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
            description="Hãy thử chọn khu vực hoặc loại hình làm việc khác."
          />
        ) : (
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
