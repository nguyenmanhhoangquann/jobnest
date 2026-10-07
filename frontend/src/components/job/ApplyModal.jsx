import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaCloudUploadAlt, FaFileAlt, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { showToast } from '../common/ToastHost.jsx';
import { Spinner } from '../common/Loading.jsx';
import applicationApi from '../../api/applicationApi.js';

export default function ApplyModal({ job, show, onHide, onSuccess }) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      coverLetter: '',
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Kiểm tra định dạng
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidExt) {
      setFileError('Chỉ chấp nhận file định dạng PDF hoặc DOC/DOCX.');
      setSelectedFile(null);
      return;
    }

    // Kiểm tra dung lượng <= 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError('Dung lượng file vượt quá giới hạn 5MB.');
      setSelectedFile(null);
      return;
    }

    setFileError('');
    setSelectedFile(file);
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      setFileError('Vui lòng chọn hoặc tải lên file CV của bạn.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('jobId', job.id);
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('coverLetter', data.coverLetter || '');
      formData.append('cvFile', selectedFile);

      await applicationApi.applyJob(formData);
      showToast('success', 'Nộp hồ sơ ứng tuyển thành công! Nhà tuyển dụng sẽ sớm xem xét hồ sơ của bạn.');
      reset();
      setSelectedFile(null);
      onHide();
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast('error', err.message || 'Có lỗi xảy ra khi nộp hồ sơ, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="apply-modal">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <div>
          <Modal.Title className="fs-5 fw-bold mb-1">Ứng tuyển công việc</Modal.Title>
          <div className="small text-muted">{job.title} - <strong className="text-dark">{job.companyName}</strong></div>
        </div>
      </Modal.Header>

      <Modal.Body className="pt-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">Họ và tên *</label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                placeholder="Nguyễn Văn A"
                {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
              />
              {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
            </div>

            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">Số điện thoại *</label>
              <input
                type="text"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="0912345678"
                {...register('phone', {
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: { value: /^[0-9]{9,11}$/, message: 'Số điện thoại không hợp lệ' },
                })}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Email nhận phản hồi *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="candidate@example.com"
              {...register('email', {
                required: 'Vui lòng nhập email',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Email không hợp lệ' },
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          {/* Vùng upload file CV */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Đính kèm CV ứng tuyển (PDF / DOCX, tối đa 5MB) *</label>
            <div className="cv-upload-area p-3 text-center rounded border border-dashed">
              <input
                type="file"
                id="cv-file-input"
                className="d-none"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              {selectedFile ? (
                <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded">
                  <div className="d-flex align-items-center gap-2 text-start text-truncate">
                    <FaFileAlt className="text-primary fs-4 shrink-0" />
                    <div>
                      <div className="fw-semibold small text-truncate" style={{ maxWidth: '240px' }}>
                        {selectedFile.name}
                      </div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger p-0 ms-2"
                    onClick={() => setSelectedFile(null)}
                    title="Xóa file đã chọn"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <label htmlFor="cv-file-input" className="cursor-pointer mb-0 d-block py-2">
                  <FaCloudUploadAlt size={36} className="text-muted mb-2" />
                  <div className="small fw-semibold text-primary">Bấm để chọn file CV từ máy tính</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Hỗ trợ định dạng .pdf, .docx</div>
                </label>
              )}
            </div>
            {fileError && <div className="text-danger small mt-1">{fileError}</div>}
          </div>

          {/* Thư giới thiệu */}
          <div className="mb-4">
            <label className="form-label small fw-semibold">Thư giới thiệu / Lời nhắn (Tùy chọn)</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Giới thiệu ngắn về kinh nghiệm, thế mạnh nổi bật của bạn phù hợp với vị trí này..."
              {...register('coverLetter')}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button type="button" className="btn btn-outline-secondary" onClick={onHide} disabled={submitting}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-brand px-4 fw-semibold" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : 'Nộp hồ sơ ngay'}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
