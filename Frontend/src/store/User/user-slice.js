import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null,
    success: false
};

const userSlice = createSlice({
    name: "user",
    initialState,

    reducers: {

        // Signup
        getSignupRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        getSignupDetails: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },

        // Login
        getLoginRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        getLoginDetails: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },

        // Error
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get current user
        getCurrentRequest: (state) => {
            state.loading = true;
        },

        getCurrentUser: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        // Update user
        getUpdateUserRequest: (state) => {
            state.loading = true;
        },

        // Logout
        getLogoutRequest: (state) => {
            state.loading = true;
        },

        getLogout: (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },

        // Password
        getPasswordRequest: (state) => {
            state.loading = true;
        },

        getPasswordSuccess: (state, action) => {
            state.loading = false;
            state.success = action.payload;
        },

        // Clear error
        clearErrors: (state) => {
            state.error = null;
        },

        // Clear success
        clearSuccess: (state) => {
            state.success = false;
        }
    }
});

export const UserActions = userSlice.actions;
export const userActions = userSlice.actions;

export default userSlice.reducer;