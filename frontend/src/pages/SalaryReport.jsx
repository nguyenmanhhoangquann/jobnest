import React, { useState } from 'react';
import { FaDownload, FaCheckCircle } from 'react-icons/fa';
import InteractiveBook3D from '../components/report/InteractiveBook3D.jsx';

const SALARY_CATEGORIES = [
  {
    category: 'Software Development',
    roles: [
      { role: 'Back-end Developer', total: '37,8', lt1: '12,4', y1_2: '25,35', y3_4: '30,1', y5_8: '39,9', gt8: '54,9' },
      { role: 'Front-end Developer', total: '34,8', lt1: '—', y1_2: '—', y3_4: '30,8', y5_8: '41,8', gt8: '46,3' },
      { role: 'Full-stack Developer', total: '37,25', lt1: '10,1', y1_2: '20,35', y3_4: '34,5', y5_8: '41,8', gt8: '44,8' },
      { role: 'Mobile Developer', total: '36,85', lt1: '14,15', y1_2: '28,8', y3_4: '29,05', y5_8: '37,35', gt8: '45,7' },
      { role: 'Game Developer', total: '33,35', lt1: '—', y1_2: '26,5', y3_4: '40,4', y5_8: '57,85', gt8: '—' },
      { role: 'Embedded Engineer', total: '34,35', lt1: '21,4', y1_2: '23,9', y3_4: '28,4', y5_8: '39,4', gt8: '60,65' },
    ],
  },
  {
    category: 'Product Management',
    roles: [
      { role: 'Product Owner / Product Manager', total: '50,1', lt1: '—', y1_2: '25,3', y3_4: '42,7', y5_8: '60,4', gt8: '75,0' },
      { role: 'Business Analyst', total: '30,0', lt1: '12,2', y1_2: '14,0', y3_4: '28,0', y5_8: '37,4', gt8: '41,35' },
    ],
  },
  {
    category: 'Management & Consulting',
    roles: [
      { role: 'Project Leader / Project Manager', total: '50,1', lt1: '17,2', y1_2: '29,85', y3_4: '48,4', y5_8: '58,45', gt8: '—' },
      { role: 'Tech Lead', total: '51,8', lt1: '—', y1_2: '45,3', y3_4: '53,85', y5_8: '—', gt8: '68,45' },
      { role: 'IT Manager', total: '50,25', lt1: '—', y1_2: '46,4', y3_4: '—', y5_8: '—', gt8: '50,3' },
      { role: 'CTO / CIO / VPoE', total: '101,25', lt1: '—', y1_2: '—', y3_4: '100,3', y5_8: '—', gt8: '—' },
    ],
  },
  {
    category: 'Testing & Quality Assurance',
    roles: [
      { role: 'Tester', total: '28,8', lt1: '14,15', y1_2: '14,2', y3_4: '20,7', y5_8: '25,3', gt8: '36,5' },
      { role: 'QA - QC', total: '31,2', lt1: '—', y1_2: '18,0', y3_4: '24,4', y5_8: '29,75', gt8: '38,5' },
    ],
  },
  {
    category: 'Data Analytics & AI',
    roles: [
      { role: 'Data Analyst / Scientist / BI', total: '40,65', lt1: '—', y1_2: '23,8', y3_4: '—', y5_8: '42,5', gt8: '—' },
      { role: 'Data Engineer', total: '41,3', lt1: '—', y1_2: '—', y3_4: '56,9', y5_8: '—', gt8: '—' },
    ],
  },
  {
    category: 'Others',
    roles: [
      { role: 'ERP Engineer / Consultant', total: '30,2', lt1: '15,2', y1_2: '16,1', y3_4: '19,5', y5_8: '35,6', gt8: '—' },
      { role: 'IT Support / Helpdesk', total: '20,0', lt1: '—', y1_2: '8,6', y3_4: '18,7', y5_8: '22,5', gt8: '—' },
    ],
  },
];

export default function SalaryReport() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = (e) => {
    e.preventDefault();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="salary-report-page">
      {/* 1. Phần 1: Giới thiệu báo cáo & Cuốn sách 3D tương tác */}
      <section className="report-hero-section position-relative overflow-hidden">
        <div className="container-app position-relative z-2">
          <div className="row align-items-center g-4 g-lg-5 report-hero-row">
            {/* Cột trái: Giới thiệu báo cáo */}
            <div className="col-12 col-lg-7">
              <div className="report-hero-content text-start">
                <div className="hero-eyebrow hero-eyebrow--refero mb-3">
                  <span className="hero-eyebrow-dot" />
                  BÁO CÁO LƯƠNG &amp; THỊ TRƯỜNG TUYỂN DỤNG IT 2025–2026
                </div>

                <h1 className="report-hero-title mb-4">
                  Chuyển Dịch Nhanh Chóng – <br />
                  <span className="hero-title-accent">
                    Khi AI Tăng Tốc &amp; Mở Ra Nhiều <br />
                    Góc Nhìn Mới
                  </span>
                </h1>

                <p className="report-hero-desc mb-4">
                  Được xây dựng từ góc nhìn của <strong>1.839 người tham gia – chuyên gia IT, freelancer, sinh viên IT, quản lý HR và CxOs.</strong> Báo cáo năm nay mang đến insight thực tiễn và xu hướng mới nổi của thị trường IT Việt Nam. Cập nhật biến động trong tuyển dụng IT, sự thay đổi trong hành vi và kỳ vọng của chuyên gia IT, cùng tác động của AI lên nhân tài và doanh nghiệp. Khám phá điều ẩn giấu cùng JobNest để đưa ra quyết định cho tương lai với sự tự tin cao hơn.
                </p>

                <div className="d-flex flex-wrap align-items-center gap-3">
                  <button
                    type="button"
                    className="btn report-cta-btn"
                    onClick={handleDownload}
                  >
                    <FaDownload className="me-2" size={14} />
                    TẢI BÁO CÁO CHI TIẾT
                  </button>

                  {downloadSuccess && (
                    <span className="text-warning small d-inline-flex align-items-center gap-1">
                      <FaCheckCircle /> Báo cáo PDF đang được chuẩn bị tải xuống...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cột phải: Sách 3D chân thực di chuyển theo chuột */}
            <div className="col-12 col-lg-5">
              <InteractiveBook3D />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Phần 2: MỨC LƯƠNG IT THEO VỊ TRÍ (Layout 2 cột chuẩn ITviec) */}
      <section className="home-main-content-bg py-5">
        <div className="container-app">
          {/* Tiêu đề & phụ đề phần 2 */}
          <div className="mb-4">
            <h2 className="section-title-jobnest mb-2 text-uppercase fw-bold" style={{ letterSpacing: '0.04em' }}>
              MỨC LƯƠNG IT THEO VỊ TRÍ
            </h2>
            <p className="text-muted" style={{ maxWidth: '880px', lineHeight: '1.65' }}>
              Báo cáo 2025–2026 hé lộ mức lương mới nhất đang định hình nguồn nhân lực IT tại Việt Nam, nổi bật hơn trong các nhóm có vai trò lãnh đạo, sản phẩm, data và kỹ thuật cốt lõi.
            </p>
          </div>

          {/* Bố cục 2 phần: Trái nhận định — Phải bảng ma trận lương theo năm kinh nghiệm */}
          <div className="row g-4 g-xl-5 align-items-start">
            {/* Cột trái: Nhận định phân tích chuyên sâu */}
            <div className="col-12 col-lg-5">
              <div className="salary-narrative-card bg-white p-4 p-md-4 rounded-4 border shadow-sm">
                <p className="mb-3" style={{ lineHeight: '1.7', color: '#374151', fontSize: '14.5px' }}>
                  <strong>CTO/CIO/VPoE</strong> tiếp tục dẫn đầu mặt bằng lương IT tại Việt Nam với mức trung vị <strong>101,25 triệu VND/tháng</strong>. Nhóm lãnh đạo kỹ thuật cao cấp vẫn duy trì sức cạnh tranh, với Project Leader/Project Manager ở mức 50,1 triệu VND, Tech Lead là 51,8 triệu VND, và IT Manager ở mức 50,25 triệu VND.
                </p>

                <p className="mb-3" style={{ lineHeight: '1.7', color: '#374151', fontSize: '14.5px' }}>
                  Nhóm <strong>Product Owner/Manager</strong> nổi bật với mức lương trung vị <strong>50,1 triệu VND</strong>, tăng lên <strong>75 triệu VND</strong> đối với những người có trên 8 năm kinh nghiệm. Nhóm data cũng giữ vị thế mạnh mẽ, với Data Analyst/Data Scientist ở mức 40,65 triệu VND, và Data Engineer đạt 56,9 triệu VND tại nhóm kinh nghiệm 3 - 4 năm.
                </p>

                <p className="mb-0" style={{ lineHeight: '1.7', color: '#374151', fontSize: '14.5px' }}>
                  Các vai trò kỹ sư cốt lõi cho thấy lộ trình lương tăng trưởng rõ rệt: <strong>Back-end Developer</strong> tăng từ 12,4 triệu VND ở ít năm kinh nghiệm lên <strong>54,9 triệu VND</strong> ở cấp độ cao; trong khi <strong>Embedded Engineer</strong> tăng từ 21,4 triệu VND lên <strong>60,65 triệu VND</strong> với cấp độ &gt;8 năm kinh nghiệm.
                </p>
              </div>
            </div>

            {/* Cột phải: Bảng ma trận mức lương ITviec chuẩn */}
            <div className="col-12 col-lg-7">
              <div className="itviec-salary-table-wrap">
                <div className="table-responsive">
                  <table className="itviec-salary-table w-100">
                    <thead className="itviec-salary-thead">
                      <tr className="main-header-row">
                        <th rowSpan={2} className="it-position-th text-start align-middle">
                          <div className="d-flex flex-column justify-content-center">
                            <span>VỊ TRÍ IT</span>
                            <span className="small opacity-75 fw-normal">/ KHOẢNG NĂM KINH NGHIỆM</span>
                          </div>
                        </th>
                        <th colSpan={6} className="text-center median-header-th">
                          MỨC LƯƠNG TRUNG VỊ (TRIỆU VND)
                        </th>
                      </tr>
                      <tr className="years-header-row text-center">
                        <th className="th-total">Tổng</th>
                        <th>&lt;1 năm</th>
                        <th>1-2 năm</th>
                        <th>3-4 năm</th>
                        <th>5-8 năm</th>
                        <th>&gt;8 năm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SALARY_CATEGORIES.map((cat, cIdx) => (
                        <React.Fragment key={cIdx}>
                          <tr className="category-header-row">
                            <td colSpan={7} className="category-header-td">
                              <span className="category-header-badge">{cat.category}</span>
                            </td>
                          </tr>
                          {cat.roles.map((r, rIdx) => (
                            <tr key={rIdx} className="salary-data-row">
                              <td className="role-cell fw-bold text-dark">{r.role}</td>
                              <td className="total-cell fw-bold">{r.total}</td>
                              <td className="val-cell">{r.lt1}</td>
                              <td className="val-cell">{r.y1_2}</td>
                              <td className="val-cell">{r.y3_4}</td>
                              <td className="val-cell">{r.y5_8}</td>
                              <td className="val-cell">{r.gt8}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-white border-top text-muted small text-end" style={{ fontSize: '11.5px' }}>
                  * Dữ liệu khảo sát từ Báo cáo Lương IT &amp; Thị trường tuyển dụng IT Việt Nam 2025–2026 • N = 1.839
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
