export const APP_NAME = 'JobNest';

export const NAV_ITEMS = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Việc làm', to: '/jobs' },
  { label: 'Công ty', to: '/companies' },
  { label: 'Bài viết', to: '/blog' },
  { label: 'Về chúng tôi', to: '/about' },
];

export const JOB_TYPES = {
  INTERN: 'Thực tập',
  PART_TIME: 'Part time',
  FULL_TIME: 'Full time',
};

export const EXPERIENCES = {
  none: 'Chưa có kinh nghiệm',
  lt1: 'Dưới 1 năm',
  '1-2': '1 - 2 năm',
  '2-5': '2 - 5 năm',
  gt5: 'Trên 5 năm',
};

export const POSITIONS = {
  intern: 'Thực tập sinh',
  staff: 'Nhân viên',
  specialist: 'Chuyên viên',
  lead: 'Trưởng nhóm',
  manager: 'Quản lý',
  director: 'Giám đốc',
};

export const SALARIES = {
  lt10: 'Dưới 10 triệu',
  '10-15': '10 - 15 triệu',
  '15-20': '15 - 20 triệu',
  '20-30': '20 - 30 triệu',
  '30-50': '30 - 50 triệu',
  gt50: 'Trên 50 triệu',
  deal: 'Thỏa thuận',
};

export const APP_STATUS = {
  PENDING: 'Chờ xử lý',
  VIEWED: 'Đã xem',
  ACCEPTED: 'Phù hợp',
  REJECTED: 'Không phù hợp',
};

export const POPULAR_KEYWORDS = [
  'Java',
  'Python',
  'Frontend',
  'Backend',
  'Marketing',
  'Design',
];

export const CONTACT_INFO = {
  email: 'contact@jobnest.vn',
  hotline: '1900 6868',
  address: 'Tòa nhà Thăng Long, Hà Nội',
  githubRepo: 'https://github.com/nhailong235-create/WEB_TIM_VIEC',
};
