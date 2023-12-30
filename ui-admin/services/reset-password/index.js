import api from "../../pages/api";


export const ForgetPassword = async(data) => {
 return   await api.post(`/user/forget_password`, data)
};
export const ResetPasswordService = async (uid, token, formData) => {
    // URL yolunda uid ve token değerlerini, gövdede ise formData objesini gönderiyoruz.
    return await api.post(`/user/reset_password/${uid}/${token}`, formData);
};
