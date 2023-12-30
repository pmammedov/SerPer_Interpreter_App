import { toast } from 'react-toastify';

export const succesToastMessage = (values, time, position) => {
    toast.success(`${values}`, {
        position: position || 'top-right',
        autoClose: time || 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
    });
};

export const errorToastMessage = (values, time, position) => {
    toast.error(`${values}`, {
        position: position || 'top-right',
        autoClose: time || 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
    });
};

export const warningToastMessage = (values, time, position) => {
    toast.warning(`${values}`, {
        position: position || 'top-right',
        autoClose: time || 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
    });
};
