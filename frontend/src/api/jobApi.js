import axiosClient from './axiosClient.js';
import { mockJobs } from '../mock/jobs.js';

const USE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK) !== 'false';

// In-memory mock jobs state for mutations (save/create)
let jobsState = [...mockJobs];

const filterMockJobs = (params = {}) => {
  let filtered = [...jobsState];

  // Lọc từ khóa (keyword)
  if (params.keyword && params.keyword.trim()) {
    const kw = params.keyword.trim().toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title?.toLowerCase().includes(kw) ||
        j.company?.name?.toLowerCase().includes(kw) ||
        (j.description && j.description.toLowerCase().includes(kw)) ||
        (j.requirements && j.requirements.toLowerCase().includes(kw)) ||
        (j.skills && j.skills.some((s) => s.toLowerCase().includes(kw)))
    );
  }

  // Lọc ngành nghề (category)
  if (params.category && params.category !== 'all' && params.category !== 'Tất cả') {
    const catQ = params.category.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.category?.slug?.toLowerCase() === catQ ||
        (j.category?.name && j.category.name.toLowerCase().includes(catQ))
    );
  }

  // Lọc khu vực (area)
  if (params.area && params.area !== 'all' && params.area !== 'Tất cả') {
    const areaQ = params.area.toLowerCase().replace(/-/g, ' ').trim();
    const areaSlug = params.area.toLowerCase().trim();
    const normalize = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
    const normQ = normalize(areaQ);

    filtered = filtered.filter((j) => {
      const loc = (j.location || '').toLowerCase();
      const reg = (j.region || '').toLowerCase();
      const ar = (j.area || '').toLowerCase();
      return (
        ar === areaSlug ||
        ar.includes(areaSlug) ||
        loc.includes(areaQ) ||
        reg.includes(areaQ) ||
        normalize(loc).includes(normQ) ||
        normalize(reg).includes(normQ)
      );
    });
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
    if (params.salary === 'under10' || params.salary === 'under-10') {
      filtered = filtered.filter((j) => (j.salaryMax || 0) > 0 && (j.salaryMax || 0) <= 10);
    } else if (params.salary === '10-20') {
      filtered = filtered.filter((j) => (j.salaryMax || 0) >= 10 && (j.salaryMin || 0) <= 20);
    } else if (params.salary === '20-30') {
      filtered = filtered.filter((j) => (j.salaryMax || 0) >= 20 && (j.salaryMin || 0) <= 30);
    } else if (params.salary === 'over30' || params.salary === 'over-30') {
      filtered = filtered.filter((j) => (j.salaryMax || 0) >= 30);
    }
  }

  // Sắp xếp
  if (params.sort === 'salary_desc') {
    filtered.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
  } else if (params.sort === 'salary_asc') {
    filtered.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
  } else {
    filtered.sort((a, b) => {
      if (b.createdAt && a.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return (b.id || 0) - (a.id || 0);
    });
  }

  // Phân trang kiểu Spring Data
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
};

const OLD_MOCK_SEEDED = ['1021', '101', '104', '113'];
const cleanupLegacySeed = () => {
  try {
    if (typeof localStorage === 'undefined') return;
    if (localStorage.getItem('jn_seed_cleaned_v3')) return;
    const raw = localStorage.getItem('jn_local_saved_jobs');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 4 && parsed.every((id) => OLD_MOCK_SEEDED.includes(String(id)))) {
        localStorage.removeItem('jn_local_saved_jobs');
        localStorage.removeItem('jn_saved_jobs_full');
      }
    }
    localStorage.setItem('jn_seed_cleaned_v3', 'true');
  } catch {}
};
cleanupLegacySeed();

const getSavedJobsList = () => {
  try {
    const raw = localStorage.getItem('jn_saved_jobs_full');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const seen = new Set();
        return parsed.filter((j) => {
          const sid = String(j?.id);
          if (!sid || seen.has(sid)) return false;
          seen.add(sid);
          return true;
        });
      }
    }
    return [];
  } catch {
    return [];
  }
};

const getLocalSavedIds = () => {
  return getSavedJobsList().map((j) => String(j.id));
};

export const jobApi = {
  getLocalSavedIds,
  getSavedJobsList,

  // Lấy danh sách việc làm có lọc và phân trang (Mục 15.5)
  getJobs: async (params = {}) => {
    if (!USE_MOCK) {
      try {
        const res = await axiosClient.get('/jobs', { params });
        if (res && ((Array.isArray(res.content) && res.content.length > 0) || (Array.isArray(res) && res.length > 0))) {
          return Array.isArray(res)
            ? {
                content: res,
                totalElements: res.length,
                totalPages: 1,
                number: 0,
                size: res.length,
              }
            : res;
        }
      } catch {
        // Fallback to mock data below
      }
    }

    await new Promise((r) => setTimeout(r, 200));
    return filterMockJobs(params);
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
        const areaQ = params.area.toLowerCase().replace(/-/g, ' ').trim();
        const areaSlug = params.area.toLowerCase().trim();
        const normalize = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
        const normQ = normalize(areaQ);

        filtered = filtered.filter((j) => {
          const loc = (j.location || '').toLowerCase();
          const reg = (j.region || '').toLowerCase();
          const ar = (j.area || '').toLowerCase();
          return (
            ar === areaSlug ||
            ar.includes(areaSlug) ||
            loc.includes(areaQ) ||
            reg.includes(areaQ) ||
            normalize(loc).includes(normQ) ||
            normalize(reg).includes(normQ)
          );
        });
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
      await new Promise((r) => setTimeout(r, 200));
      let job = jobsState.find((j) => String(j.id) === String(id));
      if (!job) {
        // Fallback tự nhiên nếu ID không có trong danh sách mock (như id 98)
        const sample = jobsState[0] || mockJobs[0];
        if (sample) {
          job = { ...sample, id: Number(id) || id };
        } else {
          const error = new Error('Không tìm thấy việc làm');
          error.response = { status: 404 };
          throw error;
        }
      }
      return job;
    }

    try {
      return await axiosClient.get(`/jobs/${id}`);
    } catch (err) {
      // Nếu backend đang cold-start hoặc lỗi mạng, tự động fallback về dữ liệu mẫu để giao diện luôn hiển thị
      const sample = mockJobs.find((j) => String(j.id) === String(id)) || mockJobs[0];
      if (sample) {
        return { ...sample, id: Number(id) || id };
      }
      throw err;
    }
  },

  getJobById: async (id) => {
    return jobApi.getJobDetail(id);
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

  // Sửa tin tuyển dụng
  updateJob: async (id, data) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      jobsState = jobsState.map((j) => {
        if (String(j.id) === String(id)) {
          return {
            ...j,
            ...data,
            category:
              typeof data.category === 'string'
                ? { id: j.category?.id || 1, slug: data.category, name: data.category }
                : data.category || j.category,
            updatedAt: new Date().toISOString(),
          };
        }
        return j;
      });
      return jobsState.find((j) => String(j.id) === String(id));
    }

    return axiosClient.put(`/jobs/${id}`, data);
  },

  // Gỡ / Xóa tin tuyển dụng
  deleteJob: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      jobsState = jobsState.filter((j) => String(j.id) !== String(id));
      return { success: true };
    }

    return axiosClient.delete(`/jobs/${id}`);
  },

  // Lưu tin tuyển dụng (Mục 8.2)
  saveJob: async (jobId, jobData) => {
    const strId = String(jobId);
    const savedList = getSavedJobsList();
    if (!savedList.some((j) => String(j.id) === strId)) {
      const fullJob =
        jobData ||
        mockJobs.find((j) => String(j.id) === strId) ||
        jobsState.find((j) => String(j.id) === strId) || {
          id: jobId,
          title: `Việc làm #${jobId}`,
          company: { name: 'Doanh nghiệp uy tín' },
          salaryText: 'Thoả thuận',
          location: 'Toàn quốc',
        };
      const updatedList = [{ ...fullJob, saved: true }, ...savedList];
      localStorage.setItem('jn_saved_jobs_full', JSON.stringify(updatedList));
      localStorage.setItem('jn_local_saved_jobs', JSON.stringify(updatedList.map((j) => String(j.id))));
    }

    jobsState = jobsState.map((j) =>
      String(j.id) === strId ? { ...j, saved: true } : j
    );
    window.dispatchEvent(new CustomEvent('saved-jobs-updated', { detail: { id: strId, saved: true } }));

    if (!USE_MOCK) {
      try {
        await axiosClient.post(`/saved-jobs/${jobId}`);
      } catch {}
    }
    return { success: true };
  },

  // Bỏ lưu tin tuyển dụng (Mục 8.2)
  unsaveJob: async (jobId) => {
    const strId = String(jobId);
    const savedList = getSavedJobsList();
    const updatedList = savedList.filter((j) => String(j.id) !== strId);
    localStorage.setItem('jn_saved_jobs_full', JSON.stringify(updatedList));
    localStorage.setItem('jn_local_saved_jobs', JSON.stringify(updatedList.map((j) => String(j.id))));

    jobsState = jobsState.map((j) =>
      String(j.id) === strId ? { ...j, saved: false } : j
    );
    window.dispatchEvent(new CustomEvent('saved-jobs-updated', { detail: { id: strId, saved: false } }));

    if (!USE_MOCK) {
      try {
        await axiosClient.delete(`/saved-jobs/${jobId}`);
      } catch {}
    }
    return { success: true };
  },

  // Danh sách việc làm đã lưu của ứng viên (Mục 13.2)
  getSavedJobs: async (params = {}) => {
    const savedList = getSavedJobsList();
    return {
      content: savedList,
      totalElements: savedList.length,
    };
  },

  // Tin tuyển dụng của chính NTD
  getMyJobs: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return jobsState.slice(0, 5);
    }
    return axiosClient.get('/jobs/mine');
  },
};

export default jobApi;
