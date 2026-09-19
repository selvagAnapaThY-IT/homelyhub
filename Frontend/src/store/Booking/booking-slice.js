import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  bookingDetails: {},
  loading: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingRequest: (state) => {
      state.loading = true;
    },
    setBookings: (state, action) => {
      state.loading = false;
      state.bookings = action.payload || [];
    },
    addBooking: (state, action) => {
      if (!state.bookings) state.bookings = [];
      state.bookings.push(action.payload);
    },
    setBookingDetails: (state, action) => {
      state.loading = false;
      state.bookingDetails = action.payload;
    },
  },
});

export const {
  setBookingRequest,
  setBookings,
  addBooking,
  setBookingDetails,
} = bookingSlice.actions;

export const BookingActions = bookingSlice.actions;
export default bookingSlice.reducer;