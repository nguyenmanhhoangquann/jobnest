import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FaFilePdf,
  FaCheck,
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaSearch,
  FaCheckCircle,
  FaTrash,
  FaDownload,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import applicationApi from '../../api/applicationApi.js';
import aiApi from '../../api/aiApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { Spinner } from '../../components/common/Loading.jsx';
import { showToast } from '../../components/common/ToastHost.jsx';
import AiReviewModal from '../../components/common/AiReviewModal.jsx';
import { Modal } from 'react-bootstrap';

export default function ReceivedApplications() {
  const [searchParams] = useSearchParams();
  const appIdParam = searchParams.get('appId');
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [cvModal, setCvModal] = useState({
    show: false,
    url: '',
    name: '',
    jobTitle: '',
  });

  const getCvUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
      : 'http://localhost:8080';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleOpenCv = (url, name, jobTitle) => {
    setCvModal({
      show: true,
      url: getCvUrl(url),
      name: name || 'Ứng viên',
      jobTitle: jobTitle || '',
    });
  };

  const handleDeleteApplication = async (appId, candidateName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn gỡ bỏ hồ sơ của ứng viên "${candidateName || 'này'}" khỏi danh sách?`)) {
      return;
    }
    try {
      await applicationApi.deleteApplication(appId);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      showToast('success', `Đã gỡ hồ sơ của ứng viên "${candidateName || ''}" thành công.`);
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(null);
      }
    } catch {
      showToast('error', 'Không thể gỡ hồ sơ lúc này. Vui lòng thử lại!');
    }
  };

  useEffect(() => {
    setLoading(true);
    applicationApi
      .getReceivedApplications()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.content || [];
        setApplications(list);
        setLoading(false);
      })
      .catch(() => {
        setApplications([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (appIdParam && applications.length > 0) {
      const found = applications.find((a) => String(a.id) === String(appIdParam));
      if (found) {
        setSelectedApp(found);
      }
    }
  }, [appIdParam, applications]);

  const handleUpdateStatus = async (id, newStatus, label) => {
    try {
      await applicationApi.updateStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      showToast('success', `Đã chuyển hồ sơ sang "${label || newStatus}"`);
    } catch {
      showToast('error', 'Không thể cập nhật trạng thái hồ sơ.');
    }
  };

  const handleAiReview = async (appId) => {
    setReviewingId(appId);
    try {
      const review = await aiApi.reviewCv({ applicationId: appId });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, aiScore: review.score, aiReview: review } : app
        )
      );
      showToast('success', `Đã phân tích CV: Mức độ phù hợp ${review.score}%`);
    } catch {
      showToast('error', 'Lỗi khi phân tích tiêu chí hồ sơ.');
    } finally {
      setReviewingId(null);
    }
  };

  const uniqueJobs = useMemo(() => {
    const titles = new Set();
    applications.forEach((a) => {
      if (a.jobTitle) titles.add(a.jobTitle);
    });
    return Array.from(titles);
  }, [applications]);

  const counts = useMemo(() => {
    return {
      ALL: applications.length,
      PENDING: applications.filter((a) => a.status === 'PENDING').length,
      VIEWED: applications.filter((a) => a.status === 'VIEWED').length,
      ACCEPTED: applications.filter((a) => a.status === 'ACCEPTED').length,
      REJECTED: applications.filter((a) => a.status === 'REJECTED').length,
    };
  }, [applications]);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      if (filterStatus !== 'ALL' && app.status !== filterStatus) return false;
      if (selectedJob !== 'ALL' && app.jobTitle !== selectedJob) return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const name = (app.candidate?.fullName || '').toLowerCase();
        const email = (app.candidate?.email || '').toLowerCase();
        const phone = (app.candidate?.phone || '').toLowerCase();
        const job = (app.jobTitle || '').toLowerCase();
        return name.includes(kw) || email.includes(kw) || phone.includes(kw) || job.includes(kw);
      }
      return true;
    });
  }, [applications, filterStatus, selectedJob, searchKeyword]);

  return (
    <div className="received-applications-page">
      {/* 1. Header Trang chuẩn ATS */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h1 className="h4 fw-bold mb-1 text-dark">Hồ sơ ứng tuyển</h1>
          <p className="small text-muted mb-0">
            Quản lý, sàng lọc và phản hồi hồ sơ ứng viên nộp vào doanh nghiệp
          </p>
        </div>

        {/* Thanh tìm kiếm & lọc nhanh */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="input-group" style={{ width: '260px' }}>
            <span className="input-group-text bg-white border-end-0 text-muted py-1.5">
              <FaSearch size={12} />
            </span>
            <input
              type="text"
              className="form-control form-control-sm border-start-0 ps-0"
              placeholder="Tìm tên, email ứng viên..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          {uniqueJobs.length > 0 && (
            <select
              className="form-select form-select-sm"
              style={{ width: '220px' }}
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
            >
              <option value="ALL">Tất cả vị trí tuyển dụng ({uniqueJobs.length})</option>
              {uniqueJobs.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 2. Dải Tab trạng thái phẳng thanh lịch */}
      <div className="d-flex border-bottom mb-3 gap-1 overflow-auto">
        {[
          { key: 'ALL', label: 'Tất cả', count: counts.ALL },
          { key: 'PENDING', label: 'Chờ phản hồi', count: counts.PENDING },
          { key: 'VIEWED', label: 'Đã xem', count: counts.VIEWED },
          { key: 'ACCEPTED', label: 'Phù hợp', count: counts.ACCEPTED },
          { key: 'REJECTED', label: 'Không phù hợp', count: counts.REJECTED },
        ].map((tab) => {
          const isActive = filterStatus === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              className={`btn btn-link text-decoration-none px-3 py-2.5 small fw-semibold border-0 rounded-0 d-inline-flex align-items-center gap-1.5 position-relative ${
                isActive ? 'text-dark fw-bold border-bottom border-dark border-2' : 'text-secondary'
              }`}
              style={{
                marginBottom: '-1px',
                color: isActive ? '#111827' : '#6B7280',
              }}
              onClick={() => setFilterStatus(tab.key)}
            >
              <span>{tab.label}</span>
              <span
                className={`badge rounded-pill ${
                  isActive ? 'bg-dark text-white' : 'bg-light text-secondary border'
                }`}
                style={{ fontSize: '11px', fontWeight: 'normal' }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner size="lg" className="my-4 text-warning" />
          <p className="text-muted">Đang tải danh sách hồ sơ...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card border shadow-sm rounded-3 p-5 text-center bg-white">
          <EmptyState
            title="Không tìm thấy hồ sơ nào"
            description="Chưa có hồ sơ ứng tuyển nào khớp với tiêu chí tìm kiếm hiện tại."
          />
          {(filterStatus !== 'ALL' || selectedJob !== 'ALL' || searchKeyword) && (
            <div className="mt-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setFilterStatus('ALL');
                  setSelectedJob('ALL');
                  setSearchKeyword('');
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card border shadow-sm rounded-3 bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small border-bottom">
                <tr>
                  <th scope="col" className="ps-3 py-2.5">Ứng viên</th>
                  <th scope="col" className="py-2.5">Vị trí ứng tuyển</th>
                  <th scope="col" className="py-2.5">Thời gian nộp</th>
                  <th scope="col" className="py-2.5">Hồ sơ CV</th>
                  <th scope="col" className="py-2.5">AI đánh giá</th>
                  <th scope="col" className="py-2.5">Trạng thái</th>
                  <th scope="col" className="text-end pe-3 py-2.5">Xử lý hồ sơ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted small">
                      Chưa có hồ sơ nào nộp gần đây.
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => {
                    const candidate = app.candidate || {};
                    return (
                      <tr key={app.id}>
                        {/* Cột 1: Thông tin ứng viên (avt cách xa tên ra) */}
                        <td className="ps-3 py-2.5">
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-2 bg-light border text-dark fw-bold d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                              style={{ width: '38px', height: '38px', fontSize: '14px' }}
                            >
                              {(candidate.fullName || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div
                                className="fw-semibold text-dark small"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSelectedApp(app)}
                                title="Bấm để xem chi tiết hồ sơ ứng tuyển"
                              >
                                {candidate.fullName || 'Ứng viên'}
                              </div>
                              <div className="text-muted d-flex align-items-center gap-2 mt-0.5" style={{ fontSize: '11.5px' }}>
                                <span>{candidate.email}</span>
                                {candidate.phone && <span>• {candidate.phone}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Cột 2: Vị trí tuyển dụng */}
                        <td className="py-2.5">
                          <span className="small text-dark fw-medium d-block text-truncate" style={{ maxWidth: '220px' }}>
                            {app.jobTitle}
                          </span>
                        </td>

                        {/* Cột 3: Ngày nộp */}
                        <td className="py-2.5 text-muted small" style={{ fontSize: '12px' }}>
                          <span className="d-inline-flex align-items-center gap-1">
                            <FaCalendarAlt size={10} className="text-muted" />
                            {app.appliedAt ? (app.appliedAt.includes('T') ? app.appliedAt.split('T')[0] : app.appliedAt) : '26/10/2026'}
                          </span>
                        </td>

                        {/* Cột 4: File CV */}
                        <td className="py-2.5">
                          <button
                            type="button"
                            onClick={() => handleOpenCv(candidate.cvUrl || app.cvUrl, candidate.fullName, app.jobTitle)}
                            className="btn btn-sm btn-light border py-1 px-2.5 d-inline-flex align-items-center gap-1.5 text-dark"
                            style={{ fontSize: '12px' }}
                            title="Bấm để xem trực tiếp CV"
                          >
                            <FaFilePdf className="text-danger" size={13} />
                            <span>Xem CV</span>
                          </button>
                        </td>

                        {/* Cột 5: Cột AI đánh giá ghi rõ điểm số */}
                        <td className="py-2.5">
                          {app.aiScore ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-light border py-1 px-2.5 text-dark fw-semibold small d-inline-flex align-items-center"
                              style={{ fontSize: '12px' }}
                              onClick={() =>
                                setSelectedReview({
                                  ...app.aiReview,
                                  score: app.aiScore,
                                  candidateName: candidate.fullName,
                                })
                              }
                              title="Bấm để xem chi tiết AI đánh giá"
                            >
                              <span>{app.aiScore}/100 điểm</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-light border py-1 px-2 text-secondary"
                              style={{ fontSize: '11.5px' }}
                              onClick={() => handleAiReview(app.id)}
                              disabled={reviewingId === app.id}
                            >
                              {reviewingId === app.id ? (
                                <Spinner size="sm" />
                              ) : (
                                <span>Chấm điểm</span>
                              )}
                            </button>
                          )}
                        </td>

                        {/* Cột 6: Trạng thái hồ sơ */}
                        <td className="py-2.5">
                          <StatusBadge status={app.status || 'PENDING'} />
                        </td>

                        {/* Cột 7: Thao tác duyệt */}
                        <td className="text-end pe-3 py-2.5 text-nowrap">
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              className="btn btn-light border py-1 px-2.5 text-dark"
                              onClick={() => setSelectedApp(app)}
                              title="Xem chi tiết toàn bộ hồ sơ ứng tuyển"
                              style={{ fontSize: '11.5px' }}
                            >
                              Chi tiết
                            </button>
                            <button
                              type="button"
                              className={`btn ${app.status === 'ACCEPTED' ? 'btn-success text-white' : 'btn-outline-success'} py-1 px-2.5`}
                              onClick={() => handleUpdateStatus(app.id, 'ACCEPTED', 'Phù hợp')}
                              title="Xác nhận ứng viên phù hợp"
                              style={{ fontSize: '11.5px' }}
                            >
                              <FaCheck className="me-1" size={10} /> Phù hợp
                            </button>
                            <button
                              type="button"
                              className={`btn ${app.status === 'REJECTED' ? 'btn-danger text-white' : 'btn-outline-secondary'} py-1 px-2`}
                              onClick={() => handleUpdateStatus(app.id, 'REJECTED', 'Không phù hợp')}
                              title="Từ chối hồ sơ này"
                              style={{ fontSize: '11.5px' }}
                            >
                              <FaTimes size={10} />
                            </button>
                            <button
                              type="button"
                              className={`btn ${app.status === 'VIEWED' ? 'btn-secondary text-white' : 'btn-light border'} py-1 px-2`}
                              onClick={() => handleUpdateStatus(app.id, 'VIEWED', 'Đã xem')}
                              title="Đánh dấu đã xem"
                              style={{ fontSize: '11.5px' }}
                            >
                              <FaEye size={10} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger py-1 px-2"
                              onClick={() => handleDeleteApplication(app.id, candidate.fullName)}
                              title="Gỡ bỏ hồ sơ này khỏi danh sách"
                              style={{ fontSize: '11.5px' }}
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal chi tiết hồ sơ ứng tuyển */}
      {selectedApp && (
        <Modal show={Boolean(selectedApp)} onHide={() => setSelectedApp(null)} size="lg" centered>
          <Modal.Header closeButton className="pb-2 border-bottom">
            <div>
              <Modal.Title className="h5 fw-bold mb-1 text-dark">
                Hồ sơ ứng viên: {selectedApp.candidate?.fullName}
              </Modal.Title>
              <div className="small text-muted">
                Ứng tuyển vị trí: <strong className="text-dark">{selectedApp.jobTitle}</strong> • Mã hồ sơ #{selectedApp.id}
              </div>
            </div>
          </Modal.Header>
          <Modal.Body className="py-3">
            {/* Thông tin liên hệ */}
            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <div className="p-2.5 rounded bg-light border small">
                  <div className="text-muted mb-1">Email liên hệ</div>
                  <div className="fw-semibold text-dark d-flex align-items-center gap-1.5">
                    <FaEnvelope size={12} className="text-secondary" />
                    <span>{selectedApp.candidate?.email || 'Chưa cung cấp'}</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2.5 rounded bg-light border small">
                  <div className="text-muted mb-1">Số điện thoại</div>
                  <div className="fw-semibold text-dark d-flex align-items-center gap-1.5">
                    <FaPhone size={12} className="text-secondary" />
                    <span>{selectedApp.candidate?.phone || 'Chưa cung cấp'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trạng thái & File CV */}
            <div className="d-flex justify-content-between align-items-center p-3 rounded border mb-3 bg-white">
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">Trạng thái hồ sơ:</span>
                <StatusBadge status={selectedApp.status || 'PENDING'} />
              </div>
              <button
                type="button"
                onClick={() => handleOpenCv(selectedApp.candidate?.cvUrl || selectedApp.cvUrl, selectedApp.candidate?.fullName, selectedApp.jobTitle)}
                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1.5 fw-semibold"
              >
                <FaFilePdf className="text-danger" size={14} />
                <span>Mở file CV trực tiếp</span>
              </button>
            </div>

            {/* Thư giới thiệu / Lời nhắn của ứng viên */}
            {selectedApp.coverLetter && (
              <div className="mb-3">
                <h6 className="fw-bold small text-dark mb-1">Thư giới thiệu / Lời nhắn</h6>
                <div className="p-3 bg-light rounded border small text-secondary" style={{ whiteSpace: 'pre-line' }}>
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            {/* Đánh giá tiêu chí / AI Review */}
            {selectedApp.aiReview && (
              <div className="p-3 rounded border bg-light bg-opacity-50">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold small text-dark mb-0">Đánh giá tiêu chí hồ sơ</h6>
                  <span className="badge bg-dark text-white">{selectedApp.aiScore}/100 điểm</span>
                </div>
                {selectedApp.aiReview.summary && (
                  <p className="small text-muted mb-2">{selectedApp.aiReview.summary}</p>
                )}
                {selectedApp.aiReview.strengths?.length > 0 && (
                  <div className="small mb-1">
                    <strong className="text-success">Điểm mạnh:</strong>
                    <ul className="mb-1 ps-3 text-muted">
                      {selectedApp.aiReview.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedApp.aiReview.weaknesses?.length > 0 && (
                  <div className="small">
                    <strong className="text-warning-emphasis">Cần lưu ý:</strong>
                    <ul className="mb-0 ps-3 text-muted">
                      {selectedApp.aiReview.weaknesses.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between align-items-center pt-2 border-top">
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedApp(null)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                onClick={() => handleDeleteApplication(selectedApp.id, selectedApp.candidate?.fullName)}
                title="Gỡ hồ sơ khỏi danh sách"
              >
                <FaTrash size={11} /> Gỡ hồ sơ
              </button>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  handleUpdateStatus(selectedApp.id, 'REJECTED', 'Không phù hợp');
                  setSelectedApp({ ...selectedApp, status: 'REJECTED' });
                }}
              >
                Từ chối
              </button>
              <button
                type="button"
                className="btn btn-sm btn-success text-white"
                onClick={() => {
                  handleUpdateStatus(selectedApp.id, 'ACCEPTED', 'Phù hợp');
                  setSelectedApp({ ...selectedApp, status: 'ACCEPTED' });
                }}
              >
                Duyệt phù hợp
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal xem CV trực tuyến tiện lợi */}
      <Modal
        show={cvModal.show}
        onHide={() => setCvModal({ ...cvModal, show: false })}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="pb-2">
          <div>
            <Modal.Title className="h6 fw-bold mb-0 text-dark">Hồ sơ ứng viên: {cvModal.name}</Modal.Title>
            <small className="text-muted">{cvModal.jobTitle}</small>
          </div>
        </Modal.Header>
        <Modal.Body className="p-0 bg-light" style={{ height: '600px' }}>
          {cvModal.url ? (
            <iframe
              src={cvModal.url}
              title={`CV-${cvModal.name}`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              Không tìm thấy file CV đính kèm
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="py-2 d-flex justify-content-between">
          <span className="small text-muted">Tự động xem trước định dạng PDF / DOC</span>
          <div className="d-flex gap-2">
            <a
              href={cvModal.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
            >
              <FaExternalLinkAlt size={11} /> Mở tab mới
            </a>
            <a
              href={cvModal.url}
              download
              className="btn btn-sm btn-brand d-inline-flex align-items-center gap-1"
            >
              <FaDownload size={11} /> Tải file về máy
            </a>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Modal chi tiết đánh giá tiêu chí */}
      <AiReviewModal
        show={!!selectedReview}
        onHide={() => setSelectedReview(null)}
        review={selectedReview}
        candidateName={selectedReview?.candidateName}
      />
    </div>
  );
}