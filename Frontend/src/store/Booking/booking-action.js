import { axiosInstance } from "../../utils/axios";
import { setBookingDetails, setBookings, setBookingRequest } from "./booking-slice";

export const fetchBookingDetails = (bookingId) => async (dispatch) => {
  try {
    dispatch(setBookingRequest());
    const response = await axiosInstance.get(`/v1/rent/booking/${bookingId}`);
    const booking = response.data.data?.booking || response.data.data;
    dispatch(setBookingDetails(booking));
  } catch (error) {
    console.error("Error fetching booking details:", error);
  }
};

export const fetchBookingsDetails = fetchBookingDetails;

export const fetchUserBookings = () => async (dispatch) => {
  try {
    dispatch(setBookingRequest());
    const response = await axiosInstance.get("/v1/rent/booking");
    const bookings =
      response.data?.data?.bookings ||
      response.data?.bookings ||
      response.data?.data ||
      (Array.isArray(response.data) ? response.data : []);
    dispatch(setBookings(bookings));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    dispatch(setBookings([]));
  }
};