import api from '../../pages/api';

export const getComments = async (sortOrder = '', page = 1, pageSize = 10, search = '') => {
    const url = `/comments/?page=${page}&page_size=${pageSize}${sortOrder ? `&ordering=${sortOrder}` : ''}${search ? `&search=${search}` : ''}`;
    return await api.get(url);
};

export const addNewComments = async (data) => {
    return await api.post('/comments/', data);
};

export const editComments = async (id, data) => {
    return await api.put(`/comments/${id}/`, data);
};

export const deleteComments = async (id) => {
    return await api.delete(`/comments/${id}/`);
};


export const manyDeleteComments = async (data) => {
    return await api.delete('/comments/many_delete/', { data });
};
