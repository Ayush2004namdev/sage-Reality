import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: false,
        dashboardData: [],
        location:null
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
        },
        setUserLocation:(state,action) => {
            state.location = action.payload;
        }
    },
})

export const { login, logout ,setDashboardData , setUserLocation} = userSlice.actions;
export default userSlice.reducer;