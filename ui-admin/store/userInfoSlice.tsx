import { createSlice } from '@reduxjs/toolkit';

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        userInfo: [],
    },
    reducers: {
        userInfo: (state, action) => {
            state.userInfo = action.payload;
        },
    },
});

export const { userInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
