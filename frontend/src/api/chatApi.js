import axiosClient from './axiosClient.js';

const USE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK) !== 'false';

export const chatApi = {
  sendMessage: async ({ message, history = [] }) => {
    if (USE_MOCK) {
      // Mô phỏng độ trễ suy nghĩ của AI (700ms)
      await new Promise((r) => setTimeout(r, 700));

      const lower = message.toLowerCase();
      let reply = 'Chào bạn! Tôi là trợ lý ảo JobNest. Bạn cần hỗ trợ thêm thông tin về việc làm, viết CV hay đăng tin tuyển dụng không?';

      if (lower.includes('cv') || lower.includes('hồ sơ')) {
        reply = 'Để có một CV ấn tượng, bạn nên nêu rõ: 1. Mục tiêu nghề nghiệp cụ thể. 2. Các dự án thực tế đã làm cùng công nghệ sử dụng. 3. Thành tích đo lường được (số liệu định lượng). JobNest chúc bạn ứng tuyển thành công!';
      } else if (lower.includes('phỏng vấn')) {
        reply = 'Khi phỏng vấn, hãy chuẩn bị kỹ phần giới thiệu bản thân trong 2 phút, tìm hiểu sâu về sản phẩm của công ty, và luôn chuẩn bị 2-3 câu hỏi thông minh để hỏi lại nhà tuyển dụng ở cuối buổi.';
      } else if (lower.includes('ứng tuyển')) {
        reply = 'Bạn chỉ cần bấm nút "Ứng tuyển ngay" trên bài đăng việc làm, tải file CV định dạng PDF lên và gửi thư giới thiệu ngắn gọn. Nhà tuyển dụng sẽ nhận được hồ sơ ngay lập tức!';
      } else if (lower.includes('đăng tin') || lower.includes('tuyển dụng')) {
        reply = 'Để đăng bài tuyển dụng, bạn cần đăng ký tài khoản với vai trò "Nhà tuyển dụng". Sau đó truy cập mục "Đăng bài tuyển dụng" trên thanh điều khiển để tạo tin nhanh chóng với sự hỗ trợ của AI.';
      }

      return { reply };
    }

    return axiosClient.post('/chat', { message, history });
  },
};

export default chatApi;
