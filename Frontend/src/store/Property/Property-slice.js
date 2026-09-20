import { createSlice } from '@reduxjs/toolkit';

const propertySlice = createSlice({
    name: 'property',
    initialState: {
        properties: [],
        totalProperties: 0,
        loading: false,
        error: null,
        searchParams: {},
    },
    reducers: {
        getRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getProperties: (state, action) => {
            const payload = action.payload;
            if (Array.isArray(payload)) {
                state.properties = payload;
                state.totalProperties = payload.length;
            } else if (payload && typeof payload === 'object') {
                state.properties = payload.data || payload.properties || [];
                state.totalProperties = payload.totalProperties ?? payload.no_of_responses ?? state.properties.length;
            } else {
                state.properties = [];
                state.totalProperties = 0;
            }
            state.loading = false;
        },
        getErrors: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        getError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateSearchParams: (state, action) => {
            if (Object.keys(action.payload || {}).length === 0) {
                state.searchParams = {};
            } else {
                state.searchParams = { ...state.searchParams, ...action.payload };
            }
        },
    },
});

export const propertyAction = propertySlice.actions;

export default propertySlice.reducer;