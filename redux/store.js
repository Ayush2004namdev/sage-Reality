import { configureStore } from "@reduxjs/toolkit";
import miscReducer from "./slices/misc";
import userReducer from "./slices/user";

const store = configureStore({
    reducer: {
        misc: miscReducer,
        user: userReducer
    },
})

export default store;