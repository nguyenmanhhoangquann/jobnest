import React from 'react';
import {
  FaUndo,
  FaSearch,
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUserGraduate,
  FaClock,
} from 'react-icons/fa';

export default function JobFilterSidebar({ filters, onChange, onReset }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="filter-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="filter-sidebar__title mb-0">Bộ lọc tìm kiếm</h3>
        <button
          type="button"
          className="btn-reset-filter"
          onClick={onReset}
          title="Xóa bộ lọc về mặc định"
        >
          <FaUndo size={11} className="me-1" />
          Xóa lọc
        </button>
      </div>

      {/* 1. Từ khóa */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <FaSearch size={12} className="me-1 text-muted" /> Từ khóa
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Chức danh, kỹ năng, công ty..."
          value={filters.keyword || ''}
          onChange={(e) => handleChange('keyword', e.target.value)}
        />
      </div>

      {/* 2. Ngành nghề */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <FaBriefcase size={12} className="me-1 text-muted" /> Ngành nghề
        </label>
        <select
          className="form-select form-select-sm"
          value={filters.category || 'all'}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="all">Tất cả ngành nghề</option>
          <option value="cntt">Công nghệ thông tin</option>
          <option value="kinh-doanh">Kinh doanh / Bán hàng</option>
          <option value="marketing">Marketing / Truyền thông</option>
          <option value="tai-chinh">Tài chính / Ngân hàng</option>
          <option value="ke-toan">Kế toán / Kiểm toán</option>
          <option value="nhan-su">Nhân sự / Hành chính / CSKH</option>
          <option value="thiet-ke">Thiết kế / Sáng tạo</option>
          <option value="san-xuat">Sản xuất / Kỹ thuật / Vận hành</option>
        </select>
      </div>

      {/* 3. Địa điểm */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <FaMapMarkerAlt size={12} className="me-1 text-muted" /> Địa điểm
        </label>
        <select
          className="form-select form-select-sm"
          value={filters.area || 'all'}
          onChange={(e) => handleChange('area', e.target.value)}
        >
          <option value="all">Tất cả tỉnh thành</option>
          <option value="ha-noi">Hà Nội</option>
          <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
          <option value="da-nang">Đà Nẵng</option>
          <option value="hai-phong">Hải Phòng</option>
          <option value="can-tho">Cần Thơ</option>
        </select>
      </div>

      {/* 4. Mức lương */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <FaMoneyBillWave size={12} className="me-1 text-muted" /> Mức lương
        </label>
        <select
          className="form-select form-select-sm"
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
      </div>

      {/* 5. Kinh nghiệm */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <FaUserGraduate size={12} className="me-1 text-muted" /> Kinh nghiệm
        </label>
        <select
          className="form-select form-select-sm"
          value={filters.experience || 'all'}
          onChange={(e) => handleChange('experience', e.target.value)}
        >
          <option value="all">Tất cả kinh nghiệm</option>
          <option value="none">Chưa có kinh nghiệm</option>
          <option value="1-year">1 năm</option>
          <option value="2-years">2 năm</option>
          <option value="3-years">3 năm</option>
          <option value="5-plus">Trên 5 năm</option>
        </select>
      </div>

      {/* 6. Loại hình làm việc */}
      <div className="filter-group mb-3">
        <label className="filter-label">
          <FaClock size={12} className="me-1 text-muted" /> Loại hình làm việc
        </label>
        <select
          className="form-select form-select-sm"
          value={filters.jobType || 'all'}
          onChange={(e) => handleChange('jobType', e.target.value)}
        >
          <option value="all">Tất cả loại hình</option>
          <option value="full-time">Toàn thời gian (Full time)</option>
          <option value="part-time">Bán thời gian (Part time)</option>
          <option value="intern">Thực tập sinh (Intern)</option>
        </select>
      </div>
    </div>
  );
}
