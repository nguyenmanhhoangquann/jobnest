import axiosClient from './axiosClient.js';
import { mockJobs } from '../mock/jobs.js';

const USE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK) !== 'false';

// In-memory mock jobs state for mutations (save/create)
let jobsState = [...mockJobs];

export const jobApi = {
  // Lấy danh sách việc làm có lọc và phân trang (Mục 15.5)
  getJobs: async (params = {}) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      let filtered = [...jobsState];

      // Lọc từ khóa (keyword)
      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(kw) ||
            j.company.name.toLowerCase().includes(kw) ||
            (j.description && j.description.toLowerCase().includes(kw))
        );
      }

      // Lọc ngành nghề (category)
      if (params.category && params.category !== 'all' && params.category !== 'Tất cả') {
        filtered = filtered.filter((j) => j.category?.slug === params.category);
      }

      // Lọc khu vực (area)
      if (params.area && params.area !== 'all' && params.area !== 'Tất cả') {
        const a = params.area.toLowerCase();
        filtered = filtered.filter(
          (j) =>
            (j.area && j.area.toLowerCase().includes(a)) ||
            (j.location && j.location.toLowerCase().includes(a)) ||
            (j.region && j.region.toLowerCase().includes(a))
        );
      }

      // Lọc kinh nghiệm (experience)
      if (params.experience && params.experience !== 'all') {
        filtered = filtered.filter((j) => j.experience === params.experience);
      }

      // Lọc loại hình (jobType - có thể là mảng cách nhau dấu phẩy)
      if (params.jobType && params.jobType !== 'all') {
        const types = String(params.jobType).split(',');
        filtered = filtered.filter((j) => types.includes(j.jobType));
      }

      // Lọc cấp bậc (position)
      if (params.position && params.position !== 'all') {
        filtered = filtered.filter((j) => j.position === params.position);
      }

      // Lọc mức lương (salary)
      if (params.salary && params.salary !== 'all') {
        if (params.salary === 'under10') {
          filtered = filtered.filter((j) => (j.salaryMax || 0) > 0 && (j.salaryMax || 0) <= 10);
        } else if (params.salary === '10-20') {
          filtered = filtered.filter((j) => (j.salaryMax || 0) >= 10 && (j.salaryMin || 0) <= 20);
        } else if (params.salary === '20-30') {
          filtered = filtered.filter((j) => (j.salaryMax || 0) >= 20 && (j.salaryMin || 0) <= 30);
        } else if (params.salary === 'over30') {
          filtered = filtered.filter((j) => (j.salaryMax || 0) >= 30);
        }
      }

      // Sắp xếp
      if (params.sort === 'salary_desc') {
        filtered.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
      } else {
        // Mặc định: mới nhất
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // Phân trang kiểu Spring Data (page đếm từ 0 ở backend, từ 1 ở frontend)
      const pageIndex = params.page ? Math.max(0, Number(params.page) - 1) : 0;
      const pageSize = Number(params.size) || 12;
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

    return axiosClient.get('/jobs', { params });
  },

  // Lấy việc làm ngẫu nhiên cho Trang chủ (Mục 7.8, 15.4)
  getRandomJobs: async (params = {}) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      let filtered = [...jobsState];

      if (params.type && params.type !== 'ALL') {
        filtered = filtered.filter((j) => j.jobType === params.type);
      }

      if (params.area && params.area !== 'all' && params.area !== 'Tất cả') {
        const a = params.area.toLowerCase();
        filtered = filtered.filter(
          (j) =>
            (j.area && j.area.toLowerCase().includes(a)) ||
            (j.location && j.location.toLowerCase().includes(a)) ||
            (j.region && j.region.toLowerCase().includes(a))
        );
      }

      // Shuffle random
      filtered.sort(() => 0.5 - Math.random());
      const limit = Number(params.limit) || 9;
      return filtered.slice(0, limit);
    }

    return axiosClient.get('/jobs/random', { params });
  },

  // Chi tiết việc làm (Mục 10)
  getJobDetail: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const job = jobsState.find((j) => String(j.id) === String(id));
      if (!job) {
        const error = new Error('Không tìm thấy việc làm');
        error.response = { status: 404 };
        throw error;
      }
      return job;
    }

    return axiosClient.get(`/jobs/${id}`);
  },

  // Đăng tin tuyển dụng (Mục 14.4)
  createJob: async (data) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const newJob = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        saved: false,
      };
      jobsState.unshift(newJob);
      return newJob;
    }

    return axiosClient.post('/jobs', data);
  },

  // Lưu tin tuyển dụng (Mục 8.2)
  saveJob: async (jobId) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      jobsState = jobsState.map((j) =>
        String(j.id) === String(jobId) ? { ...j, saved: true } : j
      );
      return { success: true };
    }

    return axiosClient.post(`/saved-jobs/${jobId}`);
  },

  // Bỏ lưu tin tuyển dụng (Mục 8.2)
  unsaveJob: async (jobId) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      jobsState = jobsState.map((j) =>
        String(j.id) === String(jobId) ? { ...j, saved: false } : j
      );
      return { success: true };
    }

    return axiosClient.delete(`/saved-jobs/${jobId}`);
  },

  // Danh sách việc làm đã lưu của ứng viên (Mục 13.2)
  getSavedJobs: async (params = {}) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const savedJobs = jobsState.filter((j) => j.saved);
      const pageIndex = params.page ? Math.max(0, Number(params.page) - 1) : 0;
      const pageSize = Number(params.size) || 12;
      const totalElements = savedJobs.length;
      const totalPages = Math.ceil(totalElements / pageSize) || 1;
      const content = savedJobs.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

      return {
        content,
        number: pageIndex,
        size: pageSize,
        totalElements,
        totalPages,
      };
    }

    return axiosClient.get('/saved-jobs', { params });
  },
};

export default jobApi;
