import api from '../../pages/api';

export const getLanguages = async (sortOrder = '', page = 1, pageSize = 10, search = '') => {
    const url = `/languages/?page=${page}&page_size=${pageSize}${sortOrder ? `&ordering=${sortOrder}` : ''}${search ? `&search=${search}` : ''}`;
    return await api.get(url);
};

export const addNewLanguages = async (data) => {
    return await api.post('/languages/', data);
}

export const editLanguages = async (id, data) => {
    return await api.put(`/languages/${id}/`, data);
}

export const deleteLanguages = async (id) => {
    return await api.delete(`/languages/${id}/`);
}

export const manyDeleteLanguages = async (data) => {
    return await api.delete('/languages/many_delete/', { data });
};
