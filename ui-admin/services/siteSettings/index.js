import api from '../../pages/api';


export const getSitesettings = async (data) => {
    return await api.get(`/sitesettings/`, data);
};

export const getSitesettingsId = async (id, data) => {
    return await api.get(`/sitesettings/${id}/`, data);
}

export const editSitesettings = async (id, data) => {
    return await api.put(`/sitesettings/${id}/`, data);
}

export const deleteNews = async (id) => {
    return await api.delete(`/sitesettings/${id}/`);
}
