import axiosClient from './axiosClient.js';

const USE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK) !== 'false';

let mockNotifs = [
  { id: 1, content: 'Hồ sơ ứng tuyển của bạn đã được Nhà tuyển dụng xem.', isRead: false, createdAt: '2026-10-07T08:00:00' },
  { id: 2, content: 'Việc làm "Frontend Developer" mới phù hợp với bạn.', isRead: false, createdAt: '2026-10-07T07:15:00' },
  { id: 3, content: 'Chào mừng bạn đến với nền tảng việc làm JobNest!', isRead: true, createdAt: '2026-10-06T10:00:00' },
];

export const notificationApi = {
  getNotifications: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return [...mockNotifs];
    }
    return axiosClient.get('/notifications');
  },

  markAsRead: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      mockNotifs = mockNotifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      return { success: true };
    }
    return axiosClient.patch(`/notifications/${id}/read`);
  },
};

export default notificationApi;
