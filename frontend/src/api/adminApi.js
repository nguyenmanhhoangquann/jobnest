import axiosClient from './axiosClient.js';

const USE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK) === 'true';

export const adminApi = {
  getStats: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        totalUsers: 1420,
        totalEmployers: 320,
        activeJobs: 2450,
        pendingReports: 2,
        pendingCompanies: 7,
      };
    }
    return axiosClient.get('/admin/stats');
  },

  getUsers: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [
        { id: 1, username: 'admin', fullName: 'Ban Quản Trị Hệ Thống', email: 'admin@jobnest.vn', role: 'ADMIN' },
        { id: 2, username: 'tuyendung', fullName: 'Ban Tuyển Dụng FPT', companyName: 'TẬP ĐOÀN CÔNG NGHỆ FPT', email: 'tuyendung@fpt.com.vn', role: 'EMPLOYER' },
        { id: 3, username: 'ungvien', fullName: 'Nguyễn Văn Hùng', email: 'hung.nguyen@gmail.com', role: 'CANDIDATE' },
      ];
    }
    return axiosClient.get('/admin/users');
  },

  deleteUser: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return { success: true };
    }
    return axiosClient.delete(`/admin/users/${id}`);
  },

  getAdminJobs: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [];
    }
    return axiosClient.get('/admin/jobs');
  },

  deleteJob: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return { success: true };
    }
    return axiosClient.delete(`/admin/jobs/${id}`);
  },

  getCompanies: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [];
    }
    return axiosClient.get('/admin/companies');
  },
};

export default adminApi;
