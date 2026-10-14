import axiosClient from './axiosClient.js';
import { mockApplications } from '../mock/applications.js';

const USE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK) !== 'false';

let applicationsState = [...mockApplications];

export const applicationApi = {
  // Ứng viên nộp CV (Mục 10.1)
  applyJob: async (formData) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      const newApp = {
        id: Date.now(),
        jobId: Number(formData.get ? formData.get('jobId') : formData.jobId),
        jobTitle: 'Việc làm vừa ứng tuyển',
        candidate: {
          id: 201,
          fullName: 'Nguyễn Văn Hùng',
          email: 'hung.nguyen@gmail.com',
        },
        appliedAt: new Date().toISOString(),
        status: 'PENDING',
        cvUrl: '/files/cv_sample.pdf',
        coverLetter: formData.get ? formData.get('coverLetter') : formData.coverLetter,
        aiScore: null,
      };
      applicationsState.unshift(newApp);
      return { success: true, application: newApp };
    }

    return axiosClient.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Ứng viên xem danh sách việc đã ứng tuyển (Mục 13.1)
  getMyApplications: async (params = {}) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      let filtered = [...applicationsState];

      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter((a) => a.status === params.status);
      }

      const pageIndex = params.page ? Math.max(0, Number(params.page) - 1) : 0;
      const pageSize = Number(params.size) || 10;
      const totalElements = filtered.length;
      const totalPages = Math.ceil(totalElements / pageSize) || 1;
      const content = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

      return {
        content,
        number: pageIndex,
        size: pageSize,
        totalElements,
        totalPages,
      };
    }

    return axiosClient.get('/applications/mine', { params });
  },

  // Nhà tuyển dụng xem danh sách CV đã nhận (Mục 14.2)
  getReceivedApplications: async (params = {}) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      let filtered = [...applicationsState];

      if (params.jobId && params.jobId !== 'all') {
        filtered = filtered.filter((a) => String(a.jobId) === String(params.jobId));
      }

      if (params.status && params.status !== 'ALL') {
        filtered = filtered.filter((a) => a.status === params.status);
      }

      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.candidate.fullName.toLowerCase().includes(kw) ||
            a.candidate.email.toLowerCase().includes(kw) ||
            a.jobTitle.toLowerCase().includes(kw)
        );
      }

      const pageIndex = params.page ? Math.max(0, Number(params.page) - 1) : 0;
      const pageSize = Number(params.size) || 10;
      const totalElements = filtered.length;
      const totalPages = Math.ceil(totalElements / pageSize) || 1;
      const content = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

      return {
        content,
        number: pageIndex,
        size: pageSize,
        totalElements,
        totalPages,
      };
    }

    return axiosClient.get('/applications/received', { params });
  },

  // Nhà tuyển dụng cập nhật trạng thái CV (Mục 14.2)
  updateStatus: async (id, status) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      applicationsState = applicationsState.map((a) =>
        String(a.id) === String(id) ? { ...a, status } : a
      );
      return { success: true };
    }

    return axiosClient.patch(`/applications/${id}/status`, { status });
  },

  // Nhà tuyển dụng gỡ bỏ hồ sơ ứng tuyển
  deleteApplication: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      applicationsState = applicationsState.filter((a) => String(a.id) !== String(id));
      return { success: true };
    }

    return axiosClient.delete(`/applications/${id}`);
  },
};

export default applicationApi;
