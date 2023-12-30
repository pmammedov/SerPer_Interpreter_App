import Cookies from 'js-cookie';
import axios from 'axios';
import eventEmitter from './events';
import { newRefreshToken } from '../../services/auth';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

let inactivityTimer;

const endSession = () => {
    Cookies.remove('access_token');
    Cookies.remove('refreshToken');
    eventEmitter.emit('unauthorized');
};

const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(endSession, 15 * 60 * 1000); // 15 minutes
};

const refreshTokenIntervalTime = 45 * 60 * 1000; // 45 minutes

export const refreshTokenAfterInterval = () => {
    setInterval(async () => {
        try {
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
                const { data } = await newRefreshToken({ refresh: refreshToken });
                Cookies.set('access_token', data.access);
            }
        } catch (error) {
            console.error('Token renewal error:', error);
        }
    }, refreshTokenIntervalTime);
};

api.interceptors.request.use(
    async (config) => {
        const accessToken = Cookies.get('access_token');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        resetInactivityTimer(); // Reset the inactivity timer for each request
        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('mousedown', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);
        document.addEventListener('touchmove', resetInactivityTimer);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // You can emit a custom event to show an error message to the user
            eventEmitter.emit('unauthorized', { message: 'Session credentials are invalid or expired.' });
            // Instead of ending the session, give the user a chance to take an action
            // For example, you can redirect to the session renewal page
        }
        return Promise.reject(error);
    }
);

export default api;
