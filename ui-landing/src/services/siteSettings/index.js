import {api} from "../api";

export const getSitesettings = async () => {
    return await api.get('/sitesettings/1/');
};