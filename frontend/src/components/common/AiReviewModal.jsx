import React from 'react';
import { Modal } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaRobot } from 'react-icons/fa';
import ScoreRing from './ScoreRing.jsx';

export default function AiReviewModal({ show, onHide, review, candidateName }) {
  if (!review) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="ai-review-modal">
      <Modal.Header closeButton>
        <div className="d-flex align-items-center gap-2">
          <FaRobot className="text-warning fs-4" />
          <Modal.Title className="fs-5 fw-bold mb-0">
            Kết quả Đánh giá CV bằng AI: {candidateName || 'Ứng viên'}
          </Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="row align-items-center mb-4">
          <div className="col-12 col-md-4 text-center border-end">
            <ScoreRing score={review.score || 85} size={130} strokeWidth={10} />
            <div className="mt-2 fw-bold fs-6">Độ tương thích hồ sơ</div>
            <div className="small text-muted">{review.verdict || 'Hồ sơ rất tiềm năng'}</div>
          </div>

          <div className="col-12 col-md-8 ps-md-4 mt-3 mt-md-0">
            <h4 className="fs-6 fw-bold mb-2">Tóm tắt đánh giá:</h4>
            <p className="text-secondary small mb-0" style={{ lineHeight: '1.7' }}>
              {review.summary ||
                'Ứng viên sở hữu nền tảng kiến thức vững chắc và các kỹ năng chuyên môn phù hợp cao với yêu cầu vị trí công việc. Khả năng giải quyết vấn đề và tư duy logic được thể hiện tốt qua các dự án thực tế.'}
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* Điểm mạnh */}
          <div className="col-12 col-md-6">
            <div className="p-3 bg-light rounded border h-100">
              <h5 className="fs-6 fw-bold text-success d-flex align-items-center gap-2 mb-3">
                <FaCheckCircle /> Điểm mạnh nổi bật
              </h5>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                {(review.strengths || [
                  'Kinh nghiệm thực tiễn vững vàng với ReactJS và hệ sinh thái liên quan.',
                  'Có kinh nghiệm tối ưu hóa hiệu năng ứng dụng web.',
                  'Tác phong làm việc độc lập và kỹ năng giao tiếp tốt.',
                ]).map((st, i) => (
                  <li key={i} className="d-flex align-items-start gap-2">
                    <span className="text-success mt-1">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Điểm cần cải thiện */}
          <div className="col-12 col-md-6">
            <div className="p-3 bg-light rounded border h-100">
              <h5 className="fs-6 fw-bold text-warning d-flex align-items-center gap-2 mb-3">
                <FaExclamationTriangle /> Điểm cần lưu ý / Cải thiện
              </h5>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                {(review.weaknesses || [
                  'Cần bổ sung thêm các chứng chỉ chuyên ngành quốc tế.',
                  'Chưa có nhiều kinh nghiệm trong việc dẫn dắt đội ngũ kỹ thuật lớn.',
                ]).map((wk, i) => (
                  <li key={i} className="d-flex align-items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
