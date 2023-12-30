import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

const initialState = {
    accessToken: "",
    refreshToken: "",
}


export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        accessToken: (state, action) => {
            state.accessToken = action.payload
        },
        refreshToken: (state, action) => {
            state.refreshToken = action.payload
        }

    }
})


// Action creators are generated for each case reducer function
export const { accessToken, refreshToken } = tokenSlice.actions


export default tokenSlice.reducer
