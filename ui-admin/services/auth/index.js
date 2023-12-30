import api from "../../pages/api";


async function loginService(data) {
    return await api.post(`/auth/login`, data)
}

async function newRefreshToken(data) {
    return await api.post(`/auth/refresh`, data);
}
async function resetPassword(uid, token, data) {
    return await api.post(`/user/reset-password/${uid}/${token}`, data);
}

export {
    loginService,
    newRefreshToken,
    resetPassword
}
