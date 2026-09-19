import { createSlice } from "@reduxjs/toolkit";

const propertyDetailSlice = createSlice({
    name: 'propertyDetail',
    initialState: {
        propertydetails: null,
        loading: false,
        error: null,
    },
    reducers: {
        getRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getListRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getPropertyDetails: (state, action) => {
            const payload = action.payload;
            state.propertydetails = payload.data || payload;
            state.loading = false;
        },
        getErrors: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const propertyDetailAction = propertyDetailSlice.actions;
export default propertyDetailSlice.reducer;