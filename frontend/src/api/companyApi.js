import axiosClient from './axiosClient.js';
import mockCompanies from '../mock/companies.js';

const companyApi = {
  getCompanies: async (params) => {
    try {
      const res = await axiosClient.get('/companies', { params });
      if (Array.isArray(res) && res.length > 0) {
        const toshiba = mockCompanies.find((c) => String(c.id) === '12');
        const existingIds = new Set(res.map((c) => String(c.id)));
        const list = toshiba && !existingIds.has('12') ? [toshiba, ...res] : res;
        return list;
      }
      return mockCompanies;
    } catch {
      return mockCompanies;
    }
  },

  getCompanyDetail: async (id) => {
    try {
      return await axiosClient.get(`/companies/${id}`);
    } catch {
      return mockCompanies.find((c) => String(c.id) === String(id));
    }
  },
};

export default companyApi;
