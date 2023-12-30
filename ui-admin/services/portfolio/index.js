import api from '../../pages/api';

export const getPortfolio = async (sortOrder = '', page = 1, pageSize = 10, search = '') => {
    const url = `/portfolio/?page=${page}&page_size=${pageSize}${sortOrder ? `&ordering=${sortOrder}` : ''}${search ? `&search=${search}` : ''}`;
    return await api.get(url);
};
export const addPortfolio = async (data) => {
    return await api.post(`/portfolio/`, data);
};
export const editPortfolio = async (id, data) => {
    return await api.put(`/portfolio/${id}/`, data);
};

export const manyDeletePortfolio = async (data) => {
    return await api.delete('/portfolio/many_delete/', { data });
};

export const deletePortfolio = async (id) => {
    return await api.delete(`/portfolio/${id}/`);
};
