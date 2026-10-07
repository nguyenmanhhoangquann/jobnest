import axiosClient from './axiosClient.js';

const USE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK) !== 'false';

export const authApi = {
  login: async ({ username, password }) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      // Giả lập đăng nhập thành công
      const isEmployer = username.toLowerCase().includes('ntd') || username.toLowerCase().includes('employer');
      return {
        token: 'mock-jwt-token-jobnest-2026',
        user: {
          id: isEmployer ? 1 : 201,
          username,
          role: isEmployer ? 'EMPLOYER' : 'CANDIDATE',
          displayName: isEmployer ? 'Công ty TNHH Ánh Dương' : 'Nguyễn Văn Hùng',
          avatarUrl: '',
        },
      };
    }

    return axiosClient.post('/auth/login', { username, password });
  },

  register: async (formData) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return {
        success: true,
        message: 'Đăng ký tài khoản thành công',
      };
    }

    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return axiosClient.post('/auth/register', formData, { headers });
  },
};

export default authApi;
