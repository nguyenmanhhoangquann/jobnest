import React, { useEffect, useState } from 'react';
import {
  FaFilePdf,
  FaCheck,
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaRobot,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import applicationApi from '../../api/applicationApi.js';
import aiApi from '../../api/aiApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { Spinner } from '../../components/common/Loading.jsx';
import { showToast } from '../../components/common/ToastHost.jsx';
import AiReviewModal from '../../components/common/AiReviewModal.jsx';

export default function ReceivedApplications() {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

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

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await applicationApi.updateStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      showToast('success', 'Đã cập nhật trạng thái hồ sơ ứng viên!');
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
      showToast('success', `AI đã hoàn tất đánh giá CV! Điểm tương thích: ${review.score}/100`);
    } catch {
      showToast('error', 'Lỗi khi gọi AI phân tích CV.');
    } finally {
      setReviewingId(null);
    }
  };

  const filtered = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="received-applications-page">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="fs-4 fw-bold mb-1">Hồ sơ ứng tuyển đã nhận</h1>
          <p className="text-muted small mb-0">Quản lý và sàng lọc các ứng viên ứng tuyển vào doanh nghiệp của bạn</p>
        </div>

        {/* Lọc trạng thái */}
        <div className="d-flex align-items-center gap-2">
          <span className="small text-muted text-nowrap">Lọc trạng thái:</span>
          <select
            className="form-select form-select-sm"
            style={{ width: '160px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Tất cả ({applications.length})</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="VIEWED">Đã xem</option>
            <option value="ACCEPTED">Phù hợp</option>
            <option value="REJECTED">Không phù hợp</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner size="lg" className="my-4" />
          <p className="text-muted">Đang tải danh sách hồ sơ ứng viên...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Không tìm thấy hồ sơ nào"
          description="Hiện tại chưa có hồ sơ ứng tuyển nào khớp với tiêu chí lọc của bạn."
        />
      ) : (
        <div className="card border shadow-sm bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Ứng viên</th>
                  <th scope="col">Vị trí ứng tuyển</th>
                  <th scope="col">Ngày nộp</th>
                  <th scope="col">CV & Đánh giá AI</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col" className="text-end pe-4">Thao tác duyệt</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const candidate = app.candidate || {};
                  return (
                    <tr key={app.id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{candidate.fullName || 'Ứng viên'}</div>
                        <div className="small text-muted d-flex flex-column gap-1 mt-1">
                          <span>
                            <FaEnvelope size={11} className="me-1" />
                            {candidate.email}
                          </span>
                          {candidate.phone && (
                            <span>
                              <FaPhone size={11} className="me-1" />
                              {candidate.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className="fw-semibold text-dark">{app.jobTitle}</span>
                      </td>

                      <td className="text-muted small">
                        <FaCalendarAlt className="me-1" size={11} />
                        {app.appliedAt || '26/10/2026'}
                      </td>

                      <td>
                        <div className="d-flex flex-column gap-1 align-items-start">
                          <a
                            href={candidate.cvUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 py-1 px-2"
                          >
                            <FaFilePdf className="text-danger" size={13} />
                            <span>Mở file CV</span>
                          </a>

                          {app.aiScore ? (
                            <button
                              type="button"
                              className={`badge border-0 cursor-pointer ${
                                app.aiScore >= 75
                                  ? 'bg-success'
                                  : app.aiScore >= 50
                                  ? 'bg-warning text-dark'
                                  : 'bg-danger'
                              }`}
                              onClick={() =>
                                setSelectedReview({
                                  ...app.aiReview,
                                  score: app.aiScore,
                                  candidateName: candidate.fullName,
                                })
                              }
                              title="Bấm để xem phân tích chi tiết của AI"
                            >
                              AI: {app.aiScore}/100 điểm ℹ
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-light border small text-primary p-1"
                              onClick={() => handleAiReview(app.id)}
                              disabled={reviewingId === app.id}
                            >
                              {reviewingId === app.id ? (
                                <Spinner size="sm" />
                              ) : (
                                <><FaRobot className="me-1" /> AI Chấm điểm</>
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      <td>
                        <StatusBadge status={app.status || 'PENDING'} />
                      </td>

                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => handleUpdateStatus(app.id, 'VIEWED')}
                            title="Đánh dấu đã xem"
                          >
                            <FaEye />
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                            title="Chấp nhận hồ sơ"
                          >
                            <FaCheck /> Phù hợp
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                            title="Từ chối hồ sơ"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AiReviewModal
        show={!!selectedReview}
        onHide={() => setSelectedReview(null)}
        review={selectedReview}
        candidateName={selectedReview?.candidateName}
      />
    </div>
  );
}
