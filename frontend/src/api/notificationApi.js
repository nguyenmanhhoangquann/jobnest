import axiosClient from './axiosClient.js';

const USE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK) === 'true';

let mockNotifs = [
  { id: 1, content: 'Hồ sơ ứng tuyển cho vị trí "Senior Fullstack Developer" tại FPT Software đã được chuyển sang trạng thái Đã xem.', isRead: false, createdAt: '2026-10-14T08:00:00' },
  { id: 2, content: 'Trợ lý AI đã phân tích CV của bạn và chấm điểm 94/100 mức độ tương thích.', isRead: false, createdAt: '2026-10-14T07:15:00' },
  { id: 3, content: 'Việc làm mới phù hợp: "Cloud DevOps Specialist (Docker, Kubernetes)" tại Cầu Giấy, Hà Nội.', isRead: false, createdAt: '2026-10-13T14:30:00' },
  { id: 4, content: 'Chào mừng bạn đến với JobNest - Nền tảng tuyển dụng công nghệ thông minh!', isRead: true, createdAt: '2026-10-10T10:00:00' },
];

export const notificationApi = {
  getNotifications: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [...mockNotifs];
    }
    return axiosClient.get('/notifications');
  },

  markAsRead: async (id) => {
    if (USE_MOCK) {
      mockNotifs = mockNotifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      return { success: true };
    }
    return axiosClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    if (USE_MOCK) {
      mockNotifs = mockNotifs.map((n) => ({ ...n, isRead: true }));
      return { success: true };
    }
    return axiosClient.patch('/notifications/read-all');
  },

  deleteNotification: async (id) => {
    if (USE_MOCK) {
      mockNotifs = mockNotifs.filter((n) => n.id !== id);
      return { success: true };
    }
    return axiosClient.delete(`/notifications/${id}`);
  },
};

export default notificationApi;
