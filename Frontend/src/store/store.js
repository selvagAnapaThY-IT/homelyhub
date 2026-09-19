import { configureStore } from "@reduxjs/toolkit";
import propertyReducer from "./Property/Property-slice";
import propertyDetailReducer from "./PropertyDetails/PropertyDetail-slice";
import userReducer from "./User/user-slice";
import bookingReducer from "./Booking/booking-slice";
import accomodationSlice from "./Accomodation/Accomodation-slice";
import paymentSlice from "./Payment/payment-slice";

const store = configureStore({
    reducer: {
        property: propertyReducer,
        propertyDetails: propertyDetailReducer,
        user: userReducer,
        booking: bookingReducer,
        accomodation: accomodationSlice.reducer,
        payment: paymentSlice.reducer,
    }
});

export default store;