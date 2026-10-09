const STORAGE_KEY = 'jn_reports';

const INITIAL_REPORTS = [
  {
    id: 101,
    targetType: 'JOB',
    targetId: 125,
    targetTitle: 'Tuyển nhân viên nhập liệu tại nhà lương 50tr/tháng',
    companyName: 'Công ty TNHH Đầu tư Thịnh Vượng 4.0',
    reporterName: 'Nguyễn Văn Hùng',
    reporterUsername: 'nguyenvanhung',
    reasonId: 'FEE_EXTORTION',
    reasonLabel: 'Yêu cầu ứng viên nộp tiền / đóng phí bất thường',
    description: 'Yêu cầu chuyển 500.000đ tiền cọc trước khi giao việc.',
    createdAt: '08/10/2026',
    status: 'PENDING',
    adminNote: '',
  },
  {
    id: 102,
    targetType: 'JOB',
    targetId: 125,
    targetTitle: 'Tuyển nhân viên nhập liệu tại nhà lương 50tr/tháng',
    companyName: 'Công ty TNHH Đầu tư Thịnh Vượng 4.0',
    reporterName: 'Lê Thị Thu',
    reporterUsername: 'lethithu',
    reasonId: 'FAKE_JOB',
    reasonLabel: 'Tin tuyển dụng giả, lừa đảo hoặc thông tin sai lệch',
    description: 'Công ty ma, địa chỉ ảo không có thật trên bản đồ.',
    createdAt: '08/10/2026',
    status: 'PENDING',
    adminNote: '',
  },
  {
    id: 103,
    targetType: 'JOB',
    targetId: 88,
    targetTitle: 'Nhân viên lễ tân (Yêu cầu nữ độc thân, dưới 23 tuổi, cao > 1m68)',
    companyName: 'Quán Cafe SkyView',
    reporterName: 'Trần Minh Đức',
    reporterUsername: 'tranminhduc',
    reasonId: 'DISCRIMINATION',
    reasonLabel: 'Nội dung phân biệt giới tính, tuổi, vùng miền, ngoại hình...',
    description: 'Quy định yêu cầu ngoại hình và giới tính trái quy định tuyển dụng.',
    createdAt: '07/10/2026',
    status: 'REVIEWING',
    adminNote: 'Đang liên hệ NTD yêu cầu đính chính nội dung.',
  },
  {
    id: 104,
    targetType: 'USER',
    targetId: 99,
    targetTitle: 'Hồ sơ ứng viên: Bot spam tự động',
    companyName: 'Tài khoản: bot_spammer_99',
    reporterName: 'FPT Software HR',
    reporterUsername: 'fpt_recruitment',
    reasonId: 'DATA_CRAWL_SPAM',
    reasonLabel: 'Thu thập dữ liệu hàng loạt, spam ứng viên',
    description: 'Spam 150 CV rác trong 2 phút bằng công cụ tự động.',
    createdAt: '06/10/2026',
    status: 'RESOLVED',
    adminNote: 'Đã khóa tài khoản vĩnh viễn.',
  },
];

export const reportApi = {
  getReports: async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
        return INITIAL_REPORTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_REPORTS;
    }
  },

  createReport: async (reportData) => {
    const list = await reportApi.getReports();
    const newReport = {
      id: Date.now(),
      targetType: reportData.targetType || 'JOB',
      targetId: reportData.targetId,
      targetTitle: reportData.targetTitle,
      companyName: reportData.companyName || '',
      reporterName: reportData.reporterName || 'Người dùng ẩn danh',
      reporterUsername: reportData.reporterUsername || 'user',
      reasonId: reportData.reasonId,
      reasonLabel: reportData.reasonLabel,
      description: reportData.description || '',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      status: 'PENDING',
      adminNote: '',
    };
    const updated = [newReport, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newReport;
  },

  updateStatus: async (reportId, newStatus, adminNote = '') => {
    const list = await reportApi.getReports();
    const updated = list.map((r) =>
      r.id === reportId ? { ...r, status: newStatus, adminNote: adminNote || r.adminNote } : r
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};

export default reportApi;
