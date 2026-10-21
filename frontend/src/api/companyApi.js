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

  getFollowedIds: () => {
    try {
      return JSON.parse(localStorage.getItem('jn_followed_companies') || '[]');
    } catch {
      return [];
    }
  },

  isFollowed: (companyId) => {
    const ids = companyApi.getFollowedIds();
    return ids.some((id) => Number(id) === Number(companyId));
  },

  toggleFollow: (companyId) => {
    const ids = companyApi.getFollowedIds();
    const cId = Number(companyId);
    let updated;
    let nextState = false;
    if (ids.some((id) => Number(id) === cId)) {
      updated = ids.filter((id) => Number(id) !== cId);
      nextState = false;
    } else {
      updated = [...ids, cId];
      nextState = true;
    }
    localStorage.setItem('jn_followed_companies', JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('followed-companies-updated', { detail: { id: cId, followed: nextState } })
    );
    return nextState;
  },

  getFollowedCompanies: async () => {
    const ids = companyApi.getFollowedIds();
    return mockCompanies.filter((c) => ids.some((id) => Number(id) === Number(c.id)));
  },
};

export default companyApi;
