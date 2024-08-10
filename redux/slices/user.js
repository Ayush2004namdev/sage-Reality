import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: false,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = false;
        },
    },
})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;