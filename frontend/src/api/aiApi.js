import axiosClient from './axiosClient.js';
import { mockApplications } from '../mock/applications.js';

const USE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK) !== 'false';

export const aiApi = {
  // AI Đánh giá CV (Mục 14.3)
  reviewCv: async ({ applicationId }) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1200)); // Mô phỏng phân tích AI
      const app = mockApplications.find((a) => String(a.id) === String(applicationId));

      if (app && app.aiReview) {
        return app.aiReview;
      }

      return {
        score: 82,
        verdict: 'SUITABLE',
        strengths: [
          'Kỹ năng công nghệ khớp với yêu cầu vị trí tuyển dụng',
          'Trải nghiệm thực tế với các công cụ phát triển phần mềm',
          'Trình bày hồ sơ súc tích, logic và chuyên nghiệp',
        ],
        weaknesses: [
          'Cần bổ sung thêm các số liệu chứng minh hiệu quả công việc',
        ],
        summary: 'Hồ sơ đạt tiêu chuẩn tốt, đáp ứng đa số tiêu chí của vị trí. Đề xuất xếp lịch phỏng vấn chuyên môn.',
      };
    }

    return axiosClient.post('/ai/review-cv', { applicationId }, { timeout: 60000 });
  },

  // AI Gợi ý mô tả việc làm JD (Mục 14.4)
  generateJd: async ({ keywords, title }) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 900));
      return {
        description: `Chúng tôi đang tìm kiếm nhân sự tài năng cho vị trí ${title || 'Chuyên viên'}.\n- Trực tiếp tham gia triển khai các dự án trọng điểm cùng đội ngũ chuyên gia.\n- Đề xuất các sáng kiến cải tiến quy trình và tối ưu hóa hiệu quả hoạt động.\n- Báo cáo định kỳ tiến độ công việc cho cấp quản lý.`,
        requirements: `- Có từ 1-2 năm kinh nghiệm thực tế liên quan đến các kỹ năng: ${keywords || 'chuyên môn'}.\n- Khả năng làm việc độc lập và phối hợp nhóm hiệu quả.\n- Tinh thần trách nhiệm cao, chủ động trong công việc.`,
        benefits: `- Mức thu nhập cạnh tranh, đánh giá tăng lương định kỳ hàng năm.\n- Được hưởng đầy đủ quyền lợi bảo hiểm và phúc lợi xã hội theo luật định.\n- Cơ hội tham gia các khóa đào tạo nâng cao kỹ năng nghề nghiệp.`,
      };
    }

    return axiosClient.post('/ai/generate-jd', { keywords, title }, { timeout: 60000 });
  },
};

export default aiApi;
