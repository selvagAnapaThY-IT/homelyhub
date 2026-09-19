import {Property} from "../models/propertymodel.js";
import {Booking} from "../models/bookingModel.js";

const createOrder = async (req, res) => {
  
    const {amount,propertyId, fromDate, toDate, guests} = req.body;

    const orderId="order_"+Date.now();
    res.json({
        success:true,
        message:"Order created successfully",
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guests
    })
}

const verifyPayment = async (req, res) => {
  try {
    const { orderId, bookingDetails, forceStatus, paymentId } = req.body;

    if (forceStatus === "success") {
      const userId = req.user._id || req.user.id;
      const newBooking = await Booking.create({
        property: bookingDetails.propertyId,
        user: userId,
        price: bookingDetails.price,
        fromDate: bookingDetails.fromDate,
        fromdate: bookingDetails.fromDate,
        toDate: bookingDetails.toDate,
        todate: bookingDetails.toDate,
        guests: bookingDetails.guests,
        guest: bookingDetails.guests,
        numberOfNights: bookingDetails.nights,
        numberofnights: bookingDetails.nights,
        paid: true,
      });

      await Property.findByIdAndUpdate(
        bookingDetails.propertyId,
        {
          $push: {
            currentBookings: {
              bookingId: newBooking._id,
              fromDate: bookingDetails.fromDate,
              toDate: bookingDetails.toDate,
              userId: userId,
            },
          },
        }
      );

      res.json({
        success: true,
        message: "Payment verified and booking created successfully",
        paymentId,
        orderId,
        bookingId: newBooking._id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
        orderId,
      });
    }
  } catch (error) {
    console.error("verifyPayment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const bookings = await Booking.find({ user: userId });
        res.status(200).json({
            status: "success",
            data: {
                bookings
            }
        });
    } catch (error) {
        console.error("getUserBookings Error:", error);
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

const getBookingsDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("property");
    if (!booking) {
      return res.status(404).json({ status: "fail", message: "Booking not found" });
    }
    res.status(200).json({ status: "success", data: { booking } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};


export {getBookingsDetails,getUserBookings,createOrder,verifyPayment};