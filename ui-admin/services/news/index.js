import api from '../../pages/api';


export const getNews = async (sortOrder = '', page = 1, pageSize = 10, search = '') => {
    const url = `/news/?page=${page}&page_size=${pageSize}${sortOrder ? `&ordering=${sortOrder}` : ''}${search ? `&search=${search}` : ''}`;
    return await api.get(url);
};

export const addNewNews = async (data) => {
    return await api.post('/news/', data);
};

export const editNews = async (id, data) => {
    return await api.put(`/news/${id}/`, data);
};

export const deleteNews = async (id) => {
    return await api.delete(`/news/${id}/`);
};

export const manyDeleteNews = async (data) => {
    return await api.delete('/news/many_delete/', { data });
};
