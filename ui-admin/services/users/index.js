import api from '../../pages/api';

export const getUsers = async (sortOrder = '', page = 1, pageSize = 10, search = '') => {
    const url = `/user/superuser/?page=${page}&page_size=${pageSize}${sortOrder ? `&ordering=${sortOrder}` : ''}${search ? `&search=${search}` : ''}`;
    return await api.get(url);
};

export const editUser = async (id, data) => {
    return await api.put(`/user/superuser/${id}/`, data);
};

export const addUser = async (data) => {
    return await api.post('/user/superuser/', data);
};

export const deleteUser = async (id) => {
    return await api.delete(`/user/superuser/${id}/`);
};

export const manyDeleteUsers = async (data) => {
    return await api.delete('/user/superuser/many_delete/', { data });
};

export const userGetMe = async () => {
    return await api.get(`/user/get_me`);
};

export const userUpdateService = async (data) => {
    return await api.put(`/user/update_profile`, data);
};

export const userPasswordUpdate = async (data) => {
    return await api.put(`/user/update_password`, data);
};
