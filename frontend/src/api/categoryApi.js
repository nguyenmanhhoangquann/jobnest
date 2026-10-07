import axiosClient from './axiosClient.js';
import { mockCategories } from '../mock/categories.js';

const USE_MOCK = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK) !== 'false';

export const categoryApi = {
  getCategories: async ({ top } = {}) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      if (top) {
        return mockCategories.slice(0, Number(top));
      }
      return mockCategories;
    }
    return axiosClient.get('/categories', { params: { top } });
  },
};

export default categoryApi;
