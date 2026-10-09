import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import { VIOLATION_TYPES } from '../../constants.js';
import reportApi from '../../api/reportApi.js';
import { showToast } from '../common/ToastHost.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ReportModal({ show, onHide, job }) {
  const { user } = useAuth();
  const [reasonId, setReasonId] = useState(VIOLATION_TYPES[0].id);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reasonId) {
      setError('Vui lòng chọn lý do vi phạm.');
      return;
    }

    const selectedReason = VIOLATION_TYPES.find((v) => v.id === reasonId);

    setLoading(true);
    setError('');

    try {
      await reportApi.createReport({
        targetType: 'JOB',
        targetId: job?.id,
        targetTitle: job?.title,
        companyName: job?.companyName,
        reporterName: user?.displayName || user?.fullName || 'Người dùng ẩn danh',
        reporterUsername: user?.username || 'candidate',
        reasonId,
        reasonLabel: selectedReason?.label,
        description: description.trim(),
      });

      showToast('success', 'Báo cáo vi phạm đã được gửi tới Ban Quản Trị để kiểm duyệt!');
      setDescription('');
      onHide();
    } catch {
      setError('Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-bottom pb-2">
          <Modal.Title className="h6 fw-bold d-flex align-items-center gap-2 text-danger mb-0">
            <FaExclamationTriangle /> Báo cáo tin tuyển dụng vi phạm
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-3">
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <div className="p-2.5 bg-light rounded border mb-3 small">
            <div><strong>Tin tuyển dụng:</strong> {job?.title}</div>
            <div className="text-muted"><strong>Công ty:</strong> {job?.companyName} (ID: #{job?.id})</div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">
              Chọn lý do vi phạm <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={reasonId}
              onChange={(e) => setReasonId(e.target.value)}
              className="form-select-sm"
              disabled={loading}
            >
              {VIOLATION_TYPES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="small fw-semibold">
              Mô tả chi tiết bằng chứng vi phạm
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Vui lòng cung cấp thêm chi tiết (ví dụ: yêu cầu đóng tiền, tin sai lệch...)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="small"
            />
            <Form.Text className="text-muted" style={{ fontSize: '11.5px' }}>
              <FaShieldAlt className="me-1 text-primary" />
              Báo cáo của bạn sẽ được bảo mật danh tính và lưu vào lịch sử kiểm duyệt của Admin.
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="border-top pt-2">
          <Button variant="light" size="sm" onClick={onHide} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button variant="danger" size="sm" type="submit" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi báo cáo vi phạm'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
