import api from '../../pages/api';


export const getContact = async (sortOrder = '', page = 1, pageSize = 10, search = '') => {
    const url = `/contact/?page=${page}&page_size=${pageSize}${sortOrder ? `&ordering=${sortOrder}` : ''}${search ? `&search=${search}` : ''}`;
    return await api.get(url);
};

export const getSentContact = async (sortOrder = '', page = 1, pageSize = 10, search = '') => {
    const url = `/contact/?is_reply=True&page=${page}&page_size=${pageSize}${sortOrder ? `&ordering=${sortOrder}` : ''}${search ? `&search=${search}` : ''}`;
    return await api.get(url);
};


export const getContactId = async (id, data) => {
    return await api.get(`/contact/${id}/`, data);
}

export const editContact = async (id, data) => {
    return await api.put(`/contact/${id}/`, data);
}

export const editReply = async (id, data) => {
    return await api.put(`/contact/${id}/reply/`, data);
}

export const deleteContact = async (id) => {
    return await api.delete(`/contact/${id}/`);
}

export const manyDeleteContact = async (data) => {
    return await api.delete('/contact/many_delete/', { data });
};
