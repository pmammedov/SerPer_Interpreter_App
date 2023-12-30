import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import tokenSliceReducer from './auth';
import userInfoSlice from './userInfoSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    token: tokenSliceReducer,
    userInfo: userInfoSlice,
});

export default configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
