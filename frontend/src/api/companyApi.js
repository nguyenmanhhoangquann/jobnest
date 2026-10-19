import axiosClient from './axiosClient.js';
import mockCompanies from '../mock/companies.js';

const companyApi = {
  getCompanies: async (params) => {
    try {
      const res = await axiosClient.get('/companies', { params });
      if (Array.isArray(res) && res.length > 0) {
        const toshiba = mockCompanies.find(
          (c) => c.slug === 'toshiba-software-development-viet-nam-co-ltd' || c.name?.toLowerCase().includes('toshiba')
        );
        const withoutToshiba = res.filter((c) => !c.name?.toLowerCase().includes('toshiba'));
        return toshiba ? [toshiba, ...withoutToshiba] : res;
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
