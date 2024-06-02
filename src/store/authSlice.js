import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // initial state will be for checking is user logged in or not
    status : false,
    userData : null
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        login : (state, action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout : (state) => {
            state.status = false,
            state.userData = null;
        }
    }
})

const authReducers = authSlice.reducer;

export default authReducers;

export const {login, logout} = authSlice.actions;

