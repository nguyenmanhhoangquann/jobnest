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
  { id: 'FULL_TIME', label: 'Toàn thời gian' },
  { id: 'PART_TIME', label: 'Bán thời gian' },
  { id: 'INTERN', label: 'Thực tập' },
];

const LOCATION_CHIPS = [
  'Tất cả',
  'Miền Bắc',
  'Miền Trung',
  'Miền Nam',
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
];

export default function FeaturedJobs() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('Tất cả');
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
        area: selectedLocation === 'Tất cả' ? 'all' : selectedLocation,
      })
      .then((data) => {
        setJobs((data || []).slice(0, 6));
        setLoading(false);
      })
      .catch(() => {
        // Dự phòng dữ liệu mẫu nếu API backend chưa bật
        import('../../mock/jobs.js')
          .then(({ mockJobs }) => {
            const filtered = mockJobs.filter((j) => {
              const matchType = activeTab === 'ALL' || j.jobType === activeTab;
              const matchArea = selectedLocation === 'Tất cả' || j.area === selectedLocation || j.region === selectedLocation || j.location.includes(selectedLocation);
              return matchType && matchArea;
            });
            setJobs((filtered.length > 0 ? filtered : mockJobs).slice(0, 6));
            setLoading(false);
          })
          .catch(() => {
            setError(true);
            setLoading(false);
          });
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
    <section className="featured-jobs-section py-4">
      <div className="container-app">
        {/* Hàng 1: Tiêu đề, Tab dạng Segmented Control k tròn & Xem tất cả */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <h2 className="section-title-jobnest mb-0">Việc làm nổi bật</h2>

            {/* Dải tab dạng Segmented Control hình chữ nhật chuẩn ITviec */}
            <div className="jn-tab-segmented">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`jn-tab-item ${activeTab === tab.id ? 'jn-tab-item--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link to="/jobs" className="view-all-link-jobnest">
              Xem tất cả →
            </Link>
            <div className="d-flex gap-1">
              <button
                type="button"
                className="jn-nav-btn"
                onClick={loadJobs}
                aria-label="Tải trước"
                title="Tải trước"
              >
                <FaChevronLeft size={11} />
              </button>
              <button
                type="button"
                className="jn-nav-btn"
                onClick={loadJobs}
                aria-label="Tải sau"
                title="Tải sau"
              >
                <FaChevronRight size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Hàng 2: Thanh lọc địa điểm dạng thẻ kỹ thuật k tròn (không trùng lặp) */}
        <div className="jn-filter-row mb-3">
          <div className="jn-filter-label">
            <FaSlidersH size={12} />
            <span>Lọc theo:</span>
          </div>

          <div className="jn-filter-chips-wrap">
            {LOCATION_CHIPS.map((chip) => {
              const isSelected = selectedLocation === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  className={`jn-tech-filter-chip ${isSelected ? 'jn-tech-filter-chip--active' : ''}`}
                  onClick={() => setSelectedLocation(chip)}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hàng 3: Hộp gợi ý nền vàng kem nhẹ ấm áp */}
        {showTip && (
          <div className="jobnest-tip-box mb-3">
            <div className="d-flex align-items-center gap-2">
              <FaLightbulb className="text-warning flex-shrink-0" size={14} />
              <span className="small" style={{ fontSize: '13px', color: '#374151' }}>
                <strong>Gợi ý:</strong> Di chuột vào tiêu đề việc làm để xem thêm thông tin chi tiết
              </span>
            </div>
            <button
              type="button"
              className="btn-close-tip ms-auto"
              onClick={handleCloseTip}
              aria-label="Đóng gợi ý"
            >
              <FaTimes size={11} />
            </button>
          </div>
        )}

        {/* Hàng 4: Lưới 6 thẻ việc làm (3 cột x 2 hàng), kích thước chuẩn cân đối */}
        {loading ? (
          <LoadingGrid count={6} />
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-danger mb-2 small">Không tải được dữ liệu việc làm.</p>
            <button type="button" className="btn btn-sm btn-brand" onClick={loadJobs}>
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
              <div key={job.id} className="col-12 col-md-6 col-lg-4 d-flex">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
