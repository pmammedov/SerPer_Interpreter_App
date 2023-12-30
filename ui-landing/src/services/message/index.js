import {api} from "../api";

export const addContact = async (dataComment) => {
    return await api.post('/contact/', dataComment);
};
