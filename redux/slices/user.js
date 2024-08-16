import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: false,
        dashboardData: []
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = false;
        },
        setDashboardData : (state,action) => {
            state.dashboardData = action.payload;
        }
    },
})

export const { login, logout ,setDashboardData} = userSlice.actions;
export default userSlice.reducer;